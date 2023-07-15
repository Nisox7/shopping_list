from .extensions import socketio
from flask_socketio import emit

@socketio.on("connect")
def handle_connect():
    print("Client connected!")

@socketio.on("listChanges")
def handle_list_changes():
    emit("reloadList", broadcast=True)

@socketio.on("itemChanges")
def handle_item_changes():
    print("Item changes")
    emit("reloadItems", broadcast=True)