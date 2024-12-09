// Fonction pour charger les données depuis le fichier JSON
function loadData() {
    return fetch("iot_data_liters.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des données");
            }
            return response.json();
        })
        .then(data => data.data || []) // Vérification pour s'assurer que 'data' existe
        .catch(error => console.error("Erreur de chargement des données:", error));
}

// Fonction pour filtrer les données selon la période sélectionnée
function filterData(data, period) {
    const now = new Date();
    let filteredData = [];

    data.forEach(entry => {
        const timestamp = new Date(entry.timestamp);
        const timeDiff = (now - timestamp) / (1000 * 60 * 60); // Différence en heures

        switch (period) {
            case '1h':
                if (timeDiff <= 1) filteredData.push(entry);
                break;
            case '6h':
                if (timeDiff <= 6) filteredData.push(entry);
                break;
            case '12h':
                if (timeDiff <= 12) filteredData.push(entry);
                break;
            case '24h':
                if (timeDiff <= 24) filteredData.push(entry);
                break;
            case 'day':
                if (timeDiff <= 24) filteredData.push(entry); // Dernier jour
                break;
            case 'week':
                if (timeDiff <= 7 * 24) filteredData.push(entry); // Dernière semaine
                break;
            case 'month':
                if (timeDiff <= 30 * 24) filteredData.push(entry); // Dernier mois
                break;
            default:
                break;
        }
    });

    return filteredData;
}

// Fonction pour mettre à jour le tableau HTML avec les données filtrées
function updateTable(data) {
    const tableBody = document.getElementById("dataTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Réinitialiser le tableau

    // Si aucune donnée n'est trouvée
    if (data.length === 0) {
        const row = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = 2;
        emptyCell.textContent = "Aucune donnée disponible pour cette période";
        row.appendChild(emptyCell);
        tableBody.appendChild(row);
        return;
    }

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
    
    // Si le graphique existe déjà, il faut le détruire avant de recréer un nouveau graphique
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
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

// Charger les données initiales et les afficher
loadData().then(data => {
    const selectElement = document.getElementById("timePeriod");

    // Initialiser avec les données de la dernière période sélectionnée
    let filteredData = filterData(data, selectElement.value);
    updateTable(filteredData);
    updateChart(filteredData);

    // Mettre à jour en fonction de la sélection de la période de temps
    selectElement.addEventListener("change", (e) => {
        const period = e.target.value;
        filteredData = filterData(data, period);
        updateTable(filteredData);
        updateChart(filteredData);
    });
});
