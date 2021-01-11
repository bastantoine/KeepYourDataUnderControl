from datetime import datetime

from flask import (
    abort,
    Blueprint,
    jsonify,
    request,
    Response,
)

from models import (
    Comment,
    db,
    Post,
)

api = Blueprint('api', __name__, url_prefix="")

@api.route('posts', methods=['GET', 'POST'])
def posts():
    if request.method == 'GET':
        return jsonify({
            'posts': [post.to_dict(extended=True) for post in Post.query.order_by(Post.timestamp_creation.desc())]
        })

    # Taken from: https://flask.palletsprojects.com/en/1.1.x/patterns/fileuploads/
    if 'file' not in request.files:
        abort(Response("Missing file", 400))

    file = request.files['file']
    if file.filename == '':
        abort(Response("Empty filename", 400))

    filename = Post.add_file(file)
    new_post = Post(timestamp_creation=datetime.now(), filename=filename)
    db.session.add(new_post)
    db.session.commit()

    db.session.refresh(new_post) # To have the id of the newly created object
    return jsonify(new_post.to_dict())

@api.route('/posts/<int:id_post>', methods=['PUT', 'DELETE'])
def posts_id(id_post):
    post = Post.query.get_or_404(id_post)

    if request.method == 'PUT':
        if 'file' not in request.files:
            abort(Response("Missing file", 400))

        file = request.files['file']
        if file.filename == '':
            abort(Response("Empty filename", 400))

        Post.delete_file(post.filename)
        filename = Post.add_file(file)
        post.filename = filename
        db.session.commit()

        db.session.refresh(post)
        return jsonify(post.to_dict())

    db.session.delete(post)
    db.session.commit()
    return ('', 200)

@api.route('/posts/<int:id_post>/comments', methods=['POST'])
def posts_id_comments(id_post):
    # We could make it without this line, but this would assume that the post does exists
    post = Post.query.get_or_404(id_post)

    new_comment = Comment(related_post=post.id, timestamp_creation=datetime.now())
    db.session.add(new_comment)
    db.session.commit()

    db.session.refresh(new_comment) # To have the id of the newly created object
    return jsonify(new_comment.to_dict())

@api.route('/comments/<int:id_comment>', methods=['PUT', 'DELETE'])
def comments_id(id_comment):
    comment = Comment.query.get_or_404(id_comment)

    if request.method == 'PUT':
        comment.comment = request.json.get('link', comment.comment)
        db.session.commit()

        db.session.refresh(comment)
        return jsonify(comment.to_dict())

    db.session.delete(comment)
    db.session.commit()
    return ('', 200)
