FROM python:3.10-alpine3.16

WORKDIR /app

COPY . .

RUN pip3 install -r requirements.txt

ENV FLASK_APP=project
#ENV FLASK_DEBUG=1

RUN flask db init
RUN flask db migrate
RUN flask db upgrade

EXPOSE 5000

CMD ["flask", "run", "--host", "0.0.0.0"]