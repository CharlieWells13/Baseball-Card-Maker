import Player
import PlayerGenerator

from flask import Flask,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Data from Flask backend!"})

if __name__ == '__main__':
    app.run(debug=True, port=5555)