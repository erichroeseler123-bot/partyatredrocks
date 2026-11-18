"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, Calendar, CheckCircle2, History, Search, X } from "lucide-react";
import {
  buildPreviewQaMultiDateFixture,
  formatFullShowDate,
  resolveInitialRedRocksShow,
  resolveRedRocksDateSelection,
  searchRedRocksShows,
  type CanonicalRedRocksBookingShow,
  type DateResolutionResult,
} from "@/lib/shows/redRocksBookingCatalog";
import { trackNetworkEvent } from "@/lib/networkEvents";

export type SelectedBookingContext = {
  show: CanonicalRedRocksBookingShow | null;
  partySize: number;
  vehicleSlug: "suv" | "van";
};

type Props = {
  catalog: CanonicalRedRocksBookingShow[];
  todayDateKey: string;
  entrySurface: "/" | "/book/red-rocks-amphitheatre/private" | "/quick-red-rocks" | "checkout";
  mode?: "navigate" | "inline";
  initialShowId?: string | null;
  initialDateKey?: string | null;
  initialArtist?: string | null;
  initialPartySize?: number | null;
  initialVehicleSlug?: "suv" | "van";
  preservedQueryParams?: Record<string, string | undefined>;
  showAllInOptionBPricing?: boolean;
  onSelectionChange?: (ctx: SelectedBookingContext) => void;
};

const SUBURBAN_BASE = 499;
const SUBURBAN_FEE = 19.96;
const SUBURBAN_TOTAL = 518.96;

const VAN_BASE = 699;
const VAN_FEE = 27.96;
const VAN_TOTAL = 726.96;

