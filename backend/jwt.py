import jwt
from flask import jsonify, request
from functools import wraps # related to jwt
from __init__ import app

def check_token(f):
    @wraps(f)
    def get_header_token(*args, **kwargs):
        token = request.headers.get('token-access')
      
        if not token:
            return jsonify({"message":"Authorization denied"}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY']) # refer to flask jwt documentation.
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message":"Expired session"}), 401
        
        except jwt.InvalidTokenError:
            return jsonify({"message":"Invalid session"}), 401

        return f(*args, **kwargs)

    return get_header_token