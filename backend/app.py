import Player
import PlayerGenerator

import pandas as pd
from flask import Flask,jsonify,request
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
            "playerQueried": f"{firstName} {lastName}",
            "stats": stats.to_dict(orient="records")
        }), 200

    except IndexError:
        return jsonify({
            "error": f"No player found for {firstName} {lastName}"
        }), 404

    

if __name__ == '__main__':
    app.run(debug=True, port=5555)

