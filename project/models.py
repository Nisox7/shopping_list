from flask_login import UserMixin
from . import db


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
    is_admin = db.Column(db.Boolean(), default=False)


class Config(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    registration_enabled = db.Column(db.Boolean, default=False)


class RegisterLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link_name = db.Column(db.String(100))
    link_token = db.Column(db.String(100))
    link_complete = db.Column(db.String(150))
    is_admin = db.Column(db.Boolean(), default=False)