/* AyurDiet – script.js */

// ===== STATE =====
const state = {
  currentStep: 1,
  patientInfo: {
    fullName:'',age:'',gender:'',height:'',weight:'',lifestyle:'',sleepPattern:'',
    sleepHours:'',bowelHabits:'',waterIntake:'',activityLevel:'',stressLevel:'',
    chronicIssues:[],geneticIssues:'',allergies:'',bmi:null
  },
  doshaAnswers: {},
  doshaScores: {vata:0,pitta:0,kapha:0},
  dominantDosha: '',
  selectedFoods: {breakfast:[],lunch:[],dinner:[],snacks:[]},
  planGenerated: false
};

// Load from localStorage
try {
  const saved = localStorage.getItem('ayurdiet-draft');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  }
} catch(e) {}

function saveState() {
  localStorage.setItem('ayurdiet-draft', JSON.stringify(state));
}

// ===== DATA =====
const chronicOptions = [
  "Diabetes (Type 1 / Type 2)","Hypertension (High Blood Pressure)","Thyroid Disorder",
  "Heart Disease","Arthritis (Joint Pain)","PCOS / PCOD","Asthma / Respiratory Issues","Kidney Disease"
];

const doshaQuestions = [
  {id:1,question:"What best describes your body frame?",hint:"Think about your natural build, not current weight.",options:[
    {label:"Thin, light-boned, tall or short with narrow shoulders",value:"thin",dosha:"vata"},
    {label:"Medium build, well-proportioned, athletic frame",value:"medium",dosha:"pitta"},
    {label:"Large, broad-shouldered, sturdy and strong build",value:"large",dosha:"kapha"}]},
  {id:2,question:"How would you describe your appetite?",hint:"Consider your typical hunger pattern throughout the day.",options:[
    {label:"Irregular — sometimes hungry, sometimes not at all",value:"irregular",dosha:"vata"},
    {label:"Strong — I get irritable or dizzy if I skip a meal",value:"strong",dosha:"pitta"},
    {label:"Steady — I can comfortably skip meals without discomfort",value:"steady",dosha:"kapha"}]},
  {id:3,question:"How does your digestion typically behave?",hint:"Think about how your stomach feels after a normal meal.",options:[
    {label:"Variable — often experience gas, bloating, or irregular bowel",value:"variable",dosha:"vata"},
    {label:"Quick and strong — sometimes acid reflux or heartburn",value:"quick",dosha:"pitta"},
    {label:"Slow but steady — feel heavy after meals, sluggish digestion",value:"slow",dosha:"kapha"}]},
  {id:4,question:"What best describes your skin?",hint:"Consider your skin in its natural state without products.",options:[
    {label:"Dry, rough, thin, and prone to cracking",value:"dry",dosha:"vata"},
    {label:"Warm, slightly oily, sensitive, prone to redness or rashes",value:"oily",dosha:"pitta"},
    {label:"Thick, smooth, soft, and cool to the touch",value:"thick",dosha:"kapha"}]},
  {id:5,question:"How would you describe your mental temperament?",hint:"Think about your default mental state in daily life.",options:[
    {label:"Quick-thinking, creative, but restless and easily distracted",value:"restless",dosha:"vata"},
    {label:"Focused, sharp, competitive, and goal-oriented",value:"sharp",dosha:"pitta"},
    {label:"Calm, patient, nurturing, and methodical",value:"calm",dosha:"kapha"}]},
  {id:6,question:"How is your sleep quality?",hint:"Consider your typical night's sleep over the past month.",options:[
    {label:"Light, interrupted — difficulty falling or staying asleep",value:"light",dosha:"vata"},
    {label:"Moderate — I sleep well but wake easily if disturbed",value:"moderate",dosha:"pitta"},
    {label:"Deep and heavy — I sleep long and find it hard to wake up",value:"deep",dosha:"kapha"}]},
  {id:7,question:"What is your energy level pattern during the day?",hint:"How does your energy fluctuate from morning to evening?",options:[
    {label:"Comes in bursts — high energy then sudden fatigue",value:"bursts",dosha:"vata"},
    {label:"Moderate and well-managed — consistent through the day",value:"managed",dosha:"pitta"},
    {label:"Steady and strong — good stamina and endurance",value:"steady",dosha:"kapha"}]},
  {id:8,question:"What type of weather or climate do you prefer?",hint:"Choose the climate where you feel most comfortable.",options:[
    {label:"Warm and humid — I dislike cold, dry weather",value:"warm",dosha:"vata"},
    {label:"Cool and breezy — I dislike hot, humid weather",value:"cool",dosha:"pitta"},
    {label:"Warm and dry — I dislike cold, damp weather",value:"dry",dosha:"kapha"}]},
  {id:9,question:"What emotional tendencies do you experience most often?",hint:"Consider your default emotional response under stress.",options:[
    {label:"Anxiety, worry, nervousness, or fear",value:"anxious",dosha:"vata"},
    {label:"Irritability, frustration, impatience, or anger",value:"irritable",dosha:"pitta"},
    {label:"Attachment, reluctance to change, or lethargy",value:"attached",dosha:"kapha"}]},
  {id:10,question:"How does your body respond to food in terms of weight?",hint:"Think about your natural metabolism over the years.",options:[
    {label:"Fast metabolism — I find it hard to gain weight",value:"fast",dosha:"vata"},
    {label:"Moderate metabolism — I maintain a balanced weight easily",value:"moderate",dosha:"pitta"},
    {label:"Slow metabolism — I gain weight easily and struggle to lose it",value:"slow",dosha:"kapha"}]}
];

