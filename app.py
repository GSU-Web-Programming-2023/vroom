from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static'
)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'ID: {self.id}, Name {self.name}'


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/endpoint/', methods = ['POST'])
def api():
    data = request.get_json()
    name = data['name']
    response_data = {
        'message': f'Hello, {name}!'
    }
    return response_data

if __name__ == '__main__':
    app.run()