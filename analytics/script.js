Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
Chart.defaults.color = "#888";

const CHART_COLORS = {
  greenDark: '#27ae60',
  greenMid: '#98c798',
  greenLight: '#cde4cd',
  beige: '#e1c195',
  red: '#d99a9a'
};

document.addEventListener('DOMContentLoaded', () => {

  const ctxDoshaSummary = document.getElementById('doshaSummaryChart').getContext('2d');
  new Chart(ctxDoshaSummary, {
    type: 'pie',
    data: {
      datasets: [{
        data: [60, 40],
        backgroundColor: [CHART_COLORS.greenDark, CHART_COLORS.red],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      layout: { padding: 0 }
    }
  });


  const ctxDoshaPie = document.getElementById('patientDoshaPie').getContext('2d');
  new Chart(ctxDoshaPie, {
    type: 'pie',
    data: {
      labels: ['Vata-Kapha 15.0%', 'Kapha-Pitta 40.0%', 'Pitta-Vata 40.0%', 'Pitta <5.0%', 'Vata <5.0%'],
      datasets: [{
        data: [15, 40, 40, 3, 2],
        backgroundColor: [
          CHART_COLORS.beige,
          CHART_COLORS.greenMid,
          CHART_COLORS.greenDark,
          '#e8f5e9',
          '#f5f5f5'
        ],
        borderWidth: 1,
        borderColor: '#fff',
        offset: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          align: 'start',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: { size: 11 }
          }
        }
      }
    }
  });


  const ctxFoodsBar = document.getElementById('foodsBarChart').getContext('2d');
  new Chart(ctxFoodsBar, {
    type: 'bar',
    data: {
      labels: ['Ghee (Heavy)', 'Oily', 'Mung Beans (Guna)', 'Oily', 'Dry'],
      datasets: [
        {
          label: 'Prescribed Qty',
          data: [13, 10, 8, 9, 3],
          backgroundColor: CHART_COLORS.greenDark,
          barPercentage: 0.6
        },
        {
          label: 'Comparison',
          data: [13, 8, 3, 5, 1],
          backgroundColor: CHART_COLORS.greenLight,
          barPercentage: 0.6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 14,
          title: { display: true, text: 'Quantity', font: { size: 11 } },
          grid: { color: '#f0f0f0' },
          ticks: { stepSize: 2 }
        },
        x: {
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      }
    }
  });


  const ctxComplianceLine = document.getElementById('complianceLineChart').getContext('2d');
  new Chart(ctxComplianceLine, {
    type: 'line',
    data: {
      labels: ['0', '5', '10', '15', '20', '25', '30'],
      datasets: [{
        data: [10, 18, 28, 32, 38, 48, 58],
        borderColor: CHART_COLORS.greenDark,
        borderWidth: 2,
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(39, 174, 96, 0.05)',
        pointRadius: 3,
        pointBackgroundColor: CHART_COLORS.greenDark
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 60,
          title: { display: true, text: 'Compliance Score (%)', font: { size: 11 } },
          grid: { color: '#f0f0f0' },
          ticks: { stepSize: 10 }
        },
        x: {
          title: { display: true, text: 'Time (Weeks)', font: { size: 11 } },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
});