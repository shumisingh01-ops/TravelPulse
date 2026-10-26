
import pandas as pd

# Load datasets
attractions = pd.read_csv("attractions.csv")
hotels = pd.read_csv("hotels.csv")
restaurants = pd.read_csv("restaurants.csv")
cafes = pd.read_csv("cafes.csv")
medical = pd.read_csv("medical_stores.csv")

# Test destination
destination = "Munnar"

print("\n===== TRAVELPULSE DATA TEST =====")

print("\nATTRACTIONS")
print(attractions[attractions["Destination"] == destination])

print("\nHOTELS")
print(hotels[hotels["Destination"] == destination])

print("\nRESTAURANTS")
print(restaurants[restaurants["Destination"] == destination])

print("\nCAFES")
print(cafes[cafes["Destination"] == destination])

print("\nMEDICAL STORES")
print(medical[medical["Destination"] == destination])
