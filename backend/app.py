import Player
import PlayerGenerator

import pandas as pd
from flask import Flask,jsonify,request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Data from Flask backend!"})

@app.route('/api/button-click', methods=['POST'])
def handle_button_click():
    print("Front end button clicked")
    return jsonify({"message": "Button click received!"}), 200

@app.route('/api/query-player', methods=['POST'])
def handle_player_query():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')

    print(f"Received query for: {firstName} {lastName}")

    generator = PlayerGenerator.PlayerGenerator()

    try:
        player = generator.generatePlayer(firstName, lastName)
        stats = player.getBattingStats()
        stats = stats.fillna(0)

        print(stats)

        return jsonify({
            "playerFound": True,
            "playerQueried": f"{firstName} {lastName}",
            "stats": stats.to_dict(orient="records")
        }), 200

    except IndexError:
        print("Index Error Detected, no player found")
        return jsonify({
            "playerfound": False,
            "error": f"No player found for {firstName} {lastName}"
        }), 404

    

@app.route('/cards/<path:filename>')
def cards_static(filename):
    return send_from_directory('static/cards', filename)

@app.route('/cards/')
@app.route('/cards')
def cards_index():
    return send_from_directory('static/cards', 'index.html')


if __name__ == '__main__':
    # Use default port 8000 for local testing, or 5555 if you prefer
    app.run(debug=True, port=8000)