const foodDatabase = [
  // BREAKFAST
  {id:"1",name:"Oatmeal Porridge",calories:150,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:5,carbs:27,fat:3,category:"breakfast",doshaAffinity:["vata","pitta"]},
  {id:"2",name:"Poha (Flattened Rice)",calories:180,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:4,carbs:35,fat:3,category:"breakfast",doshaAffinity:["vata","kapha"]},
  {id:"3",name:"Idli (Steamed Rice Cake) with Chutney",calories:120,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:4,carbs:22,fat:1,category:"breakfast",doshaAffinity:["pitta","kapha"]},
  {id:"4",name:"Moong Dal Cheela (Lentil Pancake)",calories:160,rasa:"Astringent",nature:"Warm",digestion:"Easy",protein:10,carbs:20,fat:4,category:"breakfast",doshaAffinity:["kapha","pitta"]},
  {id:"5",name:"Upma (Semolina Porridge)",calories:200,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:5,carbs:30,fat:7,category:"breakfast",doshaAffinity:["vata"]},
  {id:"6",name:"Fresh Fruit Bowl with Honey",calories:130,rasa:"Sweet",nature:"Cold",digestion:"Easy",protein:2,carbs:30,fat:1,category:"breakfast",doshaAffinity:["pitta"]},
  {id:"7",name:"Sprouts Salad (Mixed Beans)",calories:110,rasa:"Astringent",nature:"Cold",digestion:"Moderate",protein:8,carbs:15,fat:2,category:"breakfast",doshaAffinity:["kapha","pitta"]},
  {id:"8",name:"Dosa (Rice & Lentil Crepe) with Sambar",calories:190,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:6,carbs:32,fat:4,category:"breakfast",doshaAffinity:["vata","pitta"]},
  {id:"9",name:"Daliya (Broken Wheat Porridge)",calories:170,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:6,carbs:28,fat:3,category:"breakfast",doshaAffinity:["kapha","pitta"]},
  {id:"10",name:"Besan Chilla (Gram Flour Pancake)",calories:155,rasa:"Astringent",nature:"Warm",digestion:"Easy",protein:9,carbs:18,fat:5,category:"breakfast",doshaAffinity:["kapha"]},
  {id:"51",name:"Paratha (Whole Wheat Flatbread) with Curd",calories:250,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:7,carbs:35,fat:10,category:"breakfast",doshaAffinity:["vata"]},
  {id:"52",name:"Ragi Porridge (Finger Millet)",calories:140,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:4,carbs:28,fat:2,category:"breakfast",doshaAffinity:["kapha","pitta"]},
  // LUNCH
  {id:"11",name:"Brown Rice with Dal (Lentil Soup)",calories:350,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:12,carbs:55,fat:6,category:"lunch",doshaAffinity:["vata","pitta"]},
  {id:"12",name:"Roti (Whole Wheat Flatbread) with Mixed Vegetable Curry",calories:300,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:10,carbs:45,fat:8,category:"lunch",doshaAffinity:["vata","pitta","kapha"]},
  {id:"13",name:"Khichdi (Rice & Lentil Porridge)",calories:280,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:10,carbs:45,fat:5,category:"lunch",doshaAffinity:["vata","pitta","kapha"]},
  {id:"14",name:"Vegetable Pulao (Spiced Rice)",calories:320,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:8,carbs:50,fat:9,category:"lunch",doshaAffinity:["vata"]},
  {id:"15",name:"Rajma Chawal (Kidney Bean Curry with Rice)",calories:380,rasa:"Sweet",nature:"Warm",digestion:"Heavy",protein:15,carbs:55,fat:8,category:"lunch",doshaAffinity:["vata"]},
  {id:"16",name:"Palak Paneer (Spinach & Cottage Cheese) with Roti",calories:340,rasa:"Bitter",nature:"Warm",digestion:"Moderate",protein:16,carbs:35,fat:14,category:"lunch",doshaAffinity:["pitta","kapha"]},
  {id:"17",name:"Bajra Roti (Pearl Millet Flatbread) with Curry",calories:290,rasa:"Astringent",nature:"Warm",digestion:"Easy",protein:9,carbs:42,fat:7,category:"lunch",doshaAffinity:["kapha"]},
  {id:"18",name:"Chole (Chickpea Curry) with Rice",calories:370,rasa:"Astringent",nature:"Warm",digestion:"Moderate",protein:14,carbs:52,fat:9,category:"lunch",doshaAffinity:["vata","kapha"]},
  {id:"19",name:"Sambar (Lentil Vegetable Stew) with Rice",calories:310,rasa:"Sour",nature:"Warm",digestion:"Easy",protein:11,carbs:48,fat:5,category:"lunch",doshaAffinity:["vata","pitta"]},
  {id:"53",name:"Kadhi Chawal (Yogurt Curry with Rice)",calories:330,rasa:"Sour",nature:"Warm",digestion:"Moderate",protein:9,carbs:50,fat:8,category:"lunch",doshaAffinity:["vata"]},
  {id:"54",name:"Dal Makhani (Creamy Black Lentils) with Roti",calories:360,rasa:"Sweet",nature:"Warm",digestion:"Heavy",protein:13,carbs:40,fat:14,category:"lunch",doshaAffinity:["vata"]},
  {id:"55",name:"Vegetable Biryani (Spiced Rice with Vegetables)",calories:390,rasa:"Pungent",nature:"Warm",digestion:"Moderate",protein:10,carbs:58,fat:12,category:"lunch",doshaAffinity:["vata"]},
  {id:"56",name:"Methi Thepla (Fenugreek Flatbread) with Pickle",calories:220,rasa:"Bitter",nature:"Warm",digestion:"Moderate",protein:7,carbs:30,fat:8,category:"lunch",doshaAffinity:["kapha","pitta"]},
  // DINNER
  {id:"20",name:"Vegetable Soup (Mixed)",calories:120,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:4,carbs:18,fat:3,category:"dinner",doshaAffinity:["vata","kapha"]},
  {id:"21",name:"Moong Dal Soup (Yellow Lentil Soup)",calories:150,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:10,carbs:22,fat:2,category:"dinner",doshaAffinity:["vata","pitta","kapha"]},
  {id:"22",name:"Chapati (Flatbread) with Light Vegetable Curry",calories:250,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:8,carbs:38,fat:6,category:"dinner",doshaAffinity:["vata","pitta"]},
  {id:"23",name:"Grilled Vegetables (Seasonal)",calories:140,rasa:"Bitter",nature:"Warm",digestion:"Easy",protein:5,carbs:20,fat:4,category:"dinner",doshaAffinity:["pitta","kapha"]},
  {id:"24",name:"Daliya (Broken Wheat) with Vegetables",calories:180,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:6,carbs:30,fat:3,category:"dinner",doshaAffinity:["kapha","pitta"]},
  {id:"25",name:"Steamed Rice with Rasam (Tangy Lentil Broth)",calories:200,rasa:"Sour",nature:"Warm",digestion:"Easy",protein:5,carbs:35,fat:3,category:"dinner",doshaAffinity:["vata"]},
  {id:"26",name:"Lauki Sabzi (Bottle Gourd Curry) with Roti",calories:190,rasa:"Sweet",nature:"Cold",digestion:"Easy",protein:5,carbs:28,fat:5,category:"dinner",doshaAffinity:["pitta","kapha"]},
  {id:"27",name:"Masoor Dal (Red Lentil Soup) with Rice",calories:260,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:12,carbs:40,fat:4,category:"dinner",doshaAffinity:["vata","pitta"]},
  {id:"57",name:"Turai Sabzi (Ridge Gourd Curry) with Roti",calories:170,rasa:"Bitter",nature:"Cold",digestion:"Easy",protein:4,carbs:24,fat:5,category:"dinner",doshaAffinity:["pitta","kapha"]},
  {id:"58",name:"Palak Soup (Spinach Soup)",calories:100,rasa:"Bitter",nature:"Cold",digestion:"Easy",protein:5,carbs:12,fat:3,category:"dinner",doshaAffinity:["pitta","kapha"]},
  {id:"59",name:"Kaddu Sabzi (Pumpkin Curry) with Roti",calories:210,rasa:"Sweet",nature:"Warm",digestion:"Easy",protein:5,carbs:32,fat:6,category:"dinner",doshaAffinity:["vata"]},
  // SNACKS
  {id:"28",name:"Roasted Makhana (Fox Nuts)",calories:90,rasa:"Sweet",nature:"Cold",digestion:"Easy",protein:3,carbs:14,fat:2,category:"snacks",doshaAffinity:["pitta","kapha"]},
  {id:"29",name:"Almonds & Dates",calories:160,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:5,carbs:20,fat:8,category:"snacks",doshaAffinity:["vata"]},
  {id:"30",name:"Herbal Tea with Digestive Biscuit",calories:80,rasa:"Bitter",nature:"Warm",digestion:"Easy",protein:1,carbs:15,fat:2,category:"snacks",doshaAffinity:["kapha"]},
  {id:"31",name:"Cucumber & Carrot Sticks",calories:50,rasa:"Sweet",nature:"Cold",digestion:"Easy",protein:1,carbs:10,fat:0,category:"snacks",doshaAffinity:["pitta"]},
  {id:"32",name:"Coconut Water (Nariyal Pani)",calories:45,rasa:"Sweet",nature:"Cold",digestion:"Easy",protein:1,carbs:9,fat:0,category:"snacks",doshaAffinity:["pitta","vata"]},
  {id:"33",name:"Murmura Chivda (Puffed Rice Mix)",calories:130,rasa:"Pungent",nature:"Warm",digestion:"Easy",protein:3,carbs:22,fat:4,category:"snacks",doshaAffinity:["kapha"]},
  {id:"34",name:"Chaas (Spiced Buttermilk)",calories:40,rasa:"Sour",nature:"Cold",digestion:"Easy",protein:2,carbs:5,fat:1,category:"snacks",doshaAffinity:["pitta","vata"]},
  {id:"35",name:"Dry Fruit Ladoo (Energy Ball)",calories:120,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:4,carbs:16,fat:5,category:"snacks",doshaAffinity:["vata"]},
  {id:"36",name:"Roasted Chana (Roasted Chickpeas)",calories:100,rasa:"Astringent",nature:"Warm",digestion:"Easy",protein:7,carbs:15,fat:2,category:"snacks",doshaAffinity:["kapha"]},
  {id:"37",name:"Banana with Warm Milk",calories:180,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:5,carbs:30,fat:4,category:"snacks",doshaAffinity:["vata"]},
  {id:"60",name:"Sattu Drink (Roasted Gram Flour Drink)",calories:110,rasa:"Astringent",nature:"Cold",digestion:"Easy",protein:6,carbs:18,fat:2,category:"snacks",doshaAffinity:["pitta","kapha"]},
  {id:"61",name:"Til Gajak (Sesame Brittle)",calories:140,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:3,carbs:18,fat:7,category:"snacks",doshaAffinity:["vata"]},
  {id:"62",name:"Amla Murabba (Indian Gooseberry Preserve)",calories:70,rasa:"Sour",nature:"Cold",digestion:"Easy",protein:1,carbs:16,fat:0,category:"snacks",doshaAffinity:["pitta"]},
  {id:"63",name:"Mixed Nuts (Walnuts, Cashews, Pistachios)",calories:170,rasa:"Sweet",nature:"Warm",digestion:"Moderate",protein:5,carbs:10,fat:14,category:"snacks",doshaAffinity:["vata"]}
];

