from flask_login import login_user, login_required, logout_user, current_user
from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db
from .models import Config

auth = Blueprint('auth', __name__)


@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/login', methods=['POST'])
def login_post():
   # login code goes here
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else True #THIS MUST BE FALSE

    user = User.query.filter_by(email=email).first()

    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login')) # if the user doesn't exist or password is wrong, reload the page

    # if the above check passes, then we know the user has the right credentials
    login_user(user, remember=remember)
    return redirect(url_for('main.index'))


@auth.route('/signup')
def signup():
    #config = Config.query.first()
    try:
        config = Config.query.order_by(Config.id.desc()).first()
        if config == None:
            enabled = True
        elif config.registration_enabled:
            enabled = True
        else:
            enabled = False

    except:
        enabled = True

    if enabled == True:
        return render_template('signup.html')
    else:
        flash('The user registration is disabled')
        return redirect(url_for('main.index'))

@auth.route('/signup', methods=['POST'])
def signup_post():

    # code to validate and add user to database goes here
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database

    is_admin=False

    if user: # if a user is found, we want to redirect back to signup page so user can try again
        flash('Email address already exists')
        return redirect(url_for('auth.signup'))

    # create a new user with the form data. Hash the password so the plaintext version isn't saved.
    new_user = User(email=email, name=name, password=generate_password_hash(password, method='sha256'),is_admin=is_admin)

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return redirect(url_for('auth.login'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))


@auth.route('/change_password')
@login_required
def change_password():
    return render_template('change_password.html')


@auth.route('/change_password', methods=['POST'])
@login_required
def change_password_post():

    email = current_user.email
    actual_password = request.form.get('actual-password')
    password1 = request.form.get('new-password')
    password2 = request.form.get('confirm-password')

    user = User.query.filter_by(email=email).first()

    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user or not check_password_hash(user.password, actual_password):
        flash('Password incorrect') 
    else:
    
        if password1 == password2:

            #Logic for change password
            user.password = generate_password_hash(password1, method='sha256')
            db.session.commit()
            flash('Password changed succesfully')

        
        else:
            flash('Passwords do not match')

    return redirect(url_for('main.profile'))


@auth.route('/profile/edit', methods=['POST'])
@login_required
def profile_edit():


    current_email = current_user.email
    new_email =  request.form.get('email')
    new_name = request.form.get('name')

    try:
        user = User.query.filter_by(email=current_email).first()

        user.email = new_email
        user.name = new_name
        
        db.session.commit()

        flash("Changes saved")
    except:
        flash("Error saving the changes")

    return redirect(url_for('main.profile'))

@auth.route('/users/edit', methods=['POST'])
@login_required
def users_edit():

    user_id = request.form.get('userIdInput')
    new_email =  request.form.get('emailInput')
    new_name = request.form.get('nameInput')
    is_admin = request.form.get('adminInput')

    if is_admin == 'on':
        is_admin=True
    else:
        is_admin=False

    try:
        user = User.query.filter_by(id=user_id).first()

        user.email = new_email
        user.name = new_name
        user.is_admin = is_admin
        
        db.session.commit()

        flash("Changes saved")
    except:
        flash("Error saving the changes")

    return redirect(url_for('main.admin'))

@auth.route('/users/delete', methods=['POST'])
@login_required
def users_delete():

    user_id = request.form.get('deleteUserIdInput')
    print(user_id)
    try:
        User.query.filter_by(id=user_id).delete()
        db.session.commit()
        flash("User deleted")
    except:
        flash("Error deleting user")

    return redirect(url_for('main.admin'))

def db_setup(email,name,password,is_admin):
    
    admin_user = User(email=email, name=name, password=generate_password_hash(password, method='sha256'),is_admin=is_admin)

    # add the new user to the database
    db.session.add(admin_user)
    db.session.commit()