import re
from unidecode import unidecode

def replace_special_chars(string):
    regex = r"[^\w-]"
    string = re.sub(regex, "-", string)
    string = string.lower()

    string = unidecode(string)

    return string