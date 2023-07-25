from . import create_app
from geventwebsocket.handler import WebSocketHandler

app = create_app()

if __name__ == '__main__':
    # Use GeventWebSocket server instead of socketio.run
    from gevent.pywsgi import WSGIServer

    http_server = WSGIServer(('0.0.0.0', 10515), app, handler_class=WebSocketHandler)
    try:
        http_server.serve_forever()
    except KeyboardInterrupt:
        http_server.stop()
