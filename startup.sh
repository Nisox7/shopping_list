#!/bin/bash

directorio="/app/instance"

if [ -z "$(ls -A $directorio)" ]; then
  echo "Migrating db..."
  flask db init
  flask db migrate
  flask db upgrade
  python3 db_setup/db_setup.py
  echo "Db migrated succesfully"

else
  echo "Database already migrated"
fi

gunicorn --bind 0.0.0.0:10515 run:app