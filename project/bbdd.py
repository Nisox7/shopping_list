import pymysql
from .env import database_user,database_host,database_name,database_password

#--------------connection function--------------
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


#--------------General purpose function--------------

def read_on_db(entry):
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    cursor.execute(entry)
    read = cursor.fetchall()

    connection.close()

    return read

def execute_on_db(entry):
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    try:
        cursor.execute(entry)
        connection.commit()
        print("Tabla creada")
    except pymysql.err.OperationalError:
        print("La tabla ya existía")

    connection.close()


#------------------------------------------------------------------------------------
#-----------------------------------TABLES (LISTS)-----------------------------------
#------------------------------------------------------------------------------------


#--------------Create table (list) on db--------------

def create_table_db(table):

    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    try:
        cursor.execute(f"CREATE TABLE {table} (ITEM_ID VARCHAR(350), ITEM VARCHAR(350), TS TIMESTAMP DEFAULT current_timestamp);")
        print(f"created table: {table}")

        cursor.execute(f"INSERT INTO AMOUNT_ITEMS VALUES ('{table}',0)")

        connection.commit()

        connection.close()
    except Exception as e:
        print(f"error writing db:\n{e}")


#--------------Read or get all tables (lists) from db--------------

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


#--------------Remove table (list) on db--------------

def remove_table_from_db(table):
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    try:
        cursor.execute(f"DROP TABLE {table}")

        cursor.execute(f"DELETE FROM AMOUNT_ITEMS WHERE LIST='{table}'")

        connection.commit()
        #print("db written correctly")
        connection.close()
    except Exception as e:
        print(f"error writing db:\n{e}")


#--------------Write amount of items on corresponding table (list)--------------

def increment_item(list_name):
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    cursor.execute(f"SELECT AMOUNT FROM AMOUNT_ITEMS WHERE LIST = '{list_name}';")
    old_item_amount = cursor.fetchall()
    old_item_amount=old_item_amount[0][0]

    new_item_amount = old_item_amount + 1
    print(new_item_amount)

    cursor.execute(f"UPDATE AMOUNT_ITEMS SET AMOUNT = '{new_item_amount}' WHERE LIST = '{list_name}'")
    connection.commit()
    
    connection.close()



#--------------Get amount of items on corresponding table (list)--------------

def decrement_item(list_name, connection, cursor):
    print("DECREMENT ITEM")

    cursor.execute(f"SELECT AMOUNT FROM AMOUNT_ITEMS WHERE LIST = '{list_name}';")
    old_item_amount = cursor.fetchall()
    old_item_amount=old_item_amount[0][0]

    new_item_amount = old_item_amount - 1
    print(new_item_amount)

    cursor.execute(f"UPDATE AMOUNT_ITEMS SET AMOUNT = '{new_item_amount}' WHERE LIST = '{list_name}'")




#--------------------------------------------------------------------------------------
#-----------------------------------ITEMS (ELEMENTS)-----------------------------------
#--------------------------------------------------------------------------------------

#--------------Write items on corresponding table (list)--------------

def write_db(item, item_id, database_table):
    
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    try:
        cursor.execute(f"INSERT INTO {database_table} VALUES ('{item_id}','{item}',DEFAULT)")
        connection.commit()
        #print("db written correctly")
        connection.close()

        increment_item(database_table)

    except Exception as e:
        print(f"error writing db:\n{e}")


#--------------Read from database--------------

def read_db(args, database_table):

    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]


    cursor.execute(f"SELECT {args} FROM {database_table}")
    read = cursor.fetchall()

    connection.close()

    return read


#--------------Delete items on corresponding table (list)--------------

def delete_from_db(item_id, database_table):
    ddbb = connect()
    connection=ddbb[0]
    cursor=ddbb[1]

    try:
        cursor.execute(f"DELETE FROM {database_table} WHERE ITEM_ID='{item_id}'")
        #print("db written correctly")

        decrement_item(database_table, connection, cursor)
        
        connection.commit()
        connection.close()

    except Exception as e:
        print(f"error deleting item on db:\n{e}")