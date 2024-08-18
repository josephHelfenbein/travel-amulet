from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/api/vector_search', methods=['GET'])
def vector_search():
    
    return'Hello, World!'

