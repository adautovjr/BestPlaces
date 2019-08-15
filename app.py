from flask import Flask, render_template, request, redirect, make_response
from flask import url_for, flash, jsonify, Response, session as login_session
from flask_cors import CORS, cross_origin
from models import Base, Checkpoint
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.inspection import inspect
from sqlalchemy import create_engine
import random
import string
from six.moves.urllib.parse import urlencode
from functools import wraps
import os.path

engine = create_engine('postgresql://'+os.getenv('user') +
                       ':'+os.getenv('password')+'@localhost:5432/bestplaces')

Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

app = Flask(__name__)

cors = CORS(app, resources={r"/": {"origins": "*"}})

app.config['CORS_HEADERS'] = 'Content-Type'


# Checkpoints Controllers
@app.route('/checkpoints/json')
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def viewCheckpointsJson():
    try:
        if 'profile' in login_session:
            user = login_session['profile']
        else:
            user = False
    
        checkpoints = session.query(Checkpoint).all()
    
        return make_response(
            jsonify(
                {
                    'checkpoints': [checkpoint.serialize for checkpoint in checkpoints],
                    'user': user
                }
            ), 200
        )
    except Exception:
        return make_response(
            jsonify(
                {
                    "message": "Bad request!" 
                }
            ), 400
        )

@app.route('/checkpoints/create', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def createCheckpoint():
    if request.method == 'POST':
        try:
            entry = request.get_json(force=True)
        
            newEntry = Checkpoint(
                name=entry["place"]['name'],
                coordinates=entry["place"]['position'],
                address=entry["place"]['address'],
                description=entry["place"]['description'],
                user_id=1
            )
            session.add(newEntry)
            session.flush()
            entry['place']['id'] = newEntry.id
            session.commit()

            return make_response(
                jsonify(
                    entry
                ), 201
            )
        except Exception:
            return make_response(
                jsonify(
                    {
                        "message": "Bad request!" 
                    }
                ), 400
            )
            pass
    else:
        return make_response(
            jsonify(
                {
                    'message': 'Method not Allowed'
                }
            ), 405
        )


@app.route('/checkpoints/delete', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def deleteCheckpoint():
    if request.method == 'POST':
        try:
            entry = request.get_json(force=True)
        
            checkpoint = session.query(Checkpoint).filter_by(id=entry['id']).one()

            session.delete(checkpoint)
            session.commit()

            return make_response(
                jsonify(
                    {
                        "message": "Successfully deleted!" 
                    }
                ), 200
            )
        except Exception as error:
            return make_response(
                jsonify(
                    {
                        "message": "Bad request!",
                        "error": str(error)
                    }
                ), 400
            )
            pass
    else:
        return make_response(
            jsonify(
                {
                    'message': 'Method not Allowed'
                }
            ), 405
        )


if __name__ == '__main__':
    app.debug = True
    app.secret_key = 'UX4Z2NPLR37OIG8PREXCQUKPKA59HQXY'
    app.run(host='0.0.0.0', port=5000)
