from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from . import db
from .models import Config

main = Blueprint('main', __name__)

@main.route('/')
@login_required
def index():
    return render_template('index.html', name=current_user.name)

@main.route('/list')
@login_required
def lists():
    #return render_template('list.html')
    return render_template('list.html', name=current_user.name)


@main.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        # Verificar si el usuario es un administrador (puedes utilizar Flask-Login o tu propio mecanismo de autenticación)
        if current_user.is_admin:

            str_state = request.form.get('torf')

            if str_state == "True":
                state = True
            elif str_state == "False":
                state = False
            else:
                state = False

            config = Config(registration_enabled=state)
            db.session.add(config)
            db.session.commit()

            flash('El estado del registro ha sido actualizado.')
            return redirect(url_for('main.admin'))

    config = Config.query.first()
    return render_template('admin.html', registration_enabled=config.registration_enabled)