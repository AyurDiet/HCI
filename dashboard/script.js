const searchInput = document.querySelector(".search-box input");
const patientRows = Array.from(document.querySelectorAll(".patient-row"));
const themeToggle = document.querySelector("#theme-toggle");
const storedTheme = localStorage.getItem("ayurdiet-theme");

if (storedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

if (themeToggle) {
  const syncThemeIcon = () => {
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀" : "🌙";
  };

  syncThemeIcon();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "ayurdiet-theme",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
    syncThemeIcon();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();

    patientRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? "grid" : "none";
    });
  });
}
