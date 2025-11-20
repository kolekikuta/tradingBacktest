from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class Spy(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, unique=True, nullable=False)
    open = db.Column(db.Float, nullable=False)
    high = db.Column(db.Float, nullable=False)
    low = db.Column(db.Float, nullable=False)
    close = db.Column(db.Double, nullable=False)
    volume = db.Column(db.Integer, nullable=False)