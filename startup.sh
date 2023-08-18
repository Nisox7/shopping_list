#!/bin/bash

directorio="/app/instance"

if [ -z "$(ls -A $directorio)" ]; then
  echo "Migrating db..."
  flask --app project db init
  flask --app project db migrate
  flask --app project db upgrade
  python3 db_setup/db_setup.py
  echo "Db migrated succesfully"

else
  echo "Database already migrated"
fi

flask --app project db migrate
flask --app project db upgrade

gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 --bind 0.0.0.0:10515 project.app:app