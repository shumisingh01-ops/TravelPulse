
const resultsContainer = document.getElementById("resultsContainer");

const savedResults = sessionStorage.getItem("travelpulseResults");

// Currency formatting
function formatRupees(value) {
    return `₹${Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 0
    })}`;
}

// Safely create text elements
function createText(parent, tag, content, className = "") {

    const element = document.createElement(tag);
    element.textContent = content;

    if (className) {
        element.className = className;
    }

    parent.appendChild(element);

    return element;
}

if (resultsContainer) {

    if (!savedResults) {

        resultsContainer.innerHTML = `
            <p>
                No search results found.
                Please return to the planner and plan your trip.
            </p>
        `;

    } else {

        try {

            const destinations = JSON.parse(savedResults);

            if (
                !Array.isArray(destinations) ||
                destinations.length === 0
            ) {

                resultsContainer.innerHTML = `
                    <p>
                        No matching destinations found.
                        Try increasing your budget or changing
                        your preferences.
                    </p>
                `;

            } else {

                resultsContainer.replaceChildren();

                destinations.forEach(function (destination) {

                    // MAIN CARD
                    const card = document.createElement("div");
                    card.className = "trip-result";

                    // DESTINATION IMAGE
                    const image = document.createElement("img");

                    image.className = "destination-image";
                    image.alt = destination.Destination;

                    image.src =
                        `/static/images/${
                            encodeURIComponent(
                                String(destination.Destination).toLowerCase()
                            )
                        }.jpg`;

                    image.onerror = function () {
                        this.style.display = "none";
                    };

                    card.appendChild(image);

                    // DESTINATION DETAILS
                    createText(
                        card,
                        "h3",
                        destination.Destination,
                        "destination-name"
                    );

                    createText(
                        card,
                        "p",
                        `State: ${destination.State}`
                    );

                    // EXPLORE BUTTON
                    const link = document.createElement("a");

                    link.className = "explore-btn";
                    link.textContent = "Explore Destination ↗";

                    link.href =
                        `/destination/${
                            encodeURIComponent(destination.Destination)
                        }`;

                    card.appendChild(link);

                    // EXISTING BUDGET BREAKDOWN
                    createText(card, "h4", "Trip Budget Breakdown");

                    createText(
                        card,
                        "p",
                        `Stay + Food: ${formatRupees(destination.Stay_Food_Cost)}`
                    );

                    createText(
                        card,
                        "p",
                        `Transport: ${formatRupees(destination.Transport_Cost)}`
                    );

                    createText(
                        card,
                        "p",
                        `Emergency Buffer: ${
                            formatRupees(destination.Emergency_Buffer)
                        }`
                    );

                    card.appendChild(document.createElement("hr"));

                    createText(
                        card,
                        "h3",
                        `Total Estimated Cost: ${
                            formatRupees(destination.Estimated_Cost)
                        }`
                    );

                    createText(
                        card,
                        "p",
                        `Recommended Days: ${destination.Recommended_Days}`
                    );

                    createText(
                        card,
                        "p",
                        `Crowd: ${destination.Crowd_Level}`
                    );

                    createText(
                        card,
                        "h4",
                        `TravelPulse Score: ${
                            destination.TravelPulse_Score
                        }/100`
                    );

                    // ==================================
                    // NEW: BUDGET UTILIZATION
                    // ==================================

                    const utilization = Number(
                        destination.Budget_Utilization
                    );

                    if (Number.isFinite(utilization)) {

                        const budgetSection = document.createElement("div");
                        budgetSection.className = "budget-utilization";

                        createText(
                            budgetSection,
                            "h4",
                            "Your Budget Utilization"
                        );

                        createText(
                            budgetSection,
                            "p",
                            `${utilization.toFixed(1)}% of your budget`
                        );

                        const progressTrack = document.createElement("div");
                        progressTrack.className = "budget-progress-track";

                        const progressFill = document.createElement("div");
                        progressFill.className = "budget-progress-fill";

                        progressFill.style.width =
                            `${Math.min(100, Math.max(0, utilization))}%`;

                        progressTrack.appendChild(progressFill);
                        budgetSection.appendChild(progressTrack);

                        createText(
                            budgetSection,
                            "p",
                            `${formatRupees(destination.Budget_Remaining)} remaining`,
                            "budget-remaining"
                        );

                        card.appendChild(budgetSection);
                    }

                    // ==================================
                    // NEW: WHY THIS DESTINATION?
                    // ==================================

                    const reasons = destination.Recommendation_Reasons;

                    if (Array.isArray(reasons) && reasons.length > 0) {

                        const reasonSection = document.createElement("div");
                        reasonSection.className = "recommendation-reasons";

                        createText(
                            reasonSection,
                            "h4",
                            "✦ Why This Destination?"
                        );

                        const list = document.createElement("ul");

                        reasons.forEach(function (reason) {

                            const item = document.createElement("li");
                            item.textContent = reason;

                            list.appendChild(item);
                        });

                        reasonSection.appendChild(list);
                        card.appendChild(reasonSection);
                    }

                    // ADD FINISHED CARD
                    resultsContainer.appendChild(card);

                });

            }

        } catch (error) {

            console.error(error);

            resultsContainer.textContent =
                "Unable to load results. Please try searching again.";

        }

    }

}
