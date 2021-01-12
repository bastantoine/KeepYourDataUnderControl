import os

from dotenv import load_dotenv

load_dotenv()

UPLOAD_FOLDER = os.environ.get("API_UPLOAD_FOLDER", "./")
ROOT_PATH = os.environ.get("API_ROOT_PATH", "./")
