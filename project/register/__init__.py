
import random
import string

# Function to generate a unique registration link
def generate_unique_token():
    # Generate a random string of characters for the token
    token_length = 10
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(token_length))


def generate_registration_link(root_url):
    token = generate_unique_token()

    return f"{root_url}sign-up/{token}",token