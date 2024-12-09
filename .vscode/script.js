// Fonction pour charger les données depuis le fichier JSON
function loadData() {
    return fetch("iot_data_liters.json")
        .then(response => response.json())
        .then(data => data.data);
}

// Fonction pour filtrer les données en fonction de la date et de la période choisie
function filterData(data, date, duration) {
    const now = new Date();
    const selectedDate = new Date(date);
    let filteredData = [];

    // Calculer les dates de filtrage en fonction de la durée sélectionnée
    let startDate;
    if (duration === '1d') {
        startDate = new Date(selectedDate.setDate(selectedDate.getDate() - 1)); // 1 jour avant la date sélectionnée
    } else if (duration === '7d') {
        startDate = new Date(selectedDate.setDate(selectedDate.getDate() - 7)); // 7 jours avant
    } else if (duration === '30d') {
        startDate = new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)); // 1 mois avant
    } else {
        startDate = new Date(selectedDate.setFullYear(selectedDate.getFullYear() - 1)); // Toutes les données (1 an)
    }

    // Filtrage des données
    data.forEach(entry => {
        const timestamp = new Date(entry.timestamp);
        if (timestamp >= startDate && timestamp <= now) {
            filteredData.push(entry);
        }
    });

    return filteredData;
}

// Fonction pour mettre à jour le tableau HTML avec les données filtrées
function updateTable(data) {
    const tableBody = document.getElementById("dataTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Réinitialiser le tableau

    data.forEach(entry => {
        const row = document.createElement("tr");

        const timestampCell = document.createElement("td");
        timestampCell.textContent = entry.timestamp;
        row.appendChild(timestampCell);

        const levelCell = document.createElement("td");
        levelCell.textContent = entry.level.toFixed(2);
        row.appendChild(levelCell);

        tableBody.appendChild(row);
    });
}

// Fonction pour mettre à jour le graphique
function updateChart(data) {
    const labels = data.map(entry => entry.timestamp);
    const levels = data.map(entry => entry.level);

    const ctx = document.getElementById('levelChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Consommation (L)',
                data: levels,
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Level (L)'
                    }
                }
            }
        }
    });
}

// Initialiser le calendrier flatpickr
flatpickr("#datePicker", {
    dateFormat: "Y-m-d", // Format de date
    defaultDate: new Date() // Date par défaut : aujourd'hui
});

// Charger les données et appliquer les filtres
document.getElementById("applyFilters").addEventListener("click", () => {
    const date = document.getElementById("datePicker").value;
    const duration = document.getElementById("duration").value;

    loadData().then(data => {
        const filteredData = filterData(data, date, duration);
        updateTable(filteredData);
        updateChart(filteredData);
    });
});

// Charger les données initiales (pour aujourd'hui par défaut et toutes les données)
loadData().then(data => {
    const defaultDate = new Date();
    const filteredData = filterData(data, defaultDate.toISOString().split("T")[0], 'all');
    updateTable(filteredData);
    updateChart(filteredData);
});
