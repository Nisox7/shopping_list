import pymysql
#from env import database_user,database_host,database_name,database_password

database_host = "192.168.0.166"
database_user = "root"
database_password = "78Uf2DG3KrAV2BgFHUPaEC2xG8N9fAeyKKoFyqG"
database_name = "TEST_SHOPPING_LIST"

def connect():
    try:
        connection = pymysql.connect(host=database_host,
                                user=database_user,
                                password=database_password,
                                db=database_name)
        #print("Conexión correcta")
        cursor = connection.cursor()
        
        return connection, cursor

    except (pymysql.err.OperationalError, pymysql.err.InternalError) as e:
        print("Ocurrió un error al conectar: ", e)

    
#--------------------------

def create_table_db(table):

    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    try:
        cursor.execute(f"CREATE TABLE {table} (ITEM_ID VARCHAR(350), ITEM VARCHAR(350), TS TIMESTAMP DEFAULT current_timestamp);")
        connection.commit()
        print(f"created table: {table}")
        connection.close()
    except Exception as e:
        print(f"error writing db:\n{e}")

#--------------------------

def write_db(item, item_id, database_table):
    
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    try:
        cursor.execute(f"INSERT INTO {database_table} VALUES ('{item_id}','{item}',DEFAULT)")
        connection.commit()
        #print("db written correctly")
        connection.close()
    except Exception as e:
        print(f"error writing db:\n{e}")

#--------------------------

def read_db(args, database_table):

    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]


    cursor.execute(f"SELECT {args} FROM {database_table}")
    read = cursor.fetchall()

    connection.close()

    return read



def delete_from_db(item_id, database_table):
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    try:
        cursor.execute(f"DELETE FROM {database_table} WHERE ITEM_ID='{item_id}'")
        connection.commit()
        #print("db written correctly")
        connection.close()
    except Exception as e:
        print(f"error deleting item on db:\n{e}")


def get_tables_from_db():
    tables_list=[]

    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()

    connection.close()

    for table in tables:
        tables_list.append(table[0])

    return tables_list


def remove_table_from_db(table):
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    try:
        cursor.execute(f"DROP TABLE {table}")
        connection.commit()
        #print("db written correctly")
        connection.close()
    except Exception as e:
        print(f"error writing db:\n{e}")



def execute_on_db(entry):
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    cursor.execute(entry)
    read = cursor.fetchall()

    connection.close()

    return read
