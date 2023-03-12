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
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'ID: {self.id}, Name {self.name}'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/endpoint/', methods = ['POST'])
def api():
    data = request.get_json()
    if "postType" in data:
        if "login" == data['postType']:
            username = data['username']
            password = data['password']
            user = User.query.filter_by(username=username, password=password).first()
            exists = user is not None
            if exists:
                user.is_logged_in = True
                db.session.commit()
                return { 'user' : user.username }
            else:
                return { 'Error' : 'User does not exist' }
        elif "register" == data['postType']:
            username = data['username']
            password = data['password']
            new_user = User(username=username, password=password)
            db.session.add(new_user)
            new_user.is_logged_in = True
            db.session.commit()
            return { 'user' : new_user.username }
        else:
            return { "Error" : "What are you doing?" }
    return { "Error" : "What are you doing?" }

if __name__ == '__main__':
    app.run()