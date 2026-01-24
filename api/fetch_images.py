def extract_image(event):
    for performer in event.get("performers", []):
        images = performer.get("images")
        if images and images.get("huge"):
            return images["huge"]
        if performer.get("image"):
            return performer["image"]
    return None
