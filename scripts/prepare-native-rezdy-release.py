"""PARR's reviewed 2027 product/session migration. No bookings or payments are created.

Run --apply to provision source-verified dates. Run --retire-legacy only after the new
checkout is live. Snapshots outside the repository preserve reversible configuration.
"""
import argparse
import datetime as dt
import json
import pathlib
import urllib.parse
import urllib.request
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parents[1]
EVIDENCE = ROOT.parents[1] / "rezdy"
KEY = (ROOT / ".env.rezdy.local").read_text().strip().split("=", 1)[1]
PRODUCTS = {"P94HN4": ("Suburban", 6, "P0U1MY"), "PU8R6Y": ("Van", 3, "PJM9GD")}


def call(path, body=None, method="GET"):
    req = urllib.request.Request("https://api.rezdy.com/v1/" + path,
        data=json.dumps(body).encode() if body is not None else None, method=method,
        headers={"apiKey": KEY, "Accept": "application/json", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=45) as response:
        data = json.load(response)
    if data.get("requestStatus", {}).get("success") is False:
        raise RuntimeError(str(data["requestStatus"].get("error", "Rezdy rejected request")))
    return data


def sessions(code, start="2027-01-01 00:00:00", end="2027-12-31 23:59:59"):
    out = []
    for offset in range(0, 2000, 100):
        page = call("availability?" + urllib.parse.urlencode(dict(productCode=code,
            startTimeLocal=start, endTimeLocal=end, limit=100, offset=offset))).get("sessions", [])
        out.extend(page)
        if len(page) < 100:
            return out
    raise RuntimeError("Incomplete session pagination")


def upcoming_orders(code):
    out = []
    for offset in range(0, 10000, 100):
        page = call("bookings?" + urllib.parse.urlencode(dict(productCode=code,
            minTourStartTime="2026-11-21T00:00:00Z", minDateCreated="1970-01-01T00:00:00Z",
            limit=100, offset=offset))).get("bookings", [])
        for order in page:
            for item in order.get("items", []):
                if item.get("productCode") != code or item.get("startTimeLocal", "")[:10] < "2026-11-21":
                    continue
                out.append(dict(orderNumber=order["orderNumber"], productCode=code,
                    status=order["status"], totalAmount=order.get("totalAmount"),
                    totalPaid=order.get("totalPaid"), startTimeLocal=item["startTimeLocal"],
                    quantity=sum(q.get("value", 0) for q in item.get("quantities", [])) or 1))
        if len(page) < 100:
            return out
    raise RuntimeError("Incomplete booking pagination")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--retire-legacy", action="store_true")
    args = parser.parse_args()
    verified = json.loads((EVIDENCE / "parr-official-concert-date-verification.json").read_text())
    assert len(verified) == 43 and all(row["verified"] for row in verified)
    dates = sorted({row["dateKey"] for row in verified})
    codes = [*PRODUCTS, *[v[2] for v in PRODUCTS.values()]]
    details = {code: call("products/" + code)["product"] for code in codes}
    orders = [order for code in codes for order in upcoming_orders(code)]
    snapshot = EVIDENCE / "parr-api-migration-config-before.json"
    if not snapshot.exists():
        snapshot.write_text(json.dumps({"products": details, "upcomingOrders": orders}, indent=2))
    created = []
    closed = []
    for code, (vehicle, capacity, legacy) in PRODUCTS.items():
        occupied = Counter()
        for order in orders:
            if order["productCode"] != legacy:
                continue
            if order["status"] in ("QUOTED", "ABANDONED_CART", "CANCELLED"):
                continue
            if order["status"] != "CONFIRMED":
                raise RuntimeError("Unresolved legacy order blocks provisioning")
            occupied[order["startTimeLocal"][:10]] += order["quantity"]
        current = {session["startTimeLocal"][:10]: session for session in sessions(code)}
        if args.apply:
            if details[code].get("charter") or details[code].get("productType") != "TRANSFER":
                raise RuntimeError("Set the new API product type to Transfer in Rezdy first; Private Tour closes the entire date after one booking.")
            # One date contains several vehicles. Charter=true would close the entire
            # date after its FIRST booking, regardless of the remaining vehicle count.
            call("products/" + code, {"name": f"Private Red Rocks {vehicle} — API",
                "internalCode": f"PARR_2027_{vehicle.upper()}_API", "charter": False}, "PUT")
            for date in dates:
                if date in current:
                    continue  # Never overwrite capacity already affected by real reservations.
                remaining = max(0, capacity - occupied[date])
                data = call("availability", {"productCode": code,
                    "startTimeLocal": date + " 00:00:00", "allDay": True,
                    "seats": capacity, "seatsAvailable": remaining}, "POST")
                created.append({"productCode": code, "date": date, "available": remaining})
                (EVIDENCE / "parr-created-production-sessions.json").write_text(json.dumps(created, indent=2))
            if "2027-11-30" in current:
                path = "availability/product/" + code + "/startTimeLocal/" + urllib.parse.quote(current["2027-11-30"]["startTimeLocal"], safe="")
                call(path, {"seatsAvailable": 0}, "PUT")
        if args.retire_legacy:
            legacy_sessions = sessions(legacy, "2026-11-21 00:00:00", "2030-12-31 23:59:59") if details[legacy]["bookingMode"] == "INVENTORY" else []
            legacy_snapshot = EVIDENCE / ("parr-legacy-sessions-before-" + legacy + ".json")
            if not legacy_snapshot.exists():
                legacy_snapshot.write_text(json.dumps(legacy_sessions, indent=2))
            # Keep historical reservations, prices and references; close NEW purchases.
            call("products/" + legacy, {"bookingMode": "INVENTORY"}, "PUT")
            for session in legacy_sessions:
                path = "availability/product/" + legacy + "/startTimeLocal/" + urllib.parse.quote(session["startTimeLocal"], safe="")
                call(path, {"seatsAvailable": 0}, "PUT")
            closed.append(legacy)
    result = {"checkedAt": dt.datetime.now(dt.timezone.utc).isoformat(), "verifiedDates": len(dates),
        "createdSessions": len(created), "retiredOnlineProducts": closed,
        "upcomingOrders": orders, "noBookingsOrPaymentsCreated": True}
    (EVIDENCE / "parr-api-provisioning-result.json").write_text(json.dumps(result, indent=2))
    print(json.dumps({k: v for k, v in result.items() if k != "upcomingOrders"}))


if __name__ == "__main__":
    main()
