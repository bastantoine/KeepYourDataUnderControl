FROM python:3.8.5-alpine

# Set environment variables
ENV PYTHONUNBUFFERED 1

ENV API_ROOT_FOLDER="/usr/src/app"
WORKDIR "${API_ROOT_FOLDER}"

COPY requirements.txt .

# Install dependencies.
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN addgroup -S webuser && adduser -S webuser -G webuser

# Copy project code.
COPY . .

ENV LOGFOLDER="${API_ROOT_FOLDER}/log"
RUN mkdir -p $LOGFOLDER && touch "$LOGFOLDER/access.log" && touch "$LOGFOLDER/error.log"

# We need to make sure that the folder used to store the uploaded files is
# created before we mount it as a volume, so that the gunicorn workers have
# write rights on it
RUN mkdir -p "${API_ROOT_FOLDER}/upload_files"

# chown all the files to the app user
RUN chown -R webuser:webuser .

# change to the webuser user
USER webuser

# Start the server when the image is launched
CMD  gunicorn 'main:app' --bind 0.0.0.0:8000 --access-logfile "$LOGFOLDER/access.log" --error-logfile "$LOGFOLDER/error.log"
