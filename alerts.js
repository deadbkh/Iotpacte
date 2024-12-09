fetch("iot_data_liters.json")
    .then(response => response.json())
    .then(data => {
        const { alerts } = data;

        // Affichage des alertes
        const alertsList = document.getElementById("alertsList");
        alerts.forEach(alert => {
            const listItem = `<li>${alert.timestamp}: Niveau ${alert.level} L (Anomalie)</li>`;
            alertsList.innerHTML += listItem;
        });
    })
    .catch(error => console.error("Erreur lors du chargement des alertes :", error));
