"""Carbon calculation logic ported from the original JavaScript project."""

EMISSION_FACTORS = {
    "transport": {"car": 0.18, "public": 0.05, "bike": 0.02, "walk": 0.0},
    "energy": {"fossil": 0.6, "mixed": 0.4, "renewable": 0.05},
    "food": {"4+": 9.5, "2-3": 6.85, "1": 5.34, "few": 4.66, "never": 4.11, "no": 0},
    "dairy": {"multiple": 3.0, "daily": 2.0, "few": 1.0, "never": 0.0},
    "shopping": {
        "small_items": {"never": 0, "rarely": 2, "occasionally": 4, "frequently": 7},
        "clothing": {"never": 0, "rarely": 4, "occasionally": 8, "frequently": 15},
        "small_electronics": {"rarely": 6, "1-2 years": 15, "frequently": 30},
        "medium_electronics": {"rarely": 60, "occasionally": 150, "frequently": 300},
        "home_furniture": {"rarely": 15, "occasionally": 30, "frequently": 60},
        "large_appliances": {"when broken": 100, "5-10 years": 250, "3-5 years": 400},
    },
}


def number(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def calculate_emissions(data):
    transport = data.get("transport") or {}
    energy = data.get("energy") or {}
    food = data.get("food") or {}
    shopping = data.get("shopping") or {}

    mode = transport.get("mode", "walk")
    carpool = transport.get("carpool", "no")
    passengers = max(number(transport.get("noOfPassenger"), 1), 1)
    drive_frequency = transport.get("driveFrequency", "never")
    daily_distance = number(transport.get("dailyDistance"))

    transport_emissions = 0.0
    if mode == "car" and drive_frequency:
        transport_emissions = daily_distance * EMISSION_FACTORS["transport"]["car"]
        if carpool == "yes":
            transport_emissions /= passengers
    elif mode in EMISSION_FACTORS["transport"]:
        transport_emissions = daily_distance * EMISSION_FACTORS["transport"][mode]

    energy_type = energy.get("energyType", "fossil")
    electricity_bill = number(energy.get("electricityBill"))
    electricity_emissions = (electricity_bill * EMISSION_FACTORS["energy"].get(energy_type, 0)) / 30

    meat_frequency = food.get("meatFrequency", "no")
    meat_lover = number(food.get("meatLover"), 0)
    dairy_frequency = food.get("dairyFrequency", "never")
    food_emissions = EMISSION_FACTORS["food"].get(meat_frequency, 0)
    if meat_frequency == "4+" and meat_lover:
        food_emissions += meat_lover * 1.2
    food_emissions += EMISSION_FACTORS["dairy"].get(dairy_frequency, 0)

    purchase_category = shopping.get("purchaseCategory", "small_clothing")
    shopping_frequency = shopping.get("shoppingFrequency", "never")
    clothing_purchase = shopping.get("clothingPurchase", "never")
    electronics_replacement = shopping.get("electronicsReplacement", "rarely")
    medium_electronics = shopping.get("mediumElectronics", "rarely")
    home_furniture = shopping.get("homeFurniture", "rarely")
    appliance_replacement = shopping.get("applianceReplacement", "when broken")

    shopping_emissions = 0.0
    if purchase_category == "small_clothing":
        shopping_emissions += EMISSION_FACTORS["shopping"]["small_items"].get(shopping_frequency, 0)
        shopping_emissions += EMISSION_FACTORS["shopping"]["clothing"].get(clothing_purchase, 0)
    elif purchase_category == "electronics":
        shopping_emissions += EMISSION_FACTORS["shopping"]["small_electronics"].get(electronics_replacement, 0)
        shopping_emissions += EMISSION_FACTORS["shopping"]["medium_electronics"].get(medium_electronics, 0)
    elif purchase_category == "home_goods":
        shopping_emissions += EMISSION_FACTORS["shopping"]["home_furniture"].get(home_furniture, 0)
        shopping_emissions += EMISSION_FACTORS["shopping"]["large_appliances"].get(appliance_replacement, 0)

    eco = shopping.get("ecoFriendly", "no")
    if str(eco).lower() in {"true", "yes", "1"}:
        shopping_emissions *= 0.5

    total = transport_emissions + electricity_emissions + food_emissions + shopping_emissions

    # EcoBloom impact classification for an easy-to-understand result.
    if total < 10:
        impact_level = "Low Carbon Impact"
        impact_key = "low"
        impact_message = "Your emissions are currently low. Keep making sustainable choices!"
    elif total <= 20:
        impact_level = "Moderate Carbon Impact"
        impact_key = "moderate"
        impact_message = "Your footprint is moderate. A few changes can help reduce it further."
    else:
        impact_level = "High Carbon Impact"
        impact_key = "high"
        impact_message = "Your footprint is relatively high. Check your largest category for ways to improve."

    return {
        "transportEmissions": round(transport_emissions, 2),
        "electricityEmissions": round(electricity_emissions, 2),
        "foodEmissions": round(food_emissions, 2),
        "shoppingEmissions": round(shopping_emissions, 2),
        "total": round(total, 2),
        "impactLevel": impact_level,
        "impactKey": impact_key,
        "impactMessage": impact_message,
    }
