import json
import os
import urllib.parse

# List of all files that need URL-decoding
files_to_decode = [
    'Ar_beverage_menu.json',
    'Ar_food_menu.json',
    'Ar_sweets_menu.json',
    'Ku_beverage_menu.json',
    'Ku_food_menu.json',
    'Ku_sweets_menu.json'
]

def recursive_decode(data):
    """Recursively search and decode percent-encoded strings in dicts and lists."""
    if isinstance(data, str):
        # Unquote URL-encoded strings (e.g., %D9%86%D8%A7%D9%86%DB%8C -> نانی)
        try:
            return urllib.parse.unquote(data)
        except Exception:
            return data
    elif isinstance(data, dict):
        return {key: recursive_decode(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [recursive_decode(item) for item in data]
    else:
        return data

def main():
    for file_name in files_to_decode:
        if not os.path.exists(file_name):
            print(f"⚠️  Skipped (File not found): {file_name}")
            continue

        print(f"Processing {file_name}...")
        
        # 1. Read raw JSON
        with open(file_name, 'r', encoding='utf-8') as f:
            try:
                raw_json = json.load(f)
            except json.JSONDecodeError as e:
                print(f"❌ Error reading {file_name}: {e}")
                continue

        # 2. Decode all encoded strings recursively
        decoded_json = recursive_decode(raw_json)

        # 3. Save decoded JSON back to the file with clean UTF-8 encoding
        with open(file_name, 'w', encoding='utf-8') as f:
            json.dump(decoded_json, f, ensure_ascii=False, indent=2)

        print(f"✅ Decoded and updated: {file_name}")

if __name__ == '__main__':
    main()