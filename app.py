from flask import Flask, render_template, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__, template_folder='templates', static_folder='static')

# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Define the join table that connects users and achievements
user_achievement = db.Table('user_achievement',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('achievement_id', db.Integer, db.ForeignKey('achievement.id'))
)

# Define the models for the tables
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    logins = db.Column(db.Integer, default=0)
    seconds_in_game = db.Column(db.Integer, nullable=False, default=0)
    achievements = db.relationship('Achievement', secondary=user_achievement,
        backref=db.backref('users', lazy='dynamic'), lazy='dynamic')

    def earn_achievement(self, achievement):
        if achievement not in self.achievements:
            self.achievements.append(achievement)
            db.session.commit()

    def has_achievement(self, achievement):
        return achievement in self.achievements

    def __str__(self):
        return f'ID: {self.id}, Name {self.username}'

    def __repr__(self):
        return f'ID: {self.id}, Name {self.username}'

class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False, unique=True)
    description = db.Column(db.String(100), nullable=False)

    def __str__(self):
        return f'{self.name} - {self.description}'

    def __repr__(self):
        return f'{self.name} &ndash; {self.description}'

def create_default_achievement():
    achievement = Achievement.query.filter_by(id=1).first()
    if achievement is None:
        achievement = Achievement(name='Hello World', description='Log in for the first time.')
        db.session.add(achievement)
        db.session.commit()

# Routes
@app.route('/', methods = ['GET'])
def home():
    create_default_achievement()
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
                hours, seconds_remainder = divmod(user.seconds_in_game, 3600)
                minutes, seconds = divmod(seconds_remainder, 60)
                response = { 
                    'user' : user.username,
                    'user-id' : user.id,
                    'hours' : hours,
                    'minutes' : minutes,
                    'seconds' : seconds
                }
                user.logins += 1
                db.session.commit()
                return response
            else:
                return {'error': 'A user with that username and password does not exist.'}
        elif "register" == data['postType']:
            username = data['username']
            password = data['password']
            try:
                new_user = User(username=username, password=password)
                db.session.add(new_user)
                db.session.commit()
                new_user.logins += 1
                db.session.commit()
            except Exception as e:
                if "UNIQUE constraint failed" in str(e):
                    return {'error': 'A player with that username already exists.'}
                else:
                    return {'error': str(e)}
            response = {
                'user' : new_user.username,
                'user-id' : new_user.id
            }
            return response
        elif "save" == data['postType']:
            username = data["username"]
            hours = data["hours"]
            minutes = data["minutes"]
            seconds = data["seconds"]
            user = User.query.filter_by(username=username).first()
            secondsTotal = int(seconds) + (int(hours)*3600) + (int(minutes)*60)
            user.seconds_in_game = secondsTotal
            db.session.commit()
            a1 = Achievement.query.filter_by(id=1).first()
            response = {
                'user' : user.username,
                'saved' : True,
                'logins': user.logins,
                'earnedA1' : user.has_achievement(a1)
            }
            return response
        elif "achievement" == data['postType']:
            user = User.query.filter_by(id=int(data['user_id'])).first()
            achievement = Achievement.query.filter_by(id=int(data['achievement_id'])).first()
            user.earn_achievement(achievement)
            db.session.commit()
            return {'achievement': repr(achievement)}
        else:
            return {'error': 'What are you doing?'}
    return {'error': 'What are you doing?'}

if __name__ == '__main__':
    db.create_all()
    app.run()