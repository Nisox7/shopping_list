from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, session
from flask_login import login_required, current_user
from . import db
from .models import Config
from .bbdd import *

main = Blueprint('main', __name__)

@main.before_request
def before_first_request():
    if 'first_request_done' not in session:
        # Realizar aquí la acción deseada
        print("Executing startup things...")
        try:
            execute_on_db(f"CREATE TABLE AMOUNT_ITEMS (LIST VARCHAR(100), AMOUNT INT);")
            print("Amount items created")
        except Exception as e:
            print(f"Error creating amount_items: {e}")
        
        
        session['first_request_done'] = True


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


#-------------------LISTS-------------------

#----Read lists(tables) from db----
@main.route('/lists/list')
@login_required
def get_tables():

    tables_list=[]

    try:
        result = get_tables_from_db()
    except Exception as e:
        result = f"Error getting tables: {e}"
    
    tables = read_db("*","AMOUNT_ITEMS")

    for table in tables:
        resultado = {"list": table[0], "amount_items": table[1]}
        #tables_list.append(table[0])
        #tables_list.append(table[1])
        tables_list.append(resultado)


    return jsonify(tables_list)

#----Write lists(tables) on db----
@main.route('/lists/create', methods=['POST'])
@login_required
def create_table():
    table = request.get_json()

    result_list = table['list']

    try:
        create_table_db(result_list)
        result = {'message': 'True'}
    except:
        result = {'message': 'False'}

    return jsonify(result)

#----Delete lists(tables) on db----
@main.route('/lists/delete', methods=['POST'])
@login_required
def delete_table():
    data = request.get_json()
    local_list = data['list']

    try:
        remove_table_from_db(local_list)
        result={'message':'True'}
    except Exception as e:
        result = {'message':f"Error writing: {e}"}
    
    return result


#-------------------ITEMS-------------------

#----Read items from db----
@main.route('/items/list', methods=['POST'])
@login_required
def get_items():
    items_list=[]

    table = request.get_json()
    table = table['list']

    items = read_db("ITEM", table)
    for item in items:
        item = item[0]
        items_list.append(item)

    #print(items_list)
    return jsonify({'message': 'True', 'elements': items_list})


#----Write items on db----
@main.route('/items/create', methods=['POST'])
@login_required
def create_item():
    data = request.get_json()
    item = data['item']
    item_id = data['item_id']
    local_list = data['list']

    try:
        write_db(item, item_id, local_list)
        result={'message':'True'}
    except Exception as e:
        result = {'message':f"Error writing: {e}"}
    
    
    return jsonify(result)

#----Delete items on db----
@main.route('/items/delete', methods=['POST'])
@login_required
def delete_item():
    data = request.get_json()

    item_id = (data['item_id'])
    local_list = data['list']

    try:
        delete_from_db(item_id,local_list)
        result={'message':'True'}
    except Exception as e:
        result = {'message':f"Error writing: {e}"}
    
    return result