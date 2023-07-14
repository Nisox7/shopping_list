FROM python:3.10-alpine3.18

WORKDIR /app

COPY . .

RUN apk add --no-cache python3-dev build-base linux-headers pcre-dev

RUN pip3 install --no-cache-dir -r requirements.txt

#RUN apk del python3-dev build-base linux-headers pcre-dev

EXPOSE 5000

RUN chmod +x startup.sh

#CMD ["flask", "run", "--host", "0.0.0.0"]
CMD ["sh", "startup.sh"]
