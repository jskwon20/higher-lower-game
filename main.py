from flask import Flask, render_template, jsonify, request, send_from_directory
import os
import random
from game_data import data

app = Flask(__name__, static_folder='static', template_folder='templates')

# Serve static files
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/new-round')
def new_round():
    account_a = random.choice(data)
    account_b = random.choice(data)
    
    while account_a == account_b:
        account_b = random.choice(data)
    
    return jsonify({
        "account_a": account_a,
        "account_b": account_b
    })

@app.route('/api/check-answer', methods=['POST'])
def check_answer():
    data = request.get_json()
    guess = data.get('guess', '').lower()
    a_followers = data.get('a_followers', 0)
    b_followers = data.get('b_followers', 0)
    
    if guess == 'a':
        return jsonify({'correct': a_followers > b_followers})
    else:
        return jsonify({'correct': a_followers < b_followers})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)