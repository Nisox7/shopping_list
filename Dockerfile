FROM python:3.10-alpine3.16

WORKDIR /app

COPY . .

RUN pip3 install -r requirements.txt

ENV FLASK_APP=project
#ENV FLASK_DEBUG=1
#uncomment only dev purposes

EXPOSE 5000

RUN chmod +x startup.sh

#CMD ["flask", "run", "--host", "0.0.0.0"]
CMD ["sh", "startup.sh"]