const mealTimings = {
  breakfast:{time:"7:00 – 8:30 AM",tip:"Eat warm, freshly cooked foods to kindle your digestive fire (Agni). Avoid cold, heavy items."},
  lunch:{time:"12:00 – 1:00 PM",tip:"This should be your largest meal — digestion is strongest when the sun is at its peak."},
  snacks:{time:"4:00 – 5:00 PM",tip:"Choose a light, nourishing snack to sustain energy without overloading digestion."},
  dinner:{time:"6:30 – 7:30 PM",tip:"Eat light and easy-to-digest food. Finish at least 2 hours before bedtime."}
};

const doshaDescriptions = {
  vata:"Favour warm, moist, grounding foods. Avoid cold, dry, raw items.",
  pitta:"Favour cooling, mild, hydrating foods. Avoid spicy, sour, fried items.",
  kapha:"Favour light, dry, warm foods. Avoid heavy, oily, sweet items."
};

let activeTab = 'breakfast';

// ===== SIDEBAR =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

// ===== STEP NAVIGATION =====
function goToStep(n) {
  state.currentStep = n;
  saveState();
  renderAll();
}

function renderStepIndicator() {
  const steps = [{num:1,label:"Patient Information"},{num:2,label:"Dosha Assessment"},{num:3,label:"Food Selection"},{num:4,label:"Review & Generate"}];
  const el = document.getElementById('stepIndicator');
  el.innerHTML = steps.map((s,i) => {
    const cls = state.currentStep > s.num ? 'complete' : state.currentStep === s.num ? 'active' : 'inactive';
    const lblCls = state.currentStep >= s.num ? 'current' : '';
    const circle = state.currentStep > s.num ? '✓' : s.num;
    let line = '';
    if (i < steps.length-1) {
      line = `<div class="step-line ${state.currentStep > s.num ? 'done' : 'pending'}"></div>`;
    }
    return `<div class="step-item"><div class="step-circle-wrap"><div class="step-circle ${cls}">${circle}</div><div class="step-label ${lblCls}">${s.label}</div></div>${line}</div>`;
  }).join('');
}

