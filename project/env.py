#Load env file and the secret key from it

import os

secret_key = os.getenv("SECRET_KEY")
database_host = os.getenv("DATABASE_HOST")
database_name = os.getenv("DATABASE_NAME")
database_table = os.getenv("DATABASE_TABLE")
database_user = os.getenv("DATABASE_USER")
database_password = os.getenv("DATABASE_PASSWORD")