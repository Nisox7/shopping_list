from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, session
from flask_login import login_required, current_user
from . import db
from .models import Config, User, RegisterLink
from .register import generate_registration_link


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


@main.route('/admin')
@login_required
def admin():
    if current_user.is_admin:

        users = User.query.all()

        return render_template('admin.html', users=users)
    else:
        return render_template('nopermission.html')  



@main.route('/admin/registerlink')
@login_required
def admin_registerlink():
    if current_user.is_admin:
        
        config = Config.query.order_by(Config.id.desc()).first()
        registers_link = RegisterLink.query.all()

        return render_template('adminregister.html', registersLink=registers_link, registration_enabled=config.registration_enabled)
    else:
        return render_template('nopermission.html')  



@main.route('/admin/registerlink/new', methods=['POST'])
@login_required
def admin_registerlink_post():

    if current_user.is_admin:

        generate_link = generate_registration_link(request.url_root)

        url = generate_link[0]
        token=generate_link[1]

        name = request.form.get("nameInput")
        is_admin_form = request.form.get("adminInput")

        if is_admin_form == "on":
            is_admin=True
        else:
            is_admin=False
        

        register_link = RegisterLink(link_name=name, link_token=token, link_complete=url, is_admin=is_admin)

        db.session.add(register_link)
        
        db.session.commit()

        return redirect(url_for('main.admin_registerlink'))


@main.route('/admin/registerlink/del', methods=['POST'])
@login_required
def admin_registerlink_del_post():

    if current_user.is_admin:

        token_id = request.form.get("id")

        RegisterLink.query.filter_by(id=token_id).delete()
        db.session.commit()

        return redirect(url_for('main.admin_registerlink'))


@main.route('/admin/newUsersRegister', methods=['POST'])
@login_required
def admin_change_permission():

    if current_user.is_admin:

        response = request.get_json()

        state = response['buttonStatus']

        print(state)

        config = Config.query.filter_by(id=1).first()

        config.registration_enabled=state

        db.session.commit()

        return jsonify(state)


@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, email=current_user.email)

@main.route('/base')
@login_required
def base():
    return render_template('base.html')