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

@api.route('/posts/<int:id_post>', methods=['PUT', 'DELETE'])
def posts_id(id_post):
    post = Post.query.get_or_404(id_post)

    if request.method == 'PUT':
        post.link = request.json.get('link', post.link)
        db.session.commit()

        db.session.refresh(post)
        return jsonify(post.to_dict())

    db.session.delete(post)
    db.session.commit()
    return ('', 200)
