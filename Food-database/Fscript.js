const searchInput = document.querySelector("input");
const cards = document.querySelectorAll(".card");
const selects = document.querySelectorAll("select");
const countText = document.querySelector(".count");

function updateDisplay() {
    let visibleCount = 0;

    const searchValue = searchInput.value.toLowerCase();
    const category = selects[0].value.toLowerCase();
    const rasa = selects[1].value.toLowerCase();
    const virya = selects[2].value.toLowerCase();

    cards.forEach(card => {
        const name = card.querySelector("h3").innerText.toLowerCase();
        const categoryText = card.querySelector(".category").innerText.toLowerCase();
        const tags = card.innerText.toLowerCase();

        let show = true;

        // Search (only name)
        if (!name.includes(searchValue)) show = false;

        // Category filter
        if (category !== "category" && !categoryText.includes(category)) {
            show = false;
        }

        // Rasa filter
        if (rasa !== "rasa" && !tags.includes(rasa)) {
            show = false;
        }

        // Virya filter
        if (virya !== "virya" && !tags.includes(virya)) {
            show = false;
        }

        if (show) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    // Update count
    countText.innerText = `Food Items (${visibleCount} items)`;

    // No results message
    showNoResults(visibleCount);
}


// EVENTS
searchInput.addEventListener("input", updateDisplay);
selects.forEach(select => select.addEventListener("change", updateDisplay));


// CLEAR BUTTON
document.querySelector(".filters button").addEventListener("click", () => {
    searchInput.value = "";
    selects.forEach(select => select.selectedIndex = 0);
    updateDisplay();
});


// NO RESULTS MESSAGE
function showNoResults(count) {
    let msg = document.querySelector(".no-results");

    if (!msg) {
        msg = document.createElement("p");
        msg.className = "no-results";
        msg.style.textAlign = "center";
        msg.style.marginTop = "20px";
        msg.style.color = "#9CA3AF";
        document.querySelector(".grid").after(msg);
    }

    msg.innerText = count === 0 ? "No foods found 😕" : "";
}


// ADD BUTTON (better UX)
document.querySelector(".btn-primary").addEventListener("click", () => {
    alert("Feature coming soon 😄 (You can say: Add Food module planned)");
});