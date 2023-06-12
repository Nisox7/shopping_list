import os
import sys

project_path = os.path.abspath('/app')
#project_path = os.path.abspath('/home/nico/Documentos/Programing/projects/shopping_list')
sys.path.insert(0, project_path)

from project import create_app, db
from project.models import User
from werkzeug.security import generate_password_hash

# Create the Flask application
app = create_app()

# Obtain the application context
with app.app_context():

    db.create_all()
    # Perform database operations within the application context

    email = "test@demo.com"
    name = "admin"
    password = "ChangeMe"
    is_admin = True

    admin = User(email=email, name=name, password=generate_password_hash(password, method='sha256'), is_admin=is_admin)

    db.session.add(admin)
    db.session.commit()