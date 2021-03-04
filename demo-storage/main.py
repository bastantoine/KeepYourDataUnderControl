import uuid
import os

from bson.objectid import ObjectId
from dotenv import load_dotenv
from flask import (
    abort,
    Flask,
    jsonify,
    request,
    Response,
    redirect,
    render_template,
    send_from_directory,
    url_for,
)
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = os.environ.get("API_UPLOAD_FOLDER", "./")

def get_files_collection():
    client = MongoClient(host=os.environ.get("MONGO_URL"))
    return client[os.environ.get("MONGO_DB_NAME")][os.environ.get("MONGO_FILES_COLLECTION_NAME")]

def save_file_and_get_key(filename):
    files_collection = get_files_collection()
    # MongoDB rquires all documents to have an _id field set, PyMongo does that for us and returns
    # it if we don't specify one in the first place when inserting document
    # https://pymongo.readthedocs.io/en/stable/faq.html#why-does-pymongo-add-an-id-field-to-all-of-my-documents
    inserted_id = files_collection.insert_one({"link": filename})
    return str(inserted_id.inserted_id)

def get_file_path(key):
    files_collection = get_files_collection()
    file_found = files_collection.find_one({"_id": ObjectId(key)})
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
    if os.path.isfile(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
        extension = ""
        if filename.find(".") != -1:
            # At least one dot means we have an extension
            values = filename.rsplit(".")
            # Make sure we put back the filename like it was before, though without the extension
            filename = '.'.join(values[:-1])
            extension = "." + values[-1]
        filename = filename + "_" + str(uuid.uuid4()) + extension

    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    key = save_file_and_get_key(filename)
    return jsonify(url=os.path.join(os.environ.get("BASE_URL") ,key))


@app.route('/<key>')
def get_file(key):
    if key == 'favicon.ico':
        # We don't have a favicon, let's make sure the
        # requests to see it are treated separately
        abort(404)
    filename = get_file_path(key)
    if not filename:
        abort(404)
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/__debug__')
def debug_main():
    files_collection = get_files_collection()
    return render_template('main.html',
        base_url=os.environ.get("BASE_URL"),
        files=[{
            'id': str(file['_id']),
            'link': file['link'],
        } for file in files_collection.find()])

@app.route('/__debug__/delete/')
def debug_delete_all():
    files_collection = get_files_collection()
    for file in files_collection.find():
        files_collection.delete_one({"_id": file["_id"]})
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file["link"]))
    return redirect(os.path.join(os.environ.get("BASE_URL"), url_for('debug_main')))

@app.route('/__debug__/delete/<key>')
def debug_delete(key):
    files_collection = get_files_collection()
    filename = get_file_path(key)
    if not filename:
        abort(404)
    files_collection.delete_one({"_id": ObjectId(key)})
    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return redirect(os.path.join(os.environ.get("BASE_URL"), url_for('debug_main')))

if __name__ == '__main__':
   app.run()
