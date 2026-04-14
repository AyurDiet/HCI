const searchInput = document.querySelector('.search-box input');
const patientRows = Array.from(document.querySelectorAll('.patient-row'));

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();

    patientRows.forEach((row) => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(query) ? 'grid' : 'none';
    });
  });
}