function showStepPanel() {
  ['step1','step2','step3','step4'].forEach((id,i) => {
    document.getElementById(id).style.display = (i+1 === state.currentStep) ? 'block' : 'none';
  });
}

// ===== STEP 1 =====
function renderStep1() {
  // Populate fields from state
  const fields = ['fullName','age','gender','height','weight','lifestyle','sleepPattern','sleepHours','bowelHabits','waterIntake','activityLevel','stressLevel','geneticIssues','allergies'];
  fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.value = state.patientInfo[f] || '';
  });

  // BMI
  calcBMI();

  // Chronic checkboxes
  const grid = document.getElementById('chronicGrid');
  grid.innerHTML = chronicOptions.map(c => 
    `<label class="checkbox-label"><input type="checkbox" ${state.patientInfo.chronicIssues.includes(c)?'checked':''} onchange="toggleChronic('${c.replace(/'/g,"\\'")}')" />${c}</label>`
  ).join('');

  validateStep1();
}

function bindStep1() {
  const fields = ['fullName','age','gender','height','weight','lifestyle','sleepPattern','sleepHours','bowelHabits','waterIntake','activityLevel','stressLevel','geneticIssues','allergies'];
  fields.forEach(f => {
    const el = document.getElementById(f);
    if (el) {
      el.addEventListener('input', () => { state.patientInfo[f] = el.value; saveState(); calcBMI(); validateStep1(); });
      el.addEventListener('change', () => { state.patientInfo[f] = el.value; saveState(); calcBMI(); validateStep1(); });
    }
  });
}

