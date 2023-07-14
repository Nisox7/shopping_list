
# Shopping List

A shopping list made with Flask, Bootstrap & Javascript.


## Deployment

To deploy this app using docker:

```bash
  docker run -d \
    --restart=always \
    -p 10515:5000 \
    -v ./shopping_list/configs:/app/instance \
    --name shopping_list \
    nisox7/shopping_list:latest
```

Deploy using docker-compose:

```yaml
version: '3.3'
services:
    shopping_list:
        container_name: shopping_list
        image: 'nisox7/shopping_list:latest'
        volumes:
            - './shopping_list/configs:/app/instance'
        ports:
            - 10515:5000
        restart: always

```


