from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
import os
from werkzeug.security import generate_password_hash, check_password_hash
import traceback
import sqlite3
import time
from database import Database

app = Flask(__name__)

# Define allowed origins based on environment
ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
]

# Add production URLs if in production environment
if os.environ.get('FLASK_ENV') == 'production':
    ALLOWED_ORIGINS.extend([
        # Add your production URLs here
        "https://your-production-domain.com",
    ])

# Configure CORS with more security
CORS(app, resources={
    r"/*": {
        "origins": ALLOWED_ORIGINS,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 86400  # Cache preflight requests for 24 hours
    }
})

# Secret key for JWT - use a strong key in production
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
if os.environ.get('FLASK_ENV') == 'production' and SECRET_KEY == 'your-secret-key':
    print("WARNING: Using default SECRET_KEY in production. This is insecure!")

# Initialize the database
db = Database()

# Helper function to verify JWT token
def verify_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, 'Missing or invalid token'
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, 'Token expired'
    except jwt.InvalidTokenError:
        return None, 'Invalid token'

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        print("Signup data:", data)
        
        # Basic validation
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing required fields'}), 400
            
        # Check if username exists
        if db.get_user_by_username(data['username']):
            return jsonify({'message': 'Username already exists'}), 400
            
        # Check if email exists
        if db.get_user_by_email(data['email']):
            return jsonify({'message': 'Email already exists'}), 400
            
        # Create user
        success = db.create_user(
            data['username'],
            data['email'],
            data['password'],
            data.get('security_question', ''),
            data.get('security_answer', '')
        )
        
        if success:
            return jsonify({
                'message': 'User created successfully',
                'username': data['username']
            }), 201
        else:
            return jsonify({'message': 'Failed to create user'}), 500
            
    except Exception as e:
        print(f"Error in signup: {str(e)}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Login attempt for:", data.get('username'))
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'message': 'Missing username or password'}), 400
        
        user = db.verify_user(data['username'], data['password'])
        if user:
            # Generate JWT token
            token_expiry = datetime.utcnow() + timedelta(days=1)  # Token valid for 1 day
            token = jwt.encode(
                {
                    'user_id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'exp': token_expiry
                },
                SECRET_KEY,
                algorithm='HS256'
            )
            
            print("Login successful for:", data['username'])
            return jsonify({
                'message': 'Login successful',
                'username': user['username'],
                'email': user['email'],
                'token': token
            }), 200
        else:
            print("Login failed for:", data['username'])
            return jsonify({'message': 'Invalid username or password'}), 401
            
    except Exception as e:
        print(f"Error in login: {str(e)}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/save-result', methods=['POST'])
def save_result():
    try:
        payload, error = verify_token()
        if error:
            return jsonify({'message': error}), 401
        
        username = payload['username']
        data = request.json
        
        success = db.save_quiz_result(
            username,
            data['topic'],
            data['score'],
            data['total']
        )
        
        if success:
            return jsonify({'message': 'Result saved successfully'}), 200
        else:
            return jsonify({'message': 'Failed to save result'}), 500
        
    except Exception as e:
        print(f"Error saving result: {str(e)}")
        return jsonify({'message': str(e)}), 500

@app.route('/api/user/stats', methods=['GET'])
def get_user_stats():
    try:
        payload, error = verify_token()
        if error:
            return jsonify({'message': error}), 401
        
        username = payload['username']
        stats = db.get_user_stats(username)
        
        if stats:
            return jsonify(stats), 200
        else:
            return jsonify({'message': 'Failed to get user stats'}), 500
        
    except Exception as e:
        print(f"Error getting user stats: {str(e)}")
        return jsonify({'message': str(e)}), 500

@app.route('/api/user/update', methods=['PUT'])
def update_user():
    try:
        payload, error = verify_token()
        if error:
            return jsonify({'message': error}), 401
        
        user_id = payload['user_id']
        data = request.json
        
        success, update_error = db.update_user(user_id, data)
        
        if success:
            return jsonify({
                'message': 'Profile updated successfully',
                'user': {
                    'id': user_id,
                    'username': data.get('username', payload['username']),
                    'email': data.get('email', payload['email'])
                }
            }), 200
        else:
            return jsonify({'message': update_error}), 400
        
    except Exception as e:
        print(f"Error updating user: {str(e)}")
        return jsonify({'message': str(e)}), 500

@app.route('/api/save_score', methods=['POST'])
def save_score():
    try:
        data = request.get_json()
        print("Saving score:", data)
        
        # Validate data
        if not data or not all(key in data for key in ['username', 'topic', 'score', 'total']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        success = db.save_quiz_result(
            data['username'],
            data['topic'],
            data['score'],
            data['total']
        )
        
        if success:
            return jsonify({'message': 'Score saved successfully'}), 200
        else:
            return jsonify({'message': 'Failed to save score'}), 500
            
    except Exception as e:
        print(f"Error saving score: {str(e)}")
        return jsonify({'message': str(e)}), 500

@app.route('/api/user_stats/<username>', methods=['GET'])
def get_user_stats_by_username(username):
    try:
        stats = db.get_user_stats(username)
        
        if stats:
            return jsonify(stats), 200
        else:
            return jsonify({'message': 'Failed to get user stats'}), 500
        
    except Exception as e:
        print(f"Error getting user stats: {str(e)}")
        return jsonify({'message': str(e)}), 500

# Add a more secure password reset endpoint
@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        
        # Check required fields
        if not data or not all(key in data for key in ['username', 'security_answer', 'new_password']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # First verify the security answer
        security_valid = db.verify_security_answer(data['username'], data['security_answer'])
        
        if not security_valid:
            return jsonify({'message': 'Invalid security answer'}), 401
        
        # Get the user to find ID
        user = db.get_user_by_username(data['username'])
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Update password
        success, error = db.update_user(user[0], {'password': data['new_password']})
        
        if success:
            return jsonify({'message': 'Password reset successfully'}), 200
        else:
            return jsonify({'message': error}), 400
            
    except Exception as e:
        print(f"Error in password reset: {str(e)}")
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)