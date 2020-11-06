from main import db


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Note: db.String can take a length param used when creating the column in
    # the DB. In this case we are using SQLite which doesn't enforce any length (see
    # https://www.sqlite.org/faq.html#q9)
    link = db.Column(db.String())


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.String())
    related_post = db.Column(db.ForeignKey('post.id', ondelete="CASCADE"), nullable=False)
