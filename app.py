
from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)


# HOME PAGE
@app.route("/")
def home():
    return render_template("index.html")


# RESULTS PAGE
@app.route("/results")
def results_page():
    return render_template("results.html")


# SEPARATE PLANNER PAGE
@app.route("/planner")
def planner_page():
    return render_template("planner.html")


# TRIP ANALYSIS
@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    budget = float(data["budget"])
    days = int(data["days"])
    category = data["category"]
    crowd = data["crowd"]
    travelers = int(data["travelers"])
    transport = data["transport"]

    # Basic validation
    if budget <= 0 or days <= 0 or travelers <= 0:
        return jsonify({
            "error": "Please enter valid trip details."
        }), 400

    print("Travelers:", travelers)
    print("Transport:", transport)

    df = pd.read_csv("destination.csv")

    # REAL BUDGET ENGINE
    df["Stay_Food_Cost"] = (
        df["Avg_Daily_Cost"] * days * travelers
    )

    transport_costs = {
        "Bus": 1000,
        "Train": 1800,
        "Flight": 6000,
        "Car": 2500
    }

    if transport not in transport_costs:
        return jsonify({
            "error": "Invalid transport option."
        }), 400

    df["Transport_Cost"] = (
        transport_costs[transport] * travelers
    )

    df["Emergency_Buffer"] = (
        df["Stay_Food_Cost"] + df["Transport_Cost"]
    ) * 0.10

    df["Estimated_Cost"] = (
        df["Stay_Food_Cost"]
        + df["Transport_Cost"]
        + df["Emergency_Buffer"]
    ).round(0)

    # BUDGET FILTER
    result = df[df["Estimated_Cost"] <= budget].copy()

    # CATEGORY FILTER
    if category != "All":
        result = result[result["Category"] == category]

    # CROWD FILTER
    if crowd != "All":
        result = result[result["Crowd_Level"] == crowd]

    # TRAVELPULSE SCORE
    result["TravelPulse_Score"] = (
        result["Adventure_Score"]
        + result["Nature_Score"]
        + result["History_Score"]
        + result["Food_Score"]
        + result["Nightlife_Score"]
    ) * 2

    # SORT BY SCORE
    result = result.sort_values(
        by="TravelPulse_Score",
        ascending=False
    )

    # NEW: BUDGET UTILIZATION
    result["Budget_Utilization"] = (
        result["Estimated_Cost"] / budget * 100
    ).round(1)

    result["Budget_Remaining"] = (
        budget - result["Estimated_Cost"]
    ).round(0)

    # NEW: EXPLAINABLE RECOMMENDATIONS
    def explain_destination(row):

        reasons = []

        reasons.append(
            f"Estimated trip cost fits within your ₹{budget:,.0f} budget."
        )

        if category != "All":
            reasons.append(
                f"Matches your selected {category.lower()} travel interest."
            )
        else:
            reasons.append(
                f"Offers a {str(row['Category']).lower()} travel experience."
            )

        if crowd != "All":
            reasons.append(
                f"Matches your preferred {crowd.lower()} crowd level."
            )
        else:
            reasons.append(
                f"Has a {str(row['Crowd_Level']).lower()} crowd level."
            )

        reasons.append(
            f"Ranked using TravelPulse's destination scoring system."
        )

        return reasons

    result["Recommendation_Reasons"] = result.apply(
        explain_destination,
        axis=1
    )

    destinations = result.to_dict(orient="records")

    return jsonify(destinations)


# DESTINATION EXPLORER
@app.route("/destination/<destination_name>")
def destination_details(destination_name):

    destinations_df = pd.read_csv("destination.csv")
    attractions_df = pd.read_csv("attractions.csv")
    hotels_df = pd.read_csv("hotels.csv")
    restaurants_df = pd.read_csv("restaurants.csv")
    cafes_df = pd.read_csv("cafes.csv")
    medical_df = pd.read_csv("medical_stores.csv")

    selected = destinations_df[
        destinations_df["Destination"].str.lower()
        == destination_name.lower()
    ]

    if selected.empty:
        return "Destination not found", 404

    destination = selected.iloc[0].to_dict()

    # Filter records for selected destination
    def get_records(df):

        result = df[
            df["Destination"].str.lower()
            == destination_name.lower()
        ]

        return result.fillna("").to_dict(orient="records")

    return render_template(
        "destination.html",
        destination=destination,
        attractions=get_records(attractions_df),
        hotels=get_records(hotels_df),
        restaurants=get_records(restaurants_df),
        cafes=get_records(cafes_df),
        medical_stores=get_records(medical_df)
    )


if __name__ == "__main__":
    app.run(debug=True)
