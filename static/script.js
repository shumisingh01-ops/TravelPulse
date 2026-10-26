
document.getElementById("analyzeBtn").addEventListener("click", async function () {

    const budget = document.getElementById("budget").value;
    const days = document.getElementById("days").value;
    const travelers = document.getElementById("travelers").value;
    const transport = document.getElementById("transport").value;
    const category = document.getElementById("category").value;
    const crowd = document.getElementById("crowd").value;

    const button = document.getElementById("analyzeBtn");

    if (
        !budget || !days || !travelers ||
        Number(budget) <= 0 ||
        Number(days) <= 0 ||
        Number(travelers) <= 0 ||
        !Number.isInteger(Number(days)) ||
        !Number.isInteger(Number(travelers))
    ) {
        alert("Please enter valid trip details.");
        return;
    }

    button.disabled = true;
    button.textContent = "Finding your destinations...";

    try {

        const response = await fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                budget,
                days,
                travelers,
                transport,
                category,
                crowd
            })
        });

        if (!response.ok) {
            throw new Error("Backend request failed");
        }

        const destinations = await response.json();

        // Save recommendations for the new page
        sessionStorage.setItem(
            "travelpulseResults",
            JSON.stringify(destinations)
        );

        // Open separate results page
        window.location.href = "/results";

    } catch (error) {

        console.error(error);
        alert("Something went wrong. Please try again.");

        button.disabled = false;
        button.textContent = "Find my destinations ↗";

    }

});
