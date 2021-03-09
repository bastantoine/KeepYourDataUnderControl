import os

from dotenv import load_dotenv
from flask import (
    Blueprint,
    url_for,
    redirect,
    render_template,
    request,
)
import requests

views = Blueprint('views', __name__, url_prefix="")

load_dotenv()
API_ENDPOINT = os.environ.get('API_ENDPOINT')

@views.route('/')
def home():
    req = requests.get(os.path.join(API_ENDPOINT, 'posts'))
    if req.status_code == requests.codes.ok:
        posts = req.json()['posts']
        return render_template('home.html', posts=posts)

@views.route('/post/add', methods=['POST'])
def post_add():
    uploaded_file = request.files['file']
    files = {'file': (uploaded_file.filename, uploaded_file)}

    req = requests.post(os.path.join(API_ENDPOINT, 'posts'), files=files)
    if req.status_code == requests.codes.ok:
        return redirect(url_for('views.home'), code=302)
