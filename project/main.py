from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify, session
from flask_login import login_required, current_user
from . import db
from .models import Config, User
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

        #try:
            #db.create_all()
        #    print("DB CREATE ALL")
        #except Exception as e:
        #    print("error: ",e)
        
        
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


@main.route('/admin')
@login_required
def admin():
    if current_user.is_admin:
        
        config = Config.query.order_by(Config.id.desc()).first()
        users = User.query.all()

        return render_template('admin.html', users=users, registration_enabled=config.registration_enabled)
    else:
        return render_template('nopermission.html')  



@main.route('/admin/register', methods=['POST'])
@login_required
def admin_change_permission():

    if current_user.is_admin:

        response = request.get_json()

        state = response['buttonStatus']

        print(state)

        config = Config(registration_enabled=state)
        db.session.add(config)
        db.session.commit()

        return jsonify(state)



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

    items = read_db("*", table)
    #print(items[0])

    for things in items:
        total_items_list=[]

        item = things[1]
        item_checked = things[2]

        print(item)
        print(item_checked)

        total_items_list.append(item)
        total_items_list.append(item_checked)

        items_list.append(total_items_list)
    
    print(items_list)

    return jsonify({'message': 'True', 'elements': items_list})
    #return jsonify({'message': 'True'})


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

#----Delete items on db----
@main.route('/items/checked', methods=['POST'])
@login_required
def items_checked():
    data = request.get_json()

    try:
        local_list = data['list']

        checked_items = data['changes']

        for item in checked_items:
            item_id = (item)
            status = (checked_items[item])

            item_checked(item_id,status,local_list)

        result={'message':'True'}

    except:
        result={'message':'False'}
        
    return result




@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, email=current_user.email)

@main.route('/base')
@login_required
def base():
    return render_template('base.html')