from flask import (
    Blueprint,
    jsonify,
    request,
)

from models import (
    db,
    Post,
)

api = Blueprint('api', __name__, url_prefix="")

@api.route('posts', methods=['GET', 'POST'])
def posts():
    if request.method == 'GET':
        return jsonify({
            'posts': [post.to_dict(extended=True) for post in Post.query.all()]
        })

    if not request.json:
        return jsonify()

    new_post = Post(**request.json)
    db.session.add(new_post)
    db.session.commit()

    db.session.refresh(new_post) # To have the id of the newly created object
    return jsonify(new_post.to_dict())
