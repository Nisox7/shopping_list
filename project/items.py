from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from . import db
from .models import Items, Lists
from .functions.serialize_list.serialize_list import serialize_items_list

from datetime import datetime

items = Blueprint('Items', __name__)

#-------Read all items--------
@items.route('/items/all')
@login_required
def index():

    items_list = Items.query.all()

    serialized_lists = serialize_items_list(items_list)

    return jsonify(items=serialized_lists),200


#-------Read items by list_id--------
@items.route('/items/<list_id>')
@login_required
def items_list(list_id):

    items_list = Items.query.filter_by(list_id=list_id).all()
    serialized_items = serialize_items_list(items_list)

    list_name = Lists.query.filter_by(list_id=list_id).all()
    list_name = list_name[0].name

    return jsonify(items=serialized_items,list_name=list_name),200


#-------Create--------

@items.route('/items/create', methods=['POST'])
@login_required
def items_create():
    #post
    
    try:
        data = request.get_json()

        item_name = (data['item']).rstrip()
        amount = data['amount']
        list_id = data['listId']
        is_checked=False

        item = Items(name=item_name, list_id=list_id, amount=amount, is_checked=is_checked)

        db.session.add(item)
        db.session.commit()

        increment_items(list_id)

        return {"message":"True"}
    except:
        return {"message":"False"}


#-------Delete--------

@items.route('/items/delete', methods=['POST'])
@login_required
def lists_delete():
    #post
    try:
        data = request.get_json()
        id = data['id']
        list_id = data['listId']

        for i in id:

            Items.query.filter_by(id=i).delete()
            decrement_items(list_id)
            
    
        db.session.commit()

        return {"message":"True"}
    except:
        return {"message":"False"}


#-------Update--------

@items.route('/items/update', methods=['POST'])
@login_required
def items_update():
    #post

    data = request.get_json()

    id = data['id']
    item_name = data['name']
    list_id = data['listId']
    amount = data['amount']
    is_checked = data['isChecked']

    items = Items.query.filter_by(id=id).first()

    items.name = item_name
    items.list_id = list_id
    items.amount = amount
    items.is_checked = is_checked

    db.session.commit()

    return f'item {item_name} updated'


#----Delete items on db----
@items.route('/items/checked', methods=['POST'])
@login_required
def items_checked():

    #post
    try:
        data = request.get_json()
        
        list_id = (data['list'])
        items = (data['changes'])

        for item in items:
            item_id = (item)
            status = (items[item])

            itemsx = Items.query.filter_by(id=item_id).first()

            itemsx.is_checked = status
        

        listx = Lists.query.filter_by(list_id=list_id).first()
        listx.updated = datetime.utcnow()

        db.session.add(listx)

        db.session.commit()

        return {"message":"True"}
    except:
        return {"message":"False"}


def increment_items(list_id):

    try:
        listx = Lists.query.filter_by(list_id=list_id).first()
        
        listx.amount_items = listx.amount_items+1
        listx.updated = datetime.utcnow()

        db.session.add(listx)

        db.session.commit()

        return True
    
    except:
        return False


def decrement_items(list_id):

    try:
        listx = Lists.query.filter_by(list_id=list_id).first()
        
        listx.amount_items = listx.amount_items-1
        listx.updated = datetime.utcnow()

        db.session.add(listx)

        db.session.commit()

        return True
    
    except:
        return False
