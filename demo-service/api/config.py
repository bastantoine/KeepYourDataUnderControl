import os

from dotenv import load_dotenv

load_dotenv()

UPLOAD_FOLDER = os.environ.get("API_UPLOAD_FOLDER", "./")