function calcBMI() {
  const h = parseFloat(state.patientInfo.height)/100;
  const w = parseFloat(state.patientInfo.weight);
  if (h > 0 && w > 0) {
    const bmi = Math.round((w/(h*h))*10)/10;
    state.patientInfo.bmi = bmi;
    let cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    document.getElementById('bmiDisplay').value = bmi + ' — ' + cat;
  } else {
    state.patientInfo.bmi = null;
    document.getElementById('bmiDisplay').value = '';
  }
}

function toggleChronic(issue) {
  const arr = state.patientInfo.chronicIssues;
  const idx = arr.indexOf(issue);
  if (idx > -1) arr.splice(idx,1); else arr.push(issue);
  saveState();
}

function validateStep1() {
  const p = state.patientInfo;
  const valid = p.fullName && p.age && p.gender && p.height && p.weight;
  document.getElementById('step1Next').disabled = !valid;
}

// ===== STEP 2 =====
function renderStep2() {
  const container = document.getElementById('doshaQuestionsContainer');
  const answered = doshaQuestions.filter(q => state.doshaAnswers[q.id]).length;
  document.getElementById('doshaProgress').textContent = `Progress: ${answered} of ${doshaQuestions.length} answered`;

  container.innerHTML = doshaQuestions.map(q => {
    return `<div class="question-block">
      <p class="question">${q.id}. ${q.question}</p>
      ${q.hint ? `<p class="hint">${q.hint}</p>` : ''}
      <div class="radio-group">
        ${q.options.map(o => `<label class="radio-label"><input type="radio" name="dosha_q${q.id}" value="${o.value}" ${state.doshaAnswers[q.id]===o.value?'checked':''} onchange="setDoshaAnswer(${q.id},'${o.value}')" />${o.label}</label>`).join('')}
      </div>
    </div>`;
  }).join('') + `
    <div class="btn-row">
      <button class="btn btn-outline" onclick="goToStep(1)">← Back</button>
      <button class="btn btn-primary" id="calcDoshaBtn" ${answered < doshaQuestions.length ? 'disabled' : ''} onclick="calculateDosha()">Calculate Dosha & Continue →</button>
    </div>`;
}

function setDoshaAnswer(qId, val) {
  state.doshaAnswers[qId] = val;
  saveState();
  const answered = doshaQuestions.filter(q => state.doshaAnswers[q.id]).length;
  document.getElementById('doshaProgress').textContent = `Progress: ${answered} of ${doshaQuestions.length} answered`;
  const btn = document.getElementById('calcDoshaBtn');
  if (btn) btn.disabled = answered < doshaQuestions.length;
}

function calculateDosha() {
  const scores = {vata:0,pitta:0,kapha:0};
  doshaQuestions.forEach(q => {
    const ans = state.doshaAnswers[q.id];
    const opt = q.options.find(o => o.value === ans);
    if (opt) scores[opt.dosha]++;
  });
  const total = scores.vata + scores.pitta + scores.kapha;
  state.doshaScores = {
    vata: Math.round((scores.vata/total)*100),
    pitta: Math.round((scores.pitta/total)*100),
    kapha: Math.round((scores.kapha/total)*100)
  };
  state.dominantDosha = Object.entries(state.doshaScores).sort((a,b)=>b[1]-a[1])[0][0];
  saveState();
  goToStep(3);
}

