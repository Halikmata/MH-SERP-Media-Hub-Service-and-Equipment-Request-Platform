from app import app
from utils import print_collections

if __name__ == "__main__":
    print_collections() # debugger
    app.run(debug=True,host="127.0.0.1")