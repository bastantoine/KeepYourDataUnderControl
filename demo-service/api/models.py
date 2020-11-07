from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class SerializableModelMixin:

    def to_dict(self):
        """Small helper used to return the columns' names and values of the instance as a dict.

        The implementation is not efficient at all because it assumes that the values stored are
        either int or str, but it's sufficient enough for our usage here.
        """
        return {key: value for key, value in self.__dict__.items() if isinstance(value, (int, str))}


class Post(db.Model, SerializableModelMixin):
    id = db.Column(db.Integer, primary_key=True)
    # Note: db.String can take a length param used when creating the column in
    # the DB. In this case we are using SQLite which doesn't enforce any length (see
    # https://www.sqlite.org/faq.html#q9)
    link = db.Column(db.String())

    def to_dict(self, extended=False):
        """Overloaded version of the to_dict method where, if extended is passed to True, the dict
        version of the model will include a new key 'comments' as a list of to_dict versions of the
        comments of this post.

        See the API specs to know in which case we would need to do this:
        https://github.com/bastantoine/KeepYourDataUnderControl/blob/main/SPECS/API.md#get-posts
        """
        self_to_dict = super().to_dict()
        if extended:
            self_to_dict['comments'] = [comment.to_dict(reduced=True) for comment in Comment.get_comments_of_post(self.id)]
        return self_to_dict


class Comment(db.Model, SerializableModelMixin):
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.String())
    related_post = db.Column(db.ForeignKey('post.id', ondelete="CASCADE"), nullable=False)

    @staticmethod
    def get_comments_of_post(id_post):
        """Class method that returns all comments linked to a given post identified by its id passed
        in parameter
        """
        return Comment.query.filter_by(related_post=id_post)

    def to_dict(self, reduced=False):
        """Overloaded version of the to_dict method where, if reduced is passed to True, the dict
        version of the model won't include the if the related post.

        See the API specs to know in which case we would need to do this:
        https://github.com/bastantoine/KeepYourDataUnderControl/blob/main/SPECS/API.md#get-posts
        """
        self_to_dict = super().to_dict()
        if reduced:
            self_to_dict.pop("related_post")
        return self_to_dict