// ===== STEP 3 =====
function renderStep3() {
  const dosha = state.dominantDosha;
  document.getElementById('step3DoshaBadge').textContent = dosha.charAt(0).toUpperCase() + dosha.slice(1);
  document.getElementById('step3DoshaTip').textContent = doshaDescriptions[dosha] || '';

  // Tabs
  const cats = ['breakfast','lunch','dinner','snacks'];
  document.getElementById('mealTabs').innerHTML = cats.map(c => 
    `<button class="tab-btn ${c===activeTab?'active':''}" onclick="switchTab('${c}')">${c} (${state.selectedFoods[c].length})</button>`
  ).join('');

  renderFoodList();
  updateStep3Count();
}

function switchTab(cat) {
  activeTab = cat;
  renderStep3();
}

function renderFoodList() {
  const search = (document.getElementById('foodSearch')?.value || '').toLowerCase();
  const dosha = state.dominantDosha;

  const foods = foodDatabase
    .filter(f => f.category === activeTab)
    .filter(f => f.name.toLowerCase().includes(search))
    .sort((a,b) => {
      const am = a.doshaAffinity.includes(dosha) ? 0 : 1;
      const bm = b.doshaAffinity.includes(dosha) ? 0 : 1;
      return am - bm;
    });

  // Selected bar
  const selected = state.selectedFoods[activeTab];
  const bar = document.getElementById('selectedBar');
  if (selected.length > 0) {
    bar.innerHTML = `<div class="selected-bar">${selected.map(f => 
      `<span class="badge badge-secondary">${f.name}<button class="badge-remove" onclick="removeFood('${f.id}','${activeTab}')">&times;</button></span>`
    ).join('')}</div>`;
  } else {
    bar.innerHTML = '';
  }

  // Food list
  const container = document.getElementById('foodListContainer');
  container.innerHTML = foods.map(f => {
    const rec = f.doshaAffinity.includes(dosha);
    const sel = selected.some(s => s.id === f.id);
    const cls = sel ? 'selected' : rec ? 'recommended' : '';
    return `<div class="food-card ${cls}">
      <div class="food-info">
        <h4>${f.name}</h4>
        <p>${f.calories} kcal · Taste: ${f.rasa} · ${f.nature} · Digestion: ${f.digestion}</p>
        <p>Protein: ${f.protein}g · Carbs: ${f.carbs}g · Fat: ${f.fat}g</p>
      </div>
      <div class="food-actions">
        ${rec ? '<span class="badge badge-outline-primary">Recommended</span>' : ''}
        ${!sel 
          ? `<button class="btn btn-ghost btn-sm" onclick="addFood('${f.id}')">+ Add</button>`
          : `<button class="btn btn-ghost btn-sm btn-destructive" onclick="removeFood('${f.id}','${activeTab}')">✕ Remove</button>`
        }
      </div>
    </div>`;
  }).join('');
}

function addFood(id) {
  const food = foodDatabase.find(f => f.id === id);
  if (food && !state.selectedFoods[activeTab].some(f => f.id === id)) {
    state.selectedFoods[activeTab].push(food);
    saveState();
    renderStep3();
  }
}

function removeFood(id, cat) {
  state.selectedFoods[cat] = state.selectedFoods[cat].filter(f => f.id !== id);
  saveState();
  if (state.currentStep === 3) renderStep3();
}

function updateStep3Count() {
  const total = Object.values(state.selectedFoods).flat().length;
  document.getElementById('totalSelectedCount').textContent = total + ' items selected';
  document.getElementById('step3Next').disabled = total === 0;
}

// ===== STEP 4 =====
function getWaterGuidance() {
  const w = parseFloat(state.patientInfo.weight) || 65;
  const currentIntake = parseFloat(state.patientInfo.waterIntake) || 0;
  const dosha = state.dominantDosha;
  let multiplier = 33, temp = 'lukewarm', extras = '';

  if (dosha === 'vata') { multiplier = 30; temp = 'warm or lukewarm'; extras = 'Add a pinch of ginger or cumin to warm water. Avoid ice-cold water.'; }
  else if (dosha === 'pitta') { multiplier = 35; temp = 'room temperature or slightly cool'; extras = 'Infuse with mint, cucumber, or fennel seeds. Avoid very hot water.'; }
  else if (dosha === 'kapha') { multiplier = 28; temp = 'warm or hot'; extras = 'Add lemon, honey (in warm water), or ginger. Avoid cold/iced drinks.'; }

  const recommended = Math.round((w * multiplier) / 100) / 10;
  const schedule = [
    {time:"6:00 – 6:30 AM",amount:"1–2 glasses",note:"Drink warm water on an empty stomach to flush toxins (Ama)"},
    {time:"8:30 – 9:00 AM",amount:"1 glass",note:"30 minutes after breakfast — aids digestion"},
    {time:"10:30 – 11:00 AM",amount:"1 glass",note:"Mid-morning hydration"},
    {time:"1:30 – 2:00 PM",amount:"1 glass",note:"30 minutes after lunch — small sips only during meals"},
    {time:"3:30 – 4:00 PM",amount:"1 glass",note:"Afternoon hydration before evening snack"},
    {time:"5:30 – 6:00 PM",amount:"1 glass",note:"Pre-dinner hydration"},
    {time:"8:00 – 8:30 PM",amount:"½ glass",note:"Light sip after dinner — avoid large amounts before sleep"}
  ];

  return {recommended, temp, extras, schedule, currentIntake};
}

