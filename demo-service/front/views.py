import os

from dotenv import load_dotenv
from flask import (
    Blueprint,
    render_template,
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
