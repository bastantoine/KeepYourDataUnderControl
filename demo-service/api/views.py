from flask import (
    Blueprint,
    jsonify,
    request,
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

@api.route('/posts/<int:id_post>/comments', methods=['POST'])
def posts_id_comments(id_post):
    # We could make it without this line, but this would assume that the post does exists
    post = Post.query.get_or_404(id_post)

    new_comment = Comment(related_post=post.id, **request.json)
    db.session.add(new_comment)
    db.session.commit()

    db.session.refresh(new_comment) # To have the id of the newly created object
    return jsonify(new_comment.to_dict())

@api.route('/comments/<int:id_comment>', methods=['PUT', 'DELETE'])
def comments_id(id_comment):
    comment = Comment.query.get_or_404(id_comment)

    if request.method == 'PUT':
        comment.link = request.json.get('link', comment.link)
        db.session.commit()

        db.session.refresh(comment)
        return jsonify(comment.to_dict())

    db.session.delete(comment)
    db.session.commit()
    return ('', 200)
