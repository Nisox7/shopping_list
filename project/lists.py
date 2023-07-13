from flask import Blueprint, jsonify, request, render_template
from flask_login import login_required
from . import db
from .models import Lists, Items
from .functions.special_chars.special_chars import replace_special_chars
from .functions.serialize_list.serialize_list import serialize_lists_list

lists = Blueprint('lists', __name__)


#-------Read all lists--------
@lists.route('/lists/all')
@login_required
def index():
    lists_list = Lists.query.all()
    serialized_lists = serialize_lists_list(lists_list)

    return jsonify(lists = serialized_lists),200


#-------Read list by id--------
@lists.route('/list/<list_id>')
@login_required
def lists_id(list_id):

    lists_list = Lists.query.all()

    lists_list = serialize_lists_list(lists_list)

    response=400

    for lists in lists_list:
        if list_id == lists['list_id']:
            response=200
            return render_template('list.html')
    
    if response==400:
        return render_template('notfound.html',lista=list_id), 404

#-------Create--------

@lists.route('/lists/create', methods=['POST'])
@login_required
def lists_create():
    #post

    try:

        data = request.get_json()

        list_name = (data['name']).rstrip()
        list_id = replace_special_chars(list_name)
        amount_items = 0

        lists = Lists(list_id=list_id, name=list_name,amount_items=amount_items)
        
        db.session.add(lists)   
        db.session.commit()
        return {'message':'True'},200
    except Exception as e:
        return 404


#-------Delete--------

@lists.route('/lists/delete', methods=['POST'])
@login_required
def lists_delete():
    #post
    try:
        data = request.get_json()
        list_id = data['list']

        Lists.query.filter_by(list_id=list_id).delete()
        Items.query.filter_by(list_id=list_id).delete()

        db.session.commit()


        return {"message":"True"}
    except:
        return {"message":"False"}


#-------Update--------

@lists.route('/lists/update', methods=['POST'])
@login_required
def lists_update():
    #post

    data = request.get_json()


    id = data['id']
    list_name = data['name'].rstrip()
    amount_items = data['amount_items']
    list_id = replace_special_chars(list_name)
    list_img = data['img']

    print(id,list_name,amount_items,list_id)

    lists = Lists.query.filter_by(id=id).first()

    lists.name=list_name
    lists.amount_items=amount_items
    lists.list_id=list_id
    lists.list_img = list_img
    
    db.session.commit()

    return f'list {list_name} updated'