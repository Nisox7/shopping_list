FROM python:3.10

WORKDIR /app

COPY . .

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 5000

RUN chmod +x startup.sh

#CMD ["flask", "run", "--host", "0.0.0.0"]
CMD ["sh", "startup.sh"]
