import json
from urllib.parse import unquote

# 1. Load the raw JSON file
input_filename = "sweets_menu.json"
output_filename = "sweets_cleaned.json"

with open(input_filename, "r", encoding="utf-8") as file:
    raw_data = json.load(file)

cleaned_categories = []

# 2. Iterate through categories and clean the fields
for category in raw_data.get("result", {}).get("categories", []):
    category_name = unquote(category.get("name", "")).strip()

    # Extract category image URLs (preserving image_sm and image_big)
    category_image_sm = category.get("image_sm", "")
    category_image_big = category.get("image_big", "")

    # Fallback to category 'images' array if image_sm/image_big are nested or stored there
    if not category_image_sm and category.get("images") and len(category["images"]) > 0:
        category_image_sm = category["images"][0].get("url", "")
    if not category_image_big and category.get("images") and len(category["images"]) > 0:
        category_image_big = category["images"][0].get("url", "")

    cleaned_items = []
    for item in category.get("items", []):
        # Decode URL-encoded text
        item_name = unquote(item.get("name", "")).strip()
        description = unquote(item.get("description", "")).strip()

        # Get primary image URL if available
        image_url = ""
        if item.get("images") and len(item["images"]) > 0:
            image_url = item["images"][0].get("url", "")

        cleaned_items.append(
            {
                "id": item.get("_id"),
                "name": item_name,
                "description": description,
                "price": item.get("price", 0),
                "is_active": item.get("isActive", True),
                "image_url": image_url,
                "image_sm": item.get("image_sm", image_url),
                "image_big": item.get("image_big", image_url),
            }
        )

    cleaned_categories.append(
        {
            "category_id": category.get("_id"),
            "category_name": category_name,
            "position": category.get("position"),
            "image_sm": category_image_sm,
            "image_big": category_image_big,
            "items": cleaned_items,
        }
    )

# 3. Save the structured, cleaned data
cleaned_output = {"categories": cleaned_categories}

with open(output_filename, "w", encoding="utf-8") as file:
    json.dump(cleaned_output, file, indent=2, ensure_ascii=False)

print(f"Data successfully cleaned from '{input_filename}' and saved to '{output_filename}'!")