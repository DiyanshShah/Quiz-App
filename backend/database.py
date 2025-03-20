import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import traceback
import time

class Database:
    def __init__(self):
        try:
            self.conn = sqlite3.connect('quiz.db', check_same_thread=False)
            self.cursor = self.conn.cursor()
            self.create_tables()
            print("Database initialized successfully")
        except Exception as e:
            print(f"Database initialization error: {str(e)}")
            traceback.print_exc()

    def create_tables(self):
        try:
            self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                security_question TEXT,
                security_answer TEXT
            )
            ''')
            
            self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                topic TEXT NOT NULL,
                score INTEGER NOT NULL,
                total INTEGER NOT NULL,
                timestamp INTEGER NOT NULL
            )
            ''')
            
            self.conn.commit()
            print("Tables created successfully")
        except Exception as e:
            print(f"Error creating tables: {str(e)}")
            traceback.print_exc()

    def create_user(self, username, email, password, security_question='', security_answer=''):
        try:
            # Hash the password
            hashed_password = generate_password_hash(password)
            
            # Hash the security answer if provided
            hashed_security_answer = ''
            if security_answer:
                hashed_security_answer = generate_password_hash(security_answer)
            
            self.cursor.execute('''
            INSERT INTO users (username, email, password, security_question, security_answer)
            VALUES (?, ?, ?, ?, ?)
            ''', (username, email, hashed_password, security_question, hashed_security_answer))
            self.conn.commit()
            print(f"User created successfully: {username}")
            return True
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            traceback.print_exc()
            return False

    def get_user_by_username(self, username):
        try:
            self.cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            return self.cursor.fetchone()
        except Exception as e:
            print(f"Error getting user by username: {str(e)}")
            traceback.print_exc()
            return None

    def get_user_by_email(self, email):
        try:
            self.cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            return self.cursor.fetchone()
        except Exception as e:
            print(f"Error getting user by email: {str(e)}")
            traceback.print_exc()
            return None

    def verify_user(self, username, password):
        try:
            user = self.get_user_by_username(username)
            if not user:
                return None
            
            # Column indices: 0=id, 1=username, 2=email, 3=password, ...
            stored_password = user[3]
            
            if check_password_hash(stored_password, password):
                return {
                    'id': user[0],
                    'username': user[1],
                    'email': user[2]
                }
            return None
        except Exception as e:
            print(f"Error verifying user: {str(e)}")
            traceback.print_exc()
            return None

    def verify_security_answer(self, username, answer):
        try:
            user = self.get_user_by_username(username)
            if not user or not user[5]:  # Check if user exists and has a security answer
                return False
            
            stored_answer = user[5]
            return check_password_hash(stored_answer, answer)
        except Exception as e:
            print(f"Error verifying security answer: {str(e)}")
            traceback.print_exc()
            return False

    def save_quiz_result(self, username, topic, score, total):
        try:
            self.cursor.execute('''
            INSERT INTO quiz_results (username, topic, score, total, timestamp)
            VALUES (?, ?, ?, ?, ?)
            ''', (
                username,
                topic,
                score,
                total,
                int(time.time() * 1000)  # Current timestamp in milliseconds
            ))
            self.conn.commit()
            return True
        except Exception as e:
            print(f"Error saving quiz result: {str(e)}")
            traceback.print_exc()
            return False

    def get_user_stats(self, username):
        try:
            self.cursor.execute('''
            SELECT * FROM quiz_results WHERE username = ? ORDER BY timestamp DESC
            ''', (username,))
            
            results = self.cursor.fetchall()
            
            # Calculate statistics
            stats = {
                'username': username,
                'quiz_results': [],
                'total_quizzes': len(results),
                'topics_taken': [],
                'total_questions': 0,
                'total_correct': 0
            }
            
            topic_set = set()
            
            for result in results:
                # Column indices: id(0), username(1), topic(2), score(3), total(4), timestamp(5)
                topic_set.add(result[2])
                stats['total_questions'] += result[4]
                stats['total_correct'] += result[3]
                
                stats['quiz_results'].append({
                    'topic': result[2],
                    'score': result[3],
                    'total': result[4],
                    'timestamp': result[5]
                })
            
            stats['topics_taken'] = list(topic_set)
            
            return stats
        except Exception as e:
            print(f"Error getting user stats: {str(e)}")
            traceback.print_exc()
            return None

    def update_user(self, user_id, data):
        try:
            # Build the query based on what data is provided
            fields_to_update = []
            values = []
            
            if 'username' in data:
                fields_to_update.append('username = ?')
                values.append(data['username'])
                
            if 'email' in data:
                fields_to_update.append('email = ?')
                values.append(data['email'])
                
            if 'security_question' in data:
                fields_to_update.append('security_question = ?')
                values.append(data['security_question'])
                
            if 'security_answer' in data:
                fields_to_update.append('security_answer = ?')
                # Hash the security answer
                hashed_answer = generate_password_hash(data['security_answer'])
                values.append(hashed_answer)
            
            if 'password' in data:
                fields_to_update.append('password = ?')
                # Hash the password
                hashed_password = generate_password_hash(data['password'])
                values.append(hashed_password)
            
            if not fields_to_update:
                return False, 'No fields to update'
            
            query = f'UPDATE users SET {", ".join(fields_to_update)} WHERE id = ?'
            values.append(user_id)
            
            self.cursor.execute(query, values)
            self.conn.commit()
            
            if self.cursor.rowcount == 0:
                return False, 'User not found or no changes made'
                
            return True, None
        except Exception as e:
            print(f"Error updating user: {str(e)}")
            traceback.print_exc()
            return False, str(e)
