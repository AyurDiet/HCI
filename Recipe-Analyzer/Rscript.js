// ── Sidebar toggle ────────────────────────────────────────────
const sidebar       = document.querySelector('.sidebar');
const toggleBtn     = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// ── Upload Image ───────────────────────────────────────────────
const uploadBtn   = document.getElementById('uploadBtn');
const imageUpload = document.getElementById('imageUpload');

uploadBtn.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Show file name on the button
  uploadBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
    ${file.name.length > 18 ? file.name.slice(0, 15) + '…' : file.name}
  `;
  // Re-attach hidden input (it was replaced by innerHTML)
  uploadBtn.appendChild(imageUpload);
});

// ── Analyze Recipe ─────────────────────────────────────────────
const form       = document.getElementById('recipeForm');
const loader     = document.getElementById('loader');
const resultsDiv = document.getElementById('results');
const resultsGrid= document.getElementById('resultsGrid');
const servingBadge = document.getElementById('servingBadge');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name     = document.getElementById('recipeName').value.trim();
  const servings = parseInt(document.getElementById('servings').value) || 1;
  const text     = document.getElementById('ingredients').value.trim();

  if (!text) {
    alert('Please enter ingredients or instructions.');
    return;
  }

  // Show loader, hide results
  loader.hidden   = false;
  resultsDiv.hidden = true;

  // Simulate analysis (replace with real API call)
  setTimeout(() => {
    loader.hidden = true;
    showResults(name, servings, text);
  }, 1600);
});

function showResults(name, servings, text) {
  // Simple heuristic nutrient estimates for demo
  const lines    = text.split('\n').filter(l => l.trim().startsWith('-')).length || 6;
  const calories = Math.round(lines * 47 * servings);
  const protein  = Math.round(lines * 3.2 * servings);
  const carbs    = Math.round(lines * 8.5 * servings);
  const fats     = Math.round(lines * 2.1 * servings);

  // Dosha detection keywords
  const lowerText = text.toLowerCase();
  const doshaMap = {
    'Vata-Pacifying': ['ghee','ginger','sesame','warm','turmeric','cumin'],
    'Pitta-Pacifying': ['coconut','coriander','mint','fennel','lime','cucumber'],
    'Kapha-Pacifying': ['pepper','chili','ginger','garlic','lemon','mustard'],
  };
  let dominantDosha = 'Tridoshic';
  let maxHits = 0;
  for (const [dosha, keywords] of Object.entries(doshaMap)) {
    const hits = keywords.filter(kw => lowerText.includes(kw)).length;
    if (hits > maxHits) { maxHits = hits; dominantDosha = dosha; }
  }

  servingBadge.textContent = `${servings} serving${servings > 1 ? 's' : ''}${name ? ' · ' + name : ''}`;

  const cards = [
    { label: 'Calories',   value: calories,          unit: 'kcal' },
    { label: 'Protein',    value: protein + 'g',      unit: 'per serving' },
    { label: 'Carbs',      value: carbs + 'g',        unit: 'per serving' },
    { label: 'Fats',       value: fats + 'g',         unit: 'per serving' },
    { label: 'Dosha Type', value: dominantDosha,      unit: 'Ayurvedic property' },
    { label: 'Ingredients',value: lines,              unit: 'items detected' },
  ];

  resultsGrid.innerHTML = cards.map(c => `
    <div class="result-card">
      <div class="result-card-label">${c.label}</div>
      <div class="result-card-value">${c.value}</div>
      <div class="result-card-unit">${c.unit}</div>
    </div>
  `).join('');

  resultsDiv.hidden = false;

  // Smooth scroll to results
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}