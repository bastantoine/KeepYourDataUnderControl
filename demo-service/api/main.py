import os

from flask import Flask
from flask_cors import CORS

import config
from views import api

def create_app():
    from models import db

    app = Flask(__name__)

    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = config.UPLOAD_FOLDER
    db.init_app(app)
    with app.app_context():
        # Create all tables if needed. This doesn't work when updating the fields of a models, in
        # this case either make the ALTER TABLE by hand or delete the .db file
        db.create_all()

    # Allow CORS on all domains and for all routes. Definitively not the most secure, but by far the easiest
    # See https://flask-cors.readthedocs.io/en/latest/#simple-usage
    CORS(app)

    app.register_blueprint(api)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run()
