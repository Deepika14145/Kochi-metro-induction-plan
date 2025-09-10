# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sqlite3
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("API_KEY"))

def get_db_connection():
    conn = sqlite3.connect('kochi_metro.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/trainsets', methods=['GET'])
def get_trainsets():
    conn = get_db_connection()
    trainsets = conn.execute('SELECT * FROM trainsets').fetchall()
    conn.close()
    
    trainsets_list = [dict(row) for row in trainsets]
    return jsonify(trainsets_list)

@app.route('/api/generate-plan', methods=['POST'])
def generate_plan():
    data = request.get_json()
    if not data or 'trains' not in data or 'rules' not in data or 'weights' not in data:
        return jsonify({"error": "Missing data"}), 400
    
    prompt = f"""
    You are an expert in train scheduling. You are provided the following train data,
    the scheduling rules and the weights to calculate the fitness score for a train.
    You must provide the calculated plan of action based on the input data.
    The output must be strictly in JSON.
    ---
    Trains: {json.dumps(data['trains'])}
    Rules: {json.dumps(data['rules'])}
    Weights: {json.dumps(data['weights'])}
    """
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        # Assuming the response is a JSON string, try to parse it
        parsed_response = json.loads(response.text)
        return jsonify(parsed_response), 200
    except Exception as e:
        return jsonify({"error": f"Gemini API error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)