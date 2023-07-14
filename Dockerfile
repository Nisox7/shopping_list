FROM python:3.10-alpine3.18

WORKDIR /app

COPY . .

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 10515

RUN chmod +x startup.sh

CMD ["sh", "startup.sh"]