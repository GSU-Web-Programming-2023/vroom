from flask import Flask, render_template, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app, origins=['http://localhost:5000', 'http://127.0.0.1:5000'], supports_credentials=True)

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

def create_achievements():
    achievement = Achievement.query.filter_by(id=1).first()
    if achievement is None:
        achievement = Achievement(name='Hello World', description='Log in for the first time.')
        db.session.add(achievement)
        db.session.commit()
        
        achievement = Achievement(name='Avid Gamer', description='Log in 10 times.')
        db.session.add(achievement)
        db.session.commit()
        
        achievement = Achievement(name='Elon\'s Helper', description='Find and talk to XB1.')
        db.session.add(achievement)
        db.session.commit()
        
        achievement = Achievement(name='Five Head', description='Hit 5 Aliens.')
        db.session.add(achievement)
        db.session.commit()

        # Add more achievements as needed
        # Delete instance and migrations folders and recreate the database if you modify this

# Routes
@app.route('/', methods = ['GET'])
def home():
    create_achievements()
    return render_template('index.html')

@app.route('/api/endpoint/', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
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

                # Retrieve achievements belonging to the user
                user_achievements = user.achievements.all()
                aList = []
                for a in user_achievements:
                    aList.append({
                        'id': a.id,
                        'name': a.name,
                        'description': a.description
                    })
                
                response = {
                    'user': user.username,
                    'user-id': user.id,
                    'hours': hours,
                    'minutes': minutes,
                    'seconds': seconds,
                    'achievements': aList
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
            a2 = Achievement.query.filter_by(id=2).first()
            a3 = Achievement.query.filter_by(id=3).first()
            a4 = Achievement.query.filter_by(id=4).first()
            response = {
                'user' : user.username,
                'saved' : True,
                'logins': user.logins,
                'earnedA1' : user.has_achievement(a1),
                'earnedA2' : user.has_achievement(a2),
                'earnedA3' : user.has_achievement(a3),
                'earnedA4' : user.has_achievement(a4)
            }
            return response
        elif "achievement" == data['postType']:
            user = User.query.filter_by(id=int(data['user_id'])).first()
            achievement_obj = Achievement.query.filter_by(id=int(data['achievement_id'])).first()
            user.earn_achievement(achievement_obj)
            db.session.commit()
            achievement = {
                'id': achievement_obj.id,
                'name': achievement_obj.name,
                'description': achievement_obj.description,
            }
            return {'achievement': achievement}
        else:
            return {'error': 'What are you doing?'}
    return {'error': 'What are you doing?'}

if __name__ == '__main__':
    db.create_all()
    app.run()