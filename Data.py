import json
import random
from datetime import datetime, timedelta

# Paramètres globaux
MAX_CAPACITY = 3000  # Capacité maximale du réservoir en litres
MIN_LEVEL = 0        # Niveau minimum acceptable en litres
MAX_LEVEL = 3000     # Niveau maximum acceptable en litres
THRESHOLD_HIGH = 2900  # Seuil pour niveau élevé (alerte)
THRESHOLD_LOW = 1500   # Seuil pour niveau bas (alerte)
FLOW_RATE_MEAN = 0.2  # Débit moyen en L/s (exemple)
FLOW_RATE_STD = 0.4  # Ecart-type du débit pour la variabilité
HOURS_IN_1_MONTH = 30 * 24  # Nombre d'heures dans 1 mois

def generate_flow_rate(current_level):
    """Génère un débit aléatoire en L/s pour simuler le remplissage ou le vidage du réservoir."""
    # Le débit peut être positif ou négatif pour simuler remplissage et vidage
    if current_level >= MAX_LEVEL:
        # Si le réservoir est plein, seulement un débit négatif (vidage) est généré
        flow_rate = random.uniform(-FLOW_RATE_MEAN, 0)
    elif current_level <= MIN_LEVEL:
        # Si le réservoir est vide, seulement un débit positif (remplissage) est généré
        flow_rate = random.uniform(0, FLOW_RATE_MEAN)
    else:
        # Sinon, le débit peut être positif ou négatif
        flow_rate = random.gauss(FLOW_RATE_MEAN, FLOW_RATE_STD)
    
    return flow_rate

def calculate_consumption(flow_rate, time_interval):
    """Calcule la consommation en fonction du débit (L/s) et du temps (en heures)."""
    consumption = flow_rate * time_interval * 3600  # Conversion du temps en secondes
    return consumption

def update_level(previous_level, flow_rate, max_capacity, min_level):
    """Met à jour le niveau du réservoir en fonction du débit."""
    new_level = previous_level + flow_rate * 3600  # Mise à jour du niveau sur une heure
    # Vérifier que le niveau reste dans les limites
    new_level = max(min(new_level, max_capacity), min_level)
    return new_level

def get_reservoir_state(flow_rate):
    """Détermine l'état du réservoir (remplissage, vidage ou stable)."""
    if flow_rate > 0:
        return "Remplissage"
    elif flow_rate < 0:
        return "Vidage"
    else:
        return "Stable"

# Simulation
data = {
    "statistics": [],
    "alerts": [],
}

# Niveau initial du réservoir
current_level = random.uniform(MIN_LEVEL, MAX_LEVEL)
start_time = datetime.now()
0
for hour in range(1, HOURS_IN_1_MONTH + 1):
    # Calculer l'heure et formater pour affichage
    current_time = start_time + timedelta(hours=hour)
    timestamp = current_time.strftime("%Y-%m-%d %H:%M:%S")
    
    # Générer un débit aléatoire (en L/s) en fonction du niveau du réservoir
    flow_rate = generate_flow_rate(current_level)
    
    # Calculer la consommation (en L)
    hourly_consumption = calculate_consumption(flow_rate, 1)  # Intervalle de 1 heure
    
    # Mettre à jour le niveau du réservoir
    new_level = update_level(current_level, flow_rate, MAX_CAPACITY, MIN_LEVEL)
    
    # Déterminer l'état du réservoir
    reservoir_state = get_reservoir_state(flow_rate)
    
    # Enregistrer les statistiques
    data["statistics"].append({
        "timestamp": timestamp,
        "level": new_level,
        "flow_rate": flow_rate,
        "consumption": hourly_consumption,
        "reservoir_state": reservoir_state
    })
    
    # Vérifier les alertes spécifiques
    if new_level <= MIN_LEVEL:
        alert_message = "Le réservoir est vide !"
        data["alerts"].append({
            "timestamp": timestamp,
            "alert": alert_message
        })
    elif new_level >= MAX_LEVEL:
        alert_message = "Le réservoir est plein !"
        data["alerts"].append({
            "timestamp": timestamp,
            "alert": alert_message
        })
    elif new_level > THRESHOLD_HIGH:
        alert_message = "Niveau élevé du réservoir !"
        data["alerts"].append({
            "timestamp": timestamp,
            "alert": alert_message
        })
    elif new_level < THRESHOLD_LOW:
        alert_message = "Niveau bas du réservoir !"
        data["alerts"].append({
            "timestamp": timestamp,
            "alert": alert_message
        })
    
    # Mettre à jour le niveau pour la prochaine itération
    current_level = new_level

# Exportation en JSON
with open("reservoir_data.json", "w") as json_file:
    json.dump(data, json_file, indent=4)

print("Simulation terminée et données enregistrées dans 'reservoir_data.json'.")
