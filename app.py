from flask import Flask, render_template, request, abort
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
        return f'ID: {self.id}, Name {self.username}'

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
                return {'error': 'A user with that username and password does not exist.'}
        elif "register" == data['postType']:
            username = data['username']
            password = data['password']
            try:
                new_user = User(username=username, password=password)
                db.session.add(new_user)
                db.session.commit()
            except Exception as e:
                if "UNIQUE constraint failed" in str(e):
                    return {'error': 'A player with that username already exists.'}
                else:
                    return {'error': str(e)}
            return { 'user' : new_user.username }
        else:
            return {'error': 'What are you doing?'}
    return {'error': 'What are you doing?'}

if __name__ == '__main__':
    app.run()