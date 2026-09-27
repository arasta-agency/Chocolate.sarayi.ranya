import csv
import random

# Sample Kurdish Sorani First Names
first_names = [
    "ئاری", "ڕێبین", "دیار", "شێركۆ", "کاروان", "سۆران", "هێمن", "زانا",
    "کۆسار", "هەڵکەوت", "پشتیوان", "ژینۆ", "تانیا", "تارا", "لەنیا", "کوردستان",
    "نیشتمان", "سۆزان", "ژیان", "شنۆ", "سارا", "بەرزان", "هاوڕێ", "بەختیار"
]

# Sample Kurdish Sorani Last/Family Names
last_names = [
    "مەحمود", "ئەحمەد", "قادر", "سەعيد", "عەبدوڵڵا", "كەریم", "عومەر", "حەسەن",
    "عوسمان", "بابان", "سۆران", "موكری", "گەرمیانی", "جاف", "مەنگوڕی", "خۆشناو"
]

# Sample Kurdish Cities
cities = ["سلێمانی", "هەولێر", "دهۆک", "هەڵەبجە", "کەرکووک", "ڕانیە", "کۆیە", "سۆران"]

# Sample Professions (in Sorani)
professions = [
    "مامۆستا", "پزیشک", "ئەندازیار", "گەشەپێدەری سۆفتوێر", "ڕۆژنامەنوس",
    "ژمێریار", "بازرگان", "پارێزەر", "وێنەگر", "دیزاینەر"
]

# Generate 15,000 rows
num_records = 15000
file_name = "kurdish_sorani_data.csv"

# Field names for the CSV columns
fieldnames = ["ID", "ناو", "شاری نیشتەجێبوون", "تەمەن", "پیشە", "مووچە (USD)"]

with open(file_name, mode="w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file)
    # Write header
    writer.writerow(fieldnames)
    
    # Write 15,000 generated records
    for i in range(1, num_records + 1):
        full_name = f"{random.choice(first_names)} {random.choice(last_names)}"
        city = random.choice(cities)
        age = random.randint(18, 65)
        profession = random.choice(professions)
        salary = random.randint(400, 3500)
        
        writer.writerow([i, full_name, city, age, profession, salary])

print(f"Successfully generated '{file_name}' with {num_records} records.")