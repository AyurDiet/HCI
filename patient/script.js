const patients = [
  { name: "Priya Sharma", info: "34 / F", dosha: "Pitta-Vata", condition: "Digestive Issues", date: "2024-01-20", status: "Active Plan" },
  { name: "Rajesh Kumar", info: "45 / M", dosha: "Kapha-Pitta", condition: "Hypertension", date: "2024-01-18", status: "Review Due" },
  { name: "Anita Desai", info: "29 / F", dosha: "Vata", condition: "Insomnia", date: "2024-02-05", status: "Active Plan" },
  { name: "Digestive Issues", info: "29 / F", dosha: "Pitta-Vata", condition: "Pitta-Vata", date: "2024-01-20", status: "Active Plan" },
  { name: "Priya Sharma", info: "39 / F", dosha: "Vata", condition: "Vata", date: "2024-01-20", status: "Active Plan" },
];

function renderTable() {
  const tableBody = document.getElementById('patient-table-body');
  tableBody.innerHTML = '';

  patients.forEach(p => {
    const statusClass = p.status === "Active Plan" ? "active" : "review";
    const row = `
            <tr>
                <td><strong>${p.name}</strong><br><small>${p.info}</small></td>
                <td>${p.dosha}</td>
                <td>${p.condition}</td>
                <td>${p.date}</td>
                <td><span class="status-pill ${statusClass}">${p.status}</span></td>
                <td>
                    <button class="btn-action">View</button>
                    <button class="btn-action">Edit</button>
                </td>
            </tr>
        `;
    tableBody.innerHTML += row;
  });
}

document.addEventListener('DOMContentLoaded', renderTable);