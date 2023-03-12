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

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    is_logged_in = db.Column(db.Boolean, nullable=False, default=False)

    def __repr__(self):
        return f'ID: {self.id}, Name {self.name}'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/endpoint/', methods = ['POST'])
def api():
    data = request.get_json()
    if "login" == data['postType']:
        username = data['username']
        password = data['password']
        user = User.query.filter_by(username=username, password=password).first()
        exists = user is not None
        if exists:
            user.is_logged_in = True
            db.session.commit()
            return { 'logged_in' : user.is_logged_in }
        else:
            return { 'Error' : 'User does not exist' }
    elif "register" == data['postType']:
        username = data['username']
        password = data['password']
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return { 'registered' : new_user.username }
    elif "valide-user" == data['postType']:
        username = data['username']
        user = User.query.filter_by(username=username).first()
        return { 'logged_in' : user.is_logged_in }
    return { "Error" : "What are you doing?" }

if __name__ == '__main__':
    app.run()