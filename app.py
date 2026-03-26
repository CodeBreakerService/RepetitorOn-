import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_folder='static', template_folder='templates')

# Временная база данных (для продакшена на Render потом подключим PostgreSQL)
profiles = [
    {"id": 1, "name": "Иван Иванов", "subject": "Английский язык", "price": "1000 ₽/ч"}
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/profiles', methods=['GET'])
def get_profiles():
    return jsonify(profiles)

@app.route('/api/profiles', methods=['POST'])
def add_profile():
    data = request.json
    new_profile = {
        "id": len(profiles) + 1 if profiles else 1,
        "name": data.get("name"),
        "subject": data.get("subject"),
        "price": data.get("price")
    }
    profiles.append(new_profile)
    return jsonify({"status": "success", "profile": new_profile}), 201

@app.route('/api/profiles/<int:profile_id>', methods=['DELETE'])
def delete_profile(profile_id):
    global profiles
    profiles = [p for p in profiles if p['id'] != profile_id]
    return jsonify({"status": "deleted"}), 200

@app.route('/api/account', methods=['DELETE'])
def delete_account():
    global profiles
    profiles = [] # Имитация удаления аккаунта (очищаем все анкеты)
    return jsonify({"status": "account deleted"}), 200

if __name__ == '__main__':
    # Render автоматически задает переменную окружения PORT
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