export function ParrShowBookingSelector({
  catalog,
  todayDateKey,
  entrySurface,
  mode = "navigate",
  initialShowId,
  initialDateKey,
  initialArtist,
  initialPartySize,
  initialVehicleSlug,
  preservedQueryParams,
  showAllInOptionBPricing = true,
  onSelectionChange,
}: Props) {
  const uid = useId();
  const dateInputId = `${uid}-show-date`;
  const searchInputId = `${uid}-artist-search`;
  const searchLabelId = `${uid}-artist-search-label`;
  const listboxId = `${uid}-artist-listbox`;
  const partySelectId = `${uid}-party-size`;

  const [qaExtraShows, setQaExtraShows] = useState<CanonicalRedRocksBookingShow[]>([]);
  const [runtimeCheckoutFlag, setRuntimeCheckoutFlag] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    const isPreviewHost = host.includes("vercel.app") || host === "localhost" || host === "127.0.0.1";
    const sp = new URLSearchParams(window.location.search);
    const chk = sp.get("checkout");
    if (chk) setRuntimeCheckoutFlag(chk);
    if (isPreviewHost && sp.get("qa_multi_date") === "1") {
      setQaExtraShows(buildPreviewQaMultiDateFixture(todayDateKey));
    }
  }, [todayDateKey]);

  const effectiveCatalog = useMemo(() => {
    if (qaExtraShows.length === 0) return catalog;
    const map = new Map(catalog.map((s) => [s.id, s]));
    for (const extra of qaExtraShows) map.set(extra.id, extra);
    return Array.from(map.values()).sort((a, b) => {
      const d = a.dateKey.localeCompare(b.dateKey);
      return d !== 0 ? d : a.startLocal.localeCompare(b.startLocal);
    });
  }, [catalog, qaExtraShows]);

  const initialResolution = useMemo(
    () =>
      resolveInitialRedRocksShow(
        {
          showId: initialShowId,
          dateKey: initialDateKey,
          artist: initialArtist,
        },
        effectiveCatalog,
        todayDateKey
      ),
    [effectiveCatalog, initialArtist, initialDateKey, initialShowId, todayDateKey]
  );

  const initialResolvedShow =
    initialResolution.kind === "single_future_show" || initialResolution.kind === "past_show"
      ? initialResolution.show
      : null;

  const [dateValue, setDateValue] = useState<string>(
    initialResolvedShow?.dateKey || (initialDateKey && /^\d{4}-\d{2}-\d{2}$/.test(initialDateKey) ? initialDateKey : "")
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [selectedShow, setSelectedShow] = useState<CanonicalRedRocksBookingShow | null>(initialResolvedShow);
  const [dateResolution, setDateResolution] = useState<DateResolutionResult>(initialResolution);

  const clampedInitialParty =
    typeof initialPartySize === "number" && initialPartySize >= 1 && initialPartySize <= 10
      ? initialPartySize
      : initialVehicleSlug === "van"
        ? 8
        : 4;

  const [partySize, setPartySize] = useState<number>(clampedInitialParty);
  const [manualVanUpgrade, setManualVanUpgrade] = useState<boolean>(initialVehicleSlug === "van");

  const vehicleSlug: "suv" | "van" = partySize > 6 || manualVanUpgrade ? "van" : "suv";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const searchResults = useMemo(
    () => (searchQuery.trim().length >= 1 ? searchRedRocksShows(searchQuery, effectiveCatalog, 8) : []),
    [effectiveCatalog, searchQuery]
  );

  const hasTypedQueryWithZeroMatches = searchQuery.trim().length >= 2 && searchResults.length === 0;

  useEffect(() => {
    onSelectionChange?.({
      show: selectedShow,
      partySize,
      vehicleSlug,
    });
  }, [onSelectionChange, partySize, selectedShow, vehicleSlug]);

  useEffect(() => {
    function handleOutsideClick(ev: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(ev.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  function selectCanonicalShow(show: CanonicalRedRocksBookingShow, trigger: "date" | "search" | "multi") {
    const normalizedShow: CanonicalRedRocksBookingShow = {
      ...show,
      isPastShow: show.isPastShow || show.dateKey < todayDateKey,
    };
    setSelectedShow(normalizedShow);
    setDateValue(normalizedShow.dateKey);
    setSearchQuery("");
    setIsSearchOpen(false);
    setActiveIndex(-1);
    setDateResolution(
      normalizedShow.isPastShow
        ? { kind: "past_show", show: normalizedShow }
        : { kind: "single_future_show", show: normalizedShow }
    );

    trackNetworkEvent({
      eventName: "date_selected",
      entryPage: entrySurface,
      date: normalizedShow.dateKey,
      travelIntent: `red-rocks-${trigger}`,
    });
  }

  function handleDateChange(nextDate: string) {
    setDateValue(nextDate);
    setSearchQuery("");
    setIsSearchOpen(false);
    setActiveIndex(-1);

    const res = resolveRedRocksDateSelection(nextDate, effectiveCatalog, todayDateKey);
    setDateResolution(res);

    if (res.kind === "single_future_show") {
      selectCanonicalShow(res.show, "date");
    } else if (res.kind === "past_show") {
      selectCanonicalShow(res.show, "date");
    } else {
      setSelectedShow(null);
    }
  }

  function handleSearchChange(nextQuery: string) {
    setSearchQuery(nextQuery);
    setIsSearchOpen(nextQuery.trim().length >= 1);
    setActiveIndex(0);
    if (nextQuery.trim().length > 0 && dateResolution.kind !== "empty") {
      setDateValue("");
      setDateResolution({ kind: "empty" });
    }
  }

  function handleSearchKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (!isSearchOpen && (ev.key === "ArrowDown" || ev.key === "ArrowUp") && searchResults.length > 0) {
      ev.preventDefault();
      setIsSearchOpen(true);
      setActiveIndex(0);
      return;
    }

    if (ev.key === "ArrowDown") {
      if (searchResults.length === 0) return;
      ev.preventDefault();
      setActiveIndex((prev) => (prev + 1) % searchResults.length);
    } else if (ev.key === "ArrowUp") {
      if (searchResults.length === 0) return;
      ev.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? searchResults.length - 1 : prev - 1));
    } else if (ev.key === "Home" && isSearchOpen && searchResults.length > 0) {
      ev.preventDefault();
      setActiveIndex(0);
    } else if (ev.key === "End" && isSearchOpen && searchResults.length > 0) {
      ev.preventDefault();
      setActiveIndex(searchResults.length - 1);
    } else if (ev.key === "Enter" && searchQuery.trim().length > 0) {
      if (searchResults.length > 0) {
        ev.preventDefault();
        const idx = activeIndex >= 0 && activeIndex < searchResults.length ? activeIndex : 0;
        selectCanonicalShow(searchResults[idx], "search");
      } else {
        ev.preventDefault();
      }
    } else if (ev.key === "Escape") {
      if (isSearchOpen) {
        ev.preventDefault();
        setIsSearchOpen(false);
        setActiveIndex(-1);
      }
    }
  }

  function handleChangeShow() {
    setSelectedShow(null);
    setDateValue("");
    setSearchQuery("");
    setIsSearchOpen(false);
    setActiveIndex(-1);
    setDateResolution({ kind: "empty" });
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }

  function handlePartySizeChange(nextSize: number) {
    setPartySize(nextSize);
    if (nextSize > 6) {
      setManualVanUpgrade(true);
    } else if (manualVanUpgrade && nextSize <= 6) {
      setManualVanUpgrade(false);
    }
  }

  const continueHref = useMemo(() => {
    if (!selectedShow || selectedShow.isPastShow) return "/red-rocks/concerts";
    const params = new URLSearchParams();
    if (preservedQueryParams) {
      for (const [k, v] of Object.entries(preservedQueryParams)) {
        if (v && !["date", "artist", "event", "show", "partySize", "qty"].includes(k)) {
          params.set(k, v);
        }
      }
    }
    if (runtimeCheckoutFlag && !params.has("checkout")) {
      params.set("checkout", runtimeCheckoutFlag);
    }
    params.set("date", selectedShow.dateKey);
    params.set("artist", selectedShow.title);
    params.set("show", selectedShow.id);
    params.set("partySize", String(partySize));
    params.set("qty", "1");
    return `/book/red-rocks-amphitheatre/private/${vehicleSlug}?${params.toString()}`;
  }, [partySize, preservedQueryParams, runtimeCheckoutFlag, selectedShow, vehicleSlug]);

  const activeTotal = vehicleSlug === "van" ? VAN_TOTAL : SUBURBAN_TOTAL;
  const activeBase = vehicleSlug === "van" ? VAN_BASE : SUBURBAN_BASE;
  const activeFee = vehicleSlug === "van" ? VAN_FEE : SUBURBAN_FEE;
  const activeVehicleLabel = vehicleSlug === "van" ? "Private Van" : "Private Suburban";

  return (
    <div
      ref={containerRef}
      data-testid="parr-show-booking-selector"
      className="w-full rounded-[20px] border border-white/16 bg-[#090e1a]/95 p-3.5 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md sm:rounded-[24px] sm:p-6"
    >
      {!selectedShow ? (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10.5px] font-black uppercase tracking-[0.15em] text-[#ffb07c] sm:text-xs sm:tracking-[0.18em]">
              Start With Your Concert Date or Artist
            </span>
            <Link
              href="/red-rocks/concerts"
              className="text-xs font-bold text-white/80 underline decoration-white/30 hover:text-[#ffb07c]"
            >
              2027 Concert Calendar →
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.1fr)] md:items-end">
            {/* Option 1: Enter the concert date */}
            <div className="min-w-0">
              <label
                htmlFor={dateInputId}
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-white/90 sm:text-[13px]"
              >
                <Calendar className="h-3.5 w-3.5 shrink-0 text-[#ffb07c]" />
                <span>What date is your show?</span>
              </label>
              <input
                id={dateInputId}
                data-testid="show-date-input"
                type="date"
                value={dateValue}
                onChange={(e) => handleDateChange(e.target.value)}
                className="min-h-11 w-full min-w-0 rounded-xl border border-white/20 bg-[#0f172a] px-3.5 py-2.5 text-base font-medium text-white focus:border-[#ffb07c] focus:outline-none sm:text-sm"
              />
            </div>

            <div
              aria-hidden="true"
              className="flex items-center justify-center text-[11px] font-black uppercase tracking-[0.18em] text-white/45 md:pb-3"
            >
              or
            </div>

            {/* Option 2: Search by artist or show */}
            <div className="relative min-w-0">
              <label
                id={searchLabelId}
                htmlFor={searchInputId}
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-white/90 sm:text-[13px]"
              >
                <Search className="h-3.5 w-3.5 shrink-0 text-[#ffb07c]" />
                <span>Search artist or show</span>
              </label>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  id={searchInputId}
                  data-testid="artist-search-input"
                  type="text"
                  role="combobox"
                  aria-labelledby={searchLabelId}
                  aria-autocomplete="list"
                  aria-expanded={isSearchOpen && searchResults.length > 0}
                  aria-controls={listboxId}
                  aria-activedescendant={
                    isSearchOpen && activeIndex >= 0 && searchResults[activeIndex]
                      ? `${listboxId}-opt-${activeIndex}`
                      : undefined
                  }
                  inputMode="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  placeholder="e.g. Porter Robinson, Queens of the Stone Age, Sublime…"
                  value={searchQuery}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 1) setIsSearchOpen(true);
                  }}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="min-h-11 w-full min-w-0 rounded-xl border border-white/20 bg-[#0f172a] pl-3.5 pr-10 py-2.5 text-base font-medium text-white placeholder:text-white/40 focus:border-[#ffb07c] focus:outline-none sm:text-sm"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    aria-label="Clear artist search"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                      setActiveIndex(-1);
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/65 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              {isSearchOpen && searchResults.length > 0 ? (
                <div
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={searchLabelId}
                  data-testid="artist-search-listbox"
                  className="absolute left-0 right-0 z-50 mt-1.5 max-h-72 overflow-y-auto overscroll-contain rounded-2xl border border-white/20 bg-[#0d1527] p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
                >
                  {searchResults.map((item, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        ref={(el) => {
                          optionRefs.current[idx] = el;
                        }}
                        id={`${listboxId}-opt-${idx}`}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        data-testid={`artist-option-${item.id}`}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => selectCanonicalShow(item, "search")}
                        className={[
                          "flex min-h-12 w-full flex-col items-start justify-center rounded-xl px-3 py-2 text-left transition",
                          isActive ? "bg-[#ffb07c]/18 text-white" : "text-white/90 hover:bg-white/8",
                        ].join(" ")}
                      >
                        <div className="flex w-full flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-bold text-white">{item.title}</span>
                          {item.isPastShow ? (
                            <span className="rounded-full border border-amber-400/35 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                              Past Show
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-0.5 text-xs text-white/70">
                          {item.dateLabel}
                          {item.supportLabel ? ` · w/ ${item.supportLabel}` : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          {/* Multiple events on the same date */}
          {dateResolution.kind === "multiple_shows" ? (
            <div
              data-testid="multi-show-chooser"
              role="region"
              aria-label={`Multiple Red Rocks events on ${dateResolution.dateLabel}`}
              className="mt-3.5 rounded-2xl border border-[#ffb07c]/35 bg-[#0f172a] p-3.5 sm:p-4"
            >
              <div className="text-xs font-black uppercase tracking-[0.14em] text-[#ffb07c]">
                Multiple Events on {dateResolution.dateLabel}
              </div>
              <p className="mt-1 text-xs text-white/80 sm:text-sm">
                Choose which Red Rocks event your group is attending:
              </p>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                {dateResolution.shows.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    data-testid={`multi-show-option-${ev.id}`}
                    onClick={() => selectCanonicalShow(ev, "multi")}
                    className="flex min-h-12 flex-col items-start justify-center rounded-xl border border-white/18 bg-white/5 px-3.5 py-2.5 text-left transition hover:border-[#ffb07c] hover:bg-[#ffb07c]/12"
                  >
                    <span className="text-sm font-bold text-white">{ev.title}</span>
                    <span className="mt-0.5 text-xs text-white/70">
                      {ev.dateLabel} · {ev.startTimeLabel}
                      {ev.supportLabel ? ` · ${ev.supportLabel}` : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Honest no-result state for unknown artist OR unannounced future date */}
          {hasTypedQueryWithZeroMatches || dateResolution.kind === "unannounced_date" ? (
            <div
              data-testid="show-no-result-state"
              role="status"
              className="mt-3.5 rounded-2xl border border-white/16 bg-[#0f172a] p-3.5 text-xs leading-5 text-white/88 sm:p-4 sm:text-sm"
            >
              <p className="font-semibold text-white">
                {hasTypedQueryWithZeroMatches
                  ? `No verified Red Rocks show matches “${searchQuery.trim()}” yet.`
                  : `No verified Red Rocks concert is listed on ${
                      dateResolution.kind === "unannounced_date"
                        ? dateResolution.dateLabel
                        : formatFullShowDate(dateValue)
                    } yet.`}
              </p>
              <p className="mt-1 text-white/75">
                Concerts are added as Red Rocks announces official dates.{" "}
                <Link
                  href="/red-rocks/concerts"
                  className="font-bold text-[#ffb07c] underline hover:text-white"
                >
                  Browse the verified Red Rocks concert calendar →
                </Link>
              </p>
            </div>
          ) : null}

          {/* Unlisted past date */}
          {dateResolution.kind === "past_unlisted_date" ? (
            <div
              data-testid="past-unlisted-date-state"
              role="status"
              className="mt-3.5 rounded-2xl border border-amber-400/35 bg-amber-500/12 p-3.5 text-xs leading-5 text-amber-100 sm:p-4 sm:text-sm"
            >
              <p className="font-semibold text-white">
                {dateResolution.dateLabel} has already passed.
              </p>
              <p className="mt-1 text-amber-100/85">
                Past dates cannot be booked.{" "}
                <Link
                  href="/red-rocks/concerts"
                  className="font-bold text-[#ffb07c] underline hover:text-white"
                >
                  Choose an upcoming 2027 Red Rocks concert →
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        /* Selected Show Card + "Change show" + Past vs Serviceable Flow */
        <div data-testid="selected-show-card" className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3.5 sm:items-center sm:p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-[0.16em] text-emerald-200">
                {selectedShow.isPastShow ? (
                  <>
                    <History className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                    <span className="text-amber-200">Completed Red Rocks Concert</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                    <span>Selected Red Rocks Show</span>
                  </>
                )}
              </div>
              <div
                data-testid="selected-show-title"
                className="mt-1 text-base font-black text-white sm:text-lg"
              >
                {selectedShow.title}
              </div>
              <div data-testid="selected-show-date" className="mt-0.5 text-xs text-white/80 sm:text-sm">
                {selectedShow.fullDateLabel} · {selectedShow.startTimeLabel}
                {selectedShow.supportLabel ? ` · w/ ${selectedShow.supportLabel}` : ""}
              </div>
            </div>

            <button
              type="button"
              data-testid="change-show-btn"
              onClick={handleChangeShow}
              className="min-h-10 shrink-0 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:border-[#ffb07c] hover:bg-white/18"
            >
              Change show
            </button>
          </div>

          {selectedShow.isPastShow ? (
            /* Past Show -> Historical Show State (Never Availability) */
            <div
              data-testid="historical-show-state"
              role="status"
              className="rounded-2xl border border-amber-400/35 bg-amber-500/12 p-4 text-sm text-amber-100"
            >
              <p className="font-bold text-white">
                This concert took place on {selectedShow.fullDateLabel} and is now in our historical show archive.
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-100/90 sm:text-sm">
                Past concerts cannot proceed to vehicle availability. View archived show details or pick an upcoming 2027 concert night.
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <Link
                  href={selectedShow.showHref}
                  data-testid="historical-show-link"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white no-underline transition hover:bg-white/25"
                >
                  View Historical Show Page →
                </Link>
                <Link
                  href="/red-rocks/concerts"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#ff7a4d] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
                >
                  Browse 2027 Concerts →
                </Link>
              </div>
            </div>
          ) : (
            /* Future Serviceable Show -> Party Size, Vehicle & Availability */
            <div data-testid="serviceable-show-flow" className="space-y-3.5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor={partySelectId}
                    className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-white/85"
                  >
                    Party Size (1 Private Vehicle)
                  </label>
                  <select
                    id={partySelectId}
                    data-testid="party-size-select"
                    value={partySize}
                    onChange={(e) => handlePartySizeChange(Number(e.target.value))}
                    className="min-h-11 w-full rounded-xl border border-white/20 bg-[#0f172a] px-3.5 py-2.5 text-base font-semibold text-white focus:border-[#ffb07c] focus:outline-none sm:text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n} className="bg-[#0f172a] text-white">
                        {n} {n === 1 ? "Guest" : "Guests"} ({n <= 6 ? "Fits Suburban or Van" : "10-Passenger Van"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-white/85">
                    Private Vehicle
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={partySize > 6}
                      data-testid="choose-suv-pill"
                      onClick={() => setManualVanUpgrade(false)}
                      className={[
                        "min-h-11 rounded-xl border px-3 py-2 text-left text-xs transition",
                        vehicleSlug === "suv"
                          ? "border-[#ffb07c] bg-[#ffb07c]/18 text-white"
                          : partySize > 6
                            ? "cursor-not-allowed border-white/10 bg-white/5 text-white/35"
                            : "border-white/16 bg-[#0f172a] text-white/80 hover:border-white/35",
                      ].join(" ")}
                    >
                      <div className="font-black">Suburban (1–6)</div>
                      <div className="text-[11px] font-bold text-[#ffb07c]">
                        {showAllInOptionBPricing ? `$${SUBURBAN_TOTAL.toFixed(2)} total` : `$${SUBURBAN_BASE}`}
                      </div>
                    </button>

                    <button
                      type="button"
                      data-testid="choose-van-pill"
                      onClick={() => setManualVanUpgrade(true)}
                      className={[
                        "min-h-11 rounded-xl border px-3 py-2 text-left text-xs transition",
                        vehicleSlug === "van"
                          ? "border-[#ffb07c] bg-[#ffb07c]/18 text-white"
                          : "border-white/16 bg-[#0f172a] text-white/80 hover:border-white/35",
                      ].join(" ")}
                    >
                      <div className="font-black">Private Van (1–10)</div>
                      <div className="text-[11px] font-bold text-[#ffb07c]">
                        {showAllInOptionBPricing ? `$${VAN_TOTAL.toFixed(2)} total` : `$${VAN_BASE}`}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-black/30 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                <div>
                  <div className="text-base font-black text-white sm:text-lg">
                    {showAllInOptionBPricing
                      ? `Total charged at booking: $${activeTotal.toFixed(2)}`
                      : `${activeVehicleLabel}: $${activeBase}`}
                  </div>
                  {showAllInOptionBPricing ? (
                    <div className="mt-0.5 text-xs text-white/75">
                      {activeVehicleLabel}: ${activeBase.toFixed(2)} + Booking fee (4%): ${activeFee.toFixed(2)} · Tailgate gear &amp; waiting driver included
                    </div>
                  ) : null}
                </div>

                {mode === "navigate" ? (
                  <Link
                    href={continueHref}
                    data-testid="continue-to-availability-btn"
                    onClick={() =>
                      trackNetworkEvent({
                        eventName: "availability_started",
                        entryPage: entrySurface,
                        date: selectedShow.dateKey,
                        travelIntent: "red-rocks-concert",
                      })
                    }
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ff7a4d] px-5 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-[#140804] no-underline shadow-[0_12px_30px_rgba(255,122,77,0.35)] transition hover:bg-[#ff926b]"
                  >
                    <span>Continue to Availability</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/70">
                <span>
                  11+ guests or 2+ vehicles?{" "}
                  <Link
                    href="/red-rocks/group-transportation"
                    className="font-bold text-[#ffb07c] underline hover:text-white"
                  >
                    Group transportation options →
                  </Link>
                </span>
                <Link
                  href={selectedShow.showHref}
                  className="font-semibold text-white/75 underline hover:text-white"
                >
                  Show page &amp; pickup timing →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
