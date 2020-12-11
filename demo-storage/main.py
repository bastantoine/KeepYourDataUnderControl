import os

from bson.objectid import ObjectId
from dotenv import load_dotenv
from flask import (
    abort,
    Flask,
    jsonify,
    request,
    Response,
    send_from_directory,
)
from pymongo import MongoClient
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.environ.get("API_UPLOAD_FOLDER", "./")

def save_file_and_get_key(filename):
    client = MongoClient(host=os.environ.get("MONGO_URL"))
    files = client[os.environ.get("MONGO_DB_NAME")][os.environ.get("MONGO_FILES_COLLECTION_NAME")]
    # MongoDB rquires all documents to have an _id field set, PyMongo does that for us and returns
    # it if we don't specify one in the first place when inserting document
    # https://pymongo.readthedocs.io/en/stable/faq.html#why-does-pymongo-add-an-id-field-to-all-of-my-documents
    inserted_id = files.insert_one({"link": filename})
    return str(inserted_id.inserted_id)

def get_file_path(key):
    client = MongoClient(host=os.environ.get("MONGO_URL"))
    files = client[os.environ.get("MONGO_DB_NAME")][os.environ.get("MONGO_FILES_COLLECTION_NAME")]
    file_found = files.find_one({"_id": ObjectId(key)})
    return file_found.get("link") if file_found else None


@app.route('/', methods=['POST'])
def upload_file():
    # Taken from: https://flask.palletsprojects.com/en/1.1.x/patterns/fileuploads/
    if 'file' not in request.files:
        abort(Response("Missing file", 400))

    file = request.files['file']
    if file.filename == '':
        abort(Response("Empty filename", 400))

    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    key = save_file_and_get_key(filename)
    return jsonify(url=os.path.join(request.base_url, key))


@app.route('/<key>')
def get_file(key):
    filename = get_file_path(key)
    if not filename:
        abort(404)
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
   app.run()
