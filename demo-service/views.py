from flask import (
    Blueprint,
    jsonify,
)

from models import Post

api = Blueprint('api', __name__, url_prefix="")

@api.route('posts')
def posts():
    return jsonify({
        'posts': [post.to_dict(extended=True) for post in Post.query.all()]
    })