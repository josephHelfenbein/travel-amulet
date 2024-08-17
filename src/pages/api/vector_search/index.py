from flask import Flask

app = Flask(__name__)

@app.route('/api/vector_search')
def vector_search():
    return'Hello, World!'

# @app.route('/about')
# def about():
#   return 'About'