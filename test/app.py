from flask import Flask, jsonify, render_template, request
import random
from datetime import datetime, timedelta

app = Flask(__name__)

# Génération des données simulées
def generate_data():
    data = []
    level = 500  # Niveau initial
    for i in range(720):  # 1 mois = 720 heures
        timestamp = datetime.now() - timedelta(hours=(720 - i))
        flow_rate = random.uniform(10, 100)  # Débit simulé
        level += random.uniform(-5, 5)  # Variation du niveau

        # Limiter le niveau entre 0 et 1000
        if level < 0:
            level = 0
        elif level > 1000:
            level = 1000

        alert = None
        if level > 900:
            alert = "ALERTE: Niveau max dépassé!"
        elif level < 100:
            alert = "ALERTE: Niveau trop bas!"
        elif flow_rate > 80:
            alert = "ALERTE: Consommation élevée!"

        data.append({
            "timestamp": timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "level": round(level, 2),
            "flow_rate": round(flow_rate, 2),
            "alert": alert or "OK"
        })
    return data

# Simuler les données
data = generate_data()

# Route principale : renvoyer toutes les données
@app.route('/data', methods=['GET'])
def get_data():
    start = request.args.get('start')
    end = request.args.get('end')

    filtered_data = data
    if start and end:
        filtered_data = [
            entry for entry in data
            if start <= entry["timestamp"] <= end
        ]

    return jsonify(filtered_data)

# Route pour les alertes
@app.route('/alerts', methods=['GET'])
def get_alerts():
    alerts = [entry for entry in data if entry["alert"] != "OK"]
    return jsonify(alerts)

# Page principale
@app.route('/')
def index():
    return render_template('index.html')

# Page des alertes
@app.route('/alerts-page')
def alerts_page():
    return render_template('alerts.html')

# Page des graphiques
@app.route('/consumption')
def consumption():
    return render_template('consumption.html')

if __name__ == '__main__':
    app.run(debug=True)