function renderStep4() {
  const p = state.patientInfo;
  const d = state.doshaScores;
  const dosha = state.dominantDosha;
  const water = getWaterGuidance();
  const allFoods = Object.values(state.selectedFoods).flat();
  const totalCals = allFoods.reduce((s,f)=>s+f.calories,0);
  const totalP = allFoods.reduce((s,f)=>s+f.protein,0);
  const totalC = allFoods.reduce((s,f)=>s+f.carbs,0);
  const totalF = allFoods.reduce((s,f)=>s+f.fat,0);

  const body = document.getElementById('reviewBody');
  let html = `
    <div class="section-title">Patient Summary</div>
    <div class="summary-grid">
      <div class="summary-item"><p>Name</p><p>${p.fullName||'—'}</p></div>
      <div class="summary-item"><p>Age / Gender</p><p>${p.age||'—'} / ${p.gender||'—'}</p></div>
      <div class="summary-item"><p>BMI</p><p>${p.bmi||'—'}</p></div>
      <div class="summary-item"><p>Lifestyle</p><p style="text-transform:capitalize">${p.lifestyle||'—'}</p></div>
      <div class="summary-item"><p>Activity Level</p><p style="text-transform:capitalize">${p.activityLevel||'—'}</p></div>
      <div class="summary-item"><p>Stress Level</p><p style="text-transform:capitalize">${p.stressLevel||'—'}</p></div>
      <div class="summary-item"><p>Sleep</p><p style="text-transform:capitalize">${p.sleepPattern||'—'} (${p.sleepHours||'—'} hrs)</p></div>
      <div class="summary-item"><p>Water Intake</p><p>${p.waterIntake||'—'} L/day</p></div>
    </div>

    <div class="dosha-section">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <strong>Dosha Profile (Ayurvedic Constitution)</strong>
        <span class="badge badge-primary">${dosha.charAt(0).toUpperCase()+dosha.slice(1)}</span>
      </div>
      <div class="dosha-bar-wrap"><div class="dosha-bar-label"><span>Vata (Air + Space)</span><span>${d.vata}%</span></div><div class="dosha-bar"><div class="dosha-bar-fill vata" style="width:${d.vata}%"></div></div></div>
      <div class="dosha-bar-wrap"><div class="dosha-bar-label"><span>Pitta (Fire + Water)</span><span>${d.pitta}%</span></div><div class="dosha-bar"><div class="dosha-bar-fill pitta" style="width:${d.pitta}%"></div></div></div>
      <div class="dosha-bar-wrap"><div class="dosha-bar-label"><span>Kapha (Earth + Water)</span><span>${d.kapha}%</span></div><div class="dosha-bar"><div class="dosha-bar-fill kapha" style="width:${d.kapha}%"></div></div></div>
    </div>

    <div class="separator"></div>`;

  if (!state.planGenerated) {
    html += `<div class="generate-center">
      <p>Your personalized diet plan is ready to be generated.</p>
      <p>Includes meal timings, nutritional breakdown, water intake schedule, and Ayurvedic tips.</p>
      <button class="btn btn-primary btn-lg" onclick="generatePlan()">🔄 Generate Plan</button>
    </div>`;
  } else {
    html += `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:16px">
      <h3 style="font-size:18px;font-weight:600">Your Daily Ayurvedic Diet Plan</h3>
      <div class="plan-totals"><span>~${totalCals} kcal</span><span>P: ${totalP}g</span><span>C: ${totalC}g</span><span>F: ${totalF}g</span></div>
    </div>`;

    ['breakfast','lunch','snacks','dinner'].forEach(cat => {
      const foods = state.selectedFoods[cat];
      if (!foods.length) return;
      const t = mealTimings[cat];
      const catCals = foods.reduce((s,f)=>s+f.calories,0);
      html += `<div class="meal-block">
        <div class="meal-block-header"><h4>${cat}</h4><div style="display:flex;align-items:center;gap:8px"><span style="font-size:12px;color:var(--text-muted)">${catCals} kcal</span><span class="badge badge-outline">${t.time}</span></div></div>
        ${foods.map(f => `<div class="meal-row"><span>${f.name}</span><span>${f.calories} kcal · ${f.rasa} · P:${f.protein}g C:${f.carbs}g F:${f.fat}g</span></div>`).join('')}
        <p class="meal-tip">💡 ${t.tip}</p>
      </div>`;
    });

    // Water schedule
    let waterDiff = '';
    if (water.currentIntake > 0) {
      waterDiff = water.currentIntake < water.recommended
        ? ` · Current: <strong>${water.currentIntake} L/day</strong> <span style="color:var(--orange)">(increase by ${(water.recommended-water.currentIntake).toFixed(1)}L)</span>`
        : ` · Current: <strong>${water.currentIntake} L/day</strong> <span style="color:var(--emerald)">(adequate)</span>`;
    }

    html += `<div class="water-section">
      <h4>💧 Daily Water Intake Schedule</h4>
      <p style="font-size:13px;color:var(--text-secondary)">Recommended: <strong>${water.recommended} litres/day</strong> · Temperature: <strong>${water.temp}</strong>${waterDiff}</p>
      <div class="water-schedule">${water.schedule.map(s => 
        `<div class="water-slot"><span class="badge badge-outline time">${s.time}</span><div><strong>${s.amount}</strong> — ${s.note}</div></div>`
      ).join('')}</div>
      ${water.extras ? `<p style="font-size:12px;color:#1D4ED8;font-style:italic;margin-top:8px">🌿 Dosha-specific tip: ${water.extras}</p>` : ''}
    </div>`;

    html += `<div style="display:flex;justify-content:flex-end;gap:12px;margin-top:16px">
      <button class="btn btn-outline" onclick="downloadPDF()">📥 Download PDF</button>
    </div>`;
  }

  html += `<div class="btn-row" style="border-top:1px solid var(--border);padding-top:16px;margin-top:20px">
    <button class="btn btn-outline" onclick="goToStep(3)">← Back</button>
    <div></div>
  </div>`;

  body.innerHTML = html;
}

