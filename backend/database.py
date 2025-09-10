# database.py
import sqlite3
import random
from datetime import datetime, timedelta

TOTAL_TRAINSETS = 50

def getRandomElement(arr):
    return random.choice(arr)

def getRandomInt(min_val, max_val):
    return random.randint(min_val, max_val)

def getRandomFloat(min_val, max_val):
    return random.uniform(min_val, max_val)

def addDays(date_str, days):
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    new_date_obj = date_obj + timedelta(days=days)
    return new_date_obj.strftime("%Y-%m-%d")

def calculateHealthScore(mileage, age, efficiency, brake_wear, telecom_clearance, metro_age_years):
    # Simplified health score calculation (example)
    score = (
        (mileage * -0.01) +
        (age * -0.5) +
        (efficiency * 10) +
        (brake_wear * -0.2) +
        (telecom_clearance * 0.1) +
        (metro_age_years * -0.2)
    )
    return max(0, min(100, int(score)))

