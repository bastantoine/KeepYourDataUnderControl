import os
import uuid

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from werkzeug.utils import secure_filename

import config


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
    filename = db.Column(db.String())
    timestamp_creation = db.Column(db.DateTime())

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

    @staticmethod
    def add_file(file):
        filename = secure_filename(file.filename)
        if os.path.isfile(os.path.join(config.UPLOAD_FOLDER, filename)):
            extension = ""
            if filename.find(".") != -1:
                filename, extension = filename.rsplit(".")
                extension = "." + extension
            filename = filename + "_" + str(uuid.uuid4()) + extension

        file.save(os.path.join(config.UPLOAD_FOLDER, filename))
        return filename

    @staticmethod
    def delete_file(filename):
        os.remove(os.path.join(config.UPLOAD_FOLDER, filename))


# Register an event handler to automatically delete the file of a post upon its deletion
# See https://docs.sqlalchemy.org/en/13/orm/events.html#sqlalchemy.orm.events.MapperEvents.before_delete
@event.listens_for(Post, 'before_delete')
def receive_before_delete(mapper, connection, target):
    Post.delete_file(target.filename)


class Comment(db.Model, SerializableModelMixin):
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.String())
    related_post = db.Column(db.ForeignKey('post.id', ondelete="CASCADE"), nullable=False)
    timestamp_creation = db.Column(db.DateTime())

    @staticmethod
    def get_comments_of_post(id_post):
        """Class method that returns all comments linked to a given post identified by its id passed
        in parameter
        """
        return Comment.query.filter_by(related_post=id_post).order_by(Comment.timestamp_creation.desc())

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