function generatePlan() {
  state.planGenerated = true;
  saveState();
  renderStep4();
}

// ===== PDF =====
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const p = state.patientInfo;
  const d = state.doshaScores;
  const water = getWaterGuidance();

  doc.setFontSize(20);
  doc.text('AyurDiet - Personalized Diet Plan', 14, 22);
  doc.setFontSize(12);
  doc.text(`Patient: ${p.fullName} | Age: ${p.age} | Gender: ${p.gender} | BMI: ${p.bmi}`, 14, 34);
  doc.text(`Dominant Dosha: ${state.dominantDosha.toUpperCase()} (V:${d.vata}% P:${d.pitta}% K:${d.kapha}%)`, 14, 42);
  doc.text(`Lifestyle: ${p.lifestyle} | Activity: ${p.activityLevel} | Stress: ${p.stressLevel}`, 14, 50);

  let y = 62;
  ['breakfast','lunch','snacks','dinner'].forEach(cat => {
    const foods = state.selectedFoods[cat];
    if (!foods.length) return;
    const t = mealTimings[cat];
    doc.setFontSize(14);
    doc.text(`${cat.charAt(0).toUpperCase()+cat.slice(1)} (${t.time})`, 14, y);
    y += 4;
    doc.autoTable({
      startY: y,
      head: [['Food','Calories','Rasa (Taste)','Nature','P/C/F (g)']],
      body: foods.map(f => [f.name,`${f.calories} kcal`,f.rasa,f.nature,`${f.protein}/${f.carbs}/${f.fat}`]),
      theme:'grid',
      headStyles:{fillColor:[34,197,94]},
      margin:{left:14}
    });
    y = doc.lastAutoTable.finalY + 4;
    doc.setFontSize(9);
    doc.text(`Tip: ${t.tip}`, 14, y);
    y += 10;
    if (y > 260) { doc.addPage(); y = 20; }
  });

  y += 4;
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFontSize(14);
  doc.text('Water Intake Schedule', 14, y);
  y += 4;
  doc.autoTable({
    startY: y,
    head: [['Time','Amount','Guideline']],
    body: water.schedule.map(s => [s.time,s.amount,s.note]),
    theme:'grid',
    headStyles:{fillColor:[59,130,246]},
    margin:{left:14}
  });
  y = doc.lastAutoTable.finalY + 6;
  doc.setFontSize(10);
  doc.text(`Recommended daily intake: ${water.recommended}L (${water.temp})`, 14, y);
  y += 5;
  if (water.extras) doc.text(`Dosha tip: ${water.extras}`, 14, y);

  doc.save(`AyurDiet_${p.fullName.replace(/\s+/g,'_')}.pdf`);
}

// ===== RENDER ALL =====
function renderAll() {
  renderStepIndicator();
  showStepPanel();
  if (state.currentStep === 1) renderStep1();
  else if (state.currentStep === 2) renderStep2();
  else if (state.currentStep === 3) renderStep3();
  else if (state.currentStep === 4) renderStep4();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  bindStep1();
});
