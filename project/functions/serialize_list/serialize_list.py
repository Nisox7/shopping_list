def serialize_lists_list(lists_list): 
    serialized_lists = []

    for lists in lists_list:
        serialized_list = {
            'id': lists.id,
            'name': lists.name,
            'list_id': lists.list_id,
            'amount_items':lists.amount_items,
            'created':lists.created,
            'updated':lists.updated
        }
        serialized_lists.append(serialized_list)
    
    return serialized_lists


def serialize_items_list(items_list): 
    serialized_lists = []

    for items in items_list:
        serialized_list = {
            'id': items.id,
            'name': items.name,
            'list_id': items.list_id,
            'amount':items.amount,
            'is_checked':items.is_checked
        }
        serialized_lists.append(serialized_list)
    
    return serialized_lists