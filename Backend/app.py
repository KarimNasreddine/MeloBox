import datetime

from flask import Flask, abort, jsonify, request
from flask_sqlalchemy import SQLAlchemy

from flask_sqlalchemy import SQLAlchemy
from flask import request, json
from flask import jsonify
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask import abort
from flask_cors import  CORS
from sqlalchemy import text
import jwt
from flask import session

SECRET_KEY = "b'|\xe7\xbfU3`\xc4\xec\xa7\xa9zf:}\xb5\xc7\xb9\x139^3@Dv'"
# create Flask app
app = Flask(__name__)
app.secret_key = SECRET_KEY





CORS(app)





app.config[
    'SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@127.0.0.1:8889/music_streaming'


# create SQLAlchemy instance

db = SQLAlchemy(app)

ma = Marshmallow(app)

bcrypt = Bcrypt(app)


app.app_context().push()
from app import app, db
# create models
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    subscription_status = db.Column(db.Boolean, nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)


class Playlist(db.Model):
    playlist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)

class Track(db.Model):
    track_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    album_id = db.Column(db.Integer, db.ForeignKey('album.album_id'), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.genre_id'), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artist.artist_id'), nullable=False)

class Album(db.Model):
    album_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artist.artist_id'), nullable=False)

class Genre(db.Model):
    genre_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)

class TrackPlaylist(db.Model):
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlist.playlist_id'), nullable=False,primary_key=True)
    track_id = db.Column(db.Integer, db.ForeignKey('track.track_id'), nullable=False, primary_key=True)

class Artist(db.Model):
    artist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    popularity_score = db.Column(db.Integer, nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.genre_id'), nullable=False)


@app.route('/users', methods=['GET'])
def get_users():
    
    if User.is_admin:
        users = User.query.all()
        return jsonify([{'user_id': user.user_id, 'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email,
                        'subscription_status': user.subscription_status, 'is_admin': user.is_admin} for user in users])
    else:
        return jsonify({'error': 'Only admins can view users list'}), 403
# API to get a user by user_id
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.filter_by(user_id=user_id).first()
    if user:
        return jsonify({'user_id': user.user_id, 'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email,
                     'subscription_status': user.subscription_status, 'is_admin': user.is_admin})
    else:
        return jsonify({'message': 'User not found'}), 404

# API to create a new user
@app.route('/users/create', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(first_name=data['first_name'], last_name=data['last_name'], email=data['email'], password=data['password'],
                    subscription_status=data['subscription_status'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created', 'user_id': new_user.user_id}), 201

# API to update an existing user
@app.route('/users/edit/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.filter_by(user_id=user_id).first()
    if user:
        data = request.get_json()
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.email = data['email']
        user.password = data['password']
        user.subscription_status = data['subscription_status']
        user.is_admin = data['is_admin']
        db.session.commit()
        return jsonify({'message': 'User updated'})
    else:
        return jsonify({'message': 'User not found'}), 404

# API to delete a user
@app.route('/users/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.filter_by(user_id=user_id).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted'})
    else:
        return jsonify({'message': 'User not found'}), 404
    
    
@app.route('/authenticate', methods=['POST'])
def authenticate():
        
        email = request.json['email']
        password = request.json['password']
        
        if not email or not password:
            abort(400)
            
        user = User.query.filter_by(email=email).first()
        
        if not user:
            abort(403)
            
        if user and user.password == password:
            return jsonify({'token': create_token(user.user_id)})
            
        else:
            abort(403)

# Check if token is valid
@app.route('/token', methods=['POST'])
def check_token():
    token = extract_auth_token(request)
    if token:
        try:
            user_id = decode_token(token)
            return jsonify({'message': 'Token is valid'}), 200
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
    else:
        return jsonify({'message': 'Token is missing'}), 401

            
def create_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=4),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
        }
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm='HS256'
    )
    
def extract_auth_token(authenticated_request):
    auth_header = authenticated_request.headers.get('Authorization')
    if auth_header:
        return auth_header.split(" ")[1]
    else:
        return None
    
def decode_token(token):
    payload = jwt.decode(token, SECRET_KEY, 'HS256')
    return payload['sub']
 

@app.route('/alltracks')
def all_tracks():
    
        
    tracks = Track.query.all()
    
    serialized_tracks = []
    
    for t in tracks:
        serialized_tracks.append({
            'track_id': t.track_id,
            'title': t.title,
            'duration': t.duration,
            'album_id':t.album_id,
            'genre_id':t.genre_id,
            'artist_id':t.artist_id
        })
        
    return jsonify(serialized_tracks), 200
 
#get all tracks
@app.route('/tracks')
def get_all_tracks():
    conn = db.engine.connect()
    # Execute a SELECT query on the track_view table and fetch all records
    tracks = conn.execute(text('SELECT * FROM track_view')).fetchall()
    conn.close()
    serialized_tracks=[]

    for track in tracks:
        serialized_tracks.append({
        "track_id" : track[0],
        "title" : track[1],
        "duration" : track[2],
        "album" : track[3],
        "genre" : track[4],
        "artist" : track[5]
        })
        
    return jsonify(serialized_tracks),200

# get a single track by id
@app.route('/tracks/<int:track_id>')
def get_track(track_id):
    track = Track.query.get_or_404(track_id)
    track_data = {}
    track_data['track_id'] = track.track_id
    track_data['title'] = track.title
    track_data['duration'] = track.duration
    track_data['album_id'] = track.album_id
    track_data['genre_id'] = track.genre_id
    track_data['artist_id'] = track.artist_id
    return jsonify(track_data)

@app.route('/tracks/create', methods=['POST'])
def add_track():
    if not request.is_json:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # check if user is an admin
    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # check if user is an admin
    user = User.query.filter_by(user_id=user_id).first()
    if not user.is_admin:
        return jsonify({'error': 'Only admins can add tracks'}), 403

    # get track data from JSON request
    title = request.json.get('title')
    duration = request.json.get('duration')
    album_id = request.json.get('album_id')
    genre_id = request.json.get('genre_id')
    artist_id = request.json.get('artist_id')

    # create new track instance
    new_track = Track(title=title, duration=duration, album_id=album_id, genre_id=genre_id, artist_id=artist_id)

    # add new track to database
    db.session.add(new_track)
    db.session.commit()

    return jsonify({'message': 'Track added successfully', 'track_id': new_track.track_id}), 201



@app.route('/tracks/edit/<int:track_id>', methods=['PUT'])
# update an existing track with admin privileges
def update_track(track_id):
    if not request.is_json:
        return jsonify({'error': 'Invalid JSON format'}), 400

    #check if user is an admin
    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # check if user is an admin
    user = User.query.filter_by(user_id=user_id).first()
    if not user.is_admin:
        return jsonify({'error': 'Only admins can add tracks'}), 403
    # get track to update
    track = Track.query.get_or_404(track_id)

    # update track data from JSON request
    title = request.json.get('title', track.title)
    duration = request.json.get('duration', track.duration)
    album_id = request.json.get('album_id', track.album_id)
    genre_id = request.json.get('genre_id', track.genre_id)
    artist_id = request.json.get('artist_id', track.artist_id)

    # update track instance
    track.title = title
    track.duration = duration
    track.album_id = album_id
    track.genre_id = genre_id
    track.artist_id = artist_id

    # commit changes to database
    db.session.commit()

    return jsonify({'message': 'Track updated successfully'}), 200

# delete an existing track with admin privileges
@app.route('/tracks/delete/<int:track_id>', methods=['DELETE'])
def delete_track(track_id):
    # check if user is an admin
    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # get track to delete
    track = Track.query.get_or_404(track_id)

    # delete track from database
    db.session.delete(track)
    db.session.commit()

    return jsonify({'message': 'Track deleted successfully'}), 200 
 
#API to create a playlist
@app.route('/playlists/create', methods=['POST'])
def create_playlist():
    data = request.get_json()
    
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
            new_playlist = Playlist(name=data['name'], description=data['description'], user_id=user_id)
    db.session.add(new_playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist created successfully!'})


# API route for editing a playlist
@app.route('/playlists/edit/<int:playlist_id>', methods=['PUT'])
def edit_playlist(playlist_id):
    playlist = Playlist.query.get_or_404(playlist_id)
    data = request.get_json()
    
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)) == playlist.user_id:
            playlist.name = data.get('name', playlist.name)
            playlist.description = data.get('description', playlist.description)
            db.session.commit()
            return jsonify({'message': 'Playlist updated successfully!'})
        else:
            return jsonify({'error': 'Unauthorized access!'})
    else:
        return jsonify({'error': 'No authorization token provided!'})

# API route for deleting a playlist
@app.route('/playlists/delete/<int:playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    playlist = Playlist.query.get_or_404(playlist_id)
    
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)) == playlist.user_id:
            db.session.delete(playlist)
            db.session.commit()
            return jsonify({'message': 'Playlist deleted successfully!'})
        else:
            return jsonify({'error': 'Unauthorized access!'})
    else:
        return jsonify({'error': 'No authorization token provided!'})



#add track to playlist
@app.route('/playlists/add_track', methods=['POST'])
def add_track_to_playlist():
    # Retrieve request parameters
    playlist_id = request.json['playlist_id']
    track_id = request.json['track_id']
    

    
    # Check if playlist exists
    playlist = Playlist.query.filter_by(playlist_id=playlist_id).first()
    
    if not playlist:
        return jsonify({'message': 'Playlist not found'}), 404
    
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
            if playlist.user_id != user_id:
                return jsonify({'message': 'You are not authorized to add tracks to this playlist'}), 401
    
    # Check if track exists
    track = Track.query.filter_by(track_id=track_id).first()
    if not track:
        return jsonify({'message': 'Track not found'}), 404
    
    # Check if track is already in the playlist
    if TrackPlaylist.query.filter_by(playlist_id=playlist_id, track_id=track_id).first():
        return jsonify({'message': 'Track already in playlist'}), 400
    
    # Add track to playlist
    track_playlist = TrackPlaylist(playlist_id=playlist_id, track_id=track_id)
    db.session.add(track_playlist)
    db.session.commit()
    
    return jsonify({'message': 'Track added to playlist successfully'}), 200


#remove track from playlist
@app.route('/playlists/remove_track', methods=['DELETE'])
def remove_track_from_playlist():
    # Retrieve request parameters
    playlist_id = request.json['playlist_id']
    track_id = request.json['track_id']

    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
    
    # Check if playlist exists
    playlist = Playlist.query.filter_by(playlist_id=playlist_id).first()
    if not playlist:
        return jsonify({'message': 'Playlist not found'}), 404
    
    # Check if track exists in playlist
    track_playlist = TrackPlaylist.query.filter_by(playlist_id=playlist_id, track_id=track_id).first()
    if not track_playlist:
        return jsonify({'message': 'Track not found in playlist'}), 404

    # Check if user is authorized to remove track from playlist
    if playlist.user_id != user_id:
        return jsonify({'message': 'You are not authorized to remove tracks from this playlist'}), 401

    # Remove track from playlist
    db.session.delete(track_playlist)
    db.session.commit()

    return jsonify({'message': 'Track removed from playlist successfully'}), 200


@app.route('/playlist/tracks', methods=['GET'])
def get_user_playlists():
    if extract_auth_token(request):
        user_id = decode_token(extract_auth_token(request))
        playlists = Playlist.query.filter_by(user_id=user_id).all()

        # Execute a SELECT query on the playlist_view and fetch all records
        conn = db.engine.connect()
        playlist_tracks = conn.execute(text('SELECT * FROM playlist_view')).fetchall()
        conn.close()

        # Convert the result set into a list of dictionaries for the requested user
        serialized_playlists = []
        for playlist in playlist_tracks:
            if playlist[0] in [p.playlist_id for p in playlists]:
                serialized_playlists.append({
                    'playlist_id': playlist[0],
                    'playlist_name':playlist[1],
                    'track_title': playlist[2],
                    'duration': playlist[3],
                    'album_name': playlist[4],
                    'artist_name': playlist[5],
                    'genre_name': playlist[6]
                })

        # Return the serialized list of playlists in JSON format
        return jsonify(serialized_playlists)
    else:
        return jsonify({'message': 'Unauthorized access'}), 401


@app.route('/playlists/<int:user_id>', methods=['GET'])
def get_playlists(user_id=None):
    if user_id is None:
        playlists = Playlist.query.all()
    else:
        playlists = Playlist.query.filter_by(user_id=user_id).all()

    serialized_playlists = []
    for playlist in playlists:
        serialized_playlists.append({
            'playlist_id': playlist.playlist_id,
            'name': playlist.name,
            'description': playlist.description,
            'user_id': playlist.user_id
        })

    return jsonify(serialized_playlists)



#add artist
@app.route('/artists/create', methods=['POST'])
def add_artist():
    if not request.is_json:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # check if user is an admin
    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # check if user is an admin
    user = User.query.filter_by(user_id=user_id).first()
    if not user.is_admin:
        return jsonify({'error': 'Only admins can add tracks'}), 403
    # get artist data from JSON request
    name = request.json.get('name')
    popularity_score = request.json.get('popularity_score')
    genre_id = request.json.get('genre_id')

    # create new artist instance
    new_artist = Artist(name=name, popularity_score=popularity_score, genre_id = genre_id)

    # add new artist to database
    db.session.add(new_artist)
    db.session.commit()

    return jsonify({'message': 'Artist added successfully', 'artist_id': new_artist.artist_id}), 201

@app.route('/artists/<int:artist_id>', methods=['PUT'])
def edit_artist(artist_id):
    # check if request is in JSON format
    if not request.is_json:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # check if user is an admin
    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # check if user is an admin
    user = User.query.filter_by(user_id=user_id).first()
    if not user.is_admin:
        return jsonify({'error': 'Only admins can edit artists'}), 403
    
    # get the artist to edit
    artist = Artist.query.filter_by(artist_id=artist_id).first()
    if not artist:
        return jsonify({'error': 'Artist not found'}), 404

    # update artist data
    artist.name = request.json.get('name', artist.name)
    artist.popularity_score = request.json.get('popularity_score', artist.popularity_score)
    artist.genre_id = request.json.get('genre_id',artist.genre_id)

    # commit changes to database
    db.session.commit()

    return jsonify({'message': 'Artist updated successfully'}), 200


@app.route('/artists/<int:artist_id>', methods=['DELETE'])
def delete_artist(artist_id):

    # check if user is an admin
    if not request.is_json:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # check if user is an admin
    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # check if user is an admin
    user = User.query.filter_by(user_id=user_id).first()
    if not user.is_admin:
        return jsonify({'error': 'Only admins can delete artists'}), 403

    # get the artist to delete
    artist = Artist.query.filter_by(artist_id=artist_id).first()
    if not artist:
        return jsonify({'error': 'Artist not found'}), 404

    # delete the artist from the database
    db.session.delete(artist)
    db.session.commit()

    return jsonify({'message': 'Artist deleted successfully'}), 200

@app.route('/allartists', methods= ['GET'])
def get_all_art():
    
    artists = Artist.query.all()
    
    serialized_artists = []
    
    for art in artists:
        serialized_artists.append({
            'artist_id': art.artist_id,
            'name': art.name,
            'popularity_score': art.popularity_score,
            'genre_id':art.genre_id
        })
        
    return jsonify(serialized_artists), 200

#display all artists
@app.route('/artists', methods=['GET'])
def get_all_artists():
    conn = db.engine.connect()
    # Execute a SELECT query on the artist_view and fetch all records
    artists = conn.execute(text('SELECT * FROM artist_view')).fetchall()
    conn.close()

    serialized_artists = []
    for artist in artists:
        serialized_artists.append({
            "artist_id" : artist[0],
            "artist_name" : artist[1],
            "popularity_score" : artist[2],
            "genre_id" : artist[3]
        })
    

    # return the list of artists as JSON
    return jsonify(serialized_artists),200

# Add a new genre
@app.route('/genres/create', methods=['POST'])
def add_genre():
    # Check if request is in JSON format
    if not request.is_json:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # check if user is an admin
    auth_token = extract_auth_token(request)
    print(auth_token)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # check if user is an admin
    user = User.query.filter_by(user_id=user_id).first()
    if not user.is_admin:
        return jsonify({'error': 'Only admins can delete artists'}), 403

    # Get genre data from JSON request
    name = request.json.get('name')
    description = request.json.get('description')

    # Create new genre instance
    new_genre = Genre(name=name, description=description)

    # Add new genre to database
    db.session.add(new_genre)
    db.session.commit()

    return jsonify({'message': 'Genre added successfully', 'genre_id': new_genre.genre_id}), 201


# Edit an existing genre
@app.route('/genres/<int:genre_id>', methods=['PUT'])
def edit_genre(genre_id):
    # Check if request is in JSON format
    if not request.is_json:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # check if user is an admin
    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # check if user is an admin
    user = User.query.filter_by(user_id=user_id).first()
    if not user.is_admin:
        return jsonify({'error': 'Only admins can delete artists'}), 403

    # Get the genre to edit
    genre = Genre.query.filter_by(genre_id=genre_id).first()
    if not genre:
        return jsonify({'error': 'Genre not found'}), 404

    # Update genre data
    genre.name = request.json.get('name', genre.name)
    genre.description = request.json.get('description', genre.description)

    # Commit changes to database
    db.session.commit()

    return jsonify({'message': 'Genre updated successfully'}), 200


# Delete an existing genre
@app.route('/genres/<int:genre_id>', methods=['DELETE'])
def delete_genre(genre_id):
    # Check if user is an admin

    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    
    user = User.query.filter_by(user_id=user_id).first()
    if not user.is_admin:
        return jsonify({'error': 'Only admins can delete artists'}), 403
    # Get the genre to delete
    genre = Genre.query.filter_by(genre_id=genre_id).first()
    if not genre:
        return jsonify({'error': 'Genre not found'}), 404

    # Delete the genre from the database
    db.session.delete(genre)
    db.session.commit()

    return jsonify({'message': 'Genre deleted successfully'}), 200


# # Display all genres
@app.route('/genres', methods=['GET'])
def get_all_genres():

    conn = db.engine.connect()
    # Execute a SELECT query on the genre_view and fetch all records
    genres = conn.execute(text('SELECT * FROM genre_view')).fetchall()
    conn.close()

    print(genres)
 
    # Serialize the genres data
    serialized_genres = []
    for genre in genres:
        serialized_genres.append({
            'genre_id': genre[0],
            'genre': genre[1],
            'description': genre[2],
            'artist_name' : genre[3]
        })

    return jsonify(serialized_genres), 200


@app.route('/allgenres', methods=['GET'])
def getall_genres():
    
    genres = Genre.query.all()
    
    serialized_genres = []
    
    for genre in genres:
        serialized_genres.append({
            'genre_id': genre.genre_id,
            'genre': genre.name,
            'description': genre.description
        })
        
    return jsonify(serialized_genres), 200

#add new album
@app.route('/albums/create', methods=['POST'])
def add_album():
    # Check if request is in JSON format
    if not request.is_json:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # check if user is an admin
    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # Get album data from JSON request
    name = request.json.get('name')
    release_date = request.json.get('release_date')
    artist_id = request.json.get('artist_id')

    # Create new album instance
    new_album = Album(name=name, release_date=release_date, artist_id=artist_id)

    # Add new album to database
    db.session.add(new_album)
    db.session.commit()

    return jsonify({'message': 'Album added successfully', 'album_id': new_album.album_id}), 201


#edit album
@app.route('/albums/<int:album_id>', methods=['PUT'])
def edit_album(album_id):
    # Check if request is in JSON format
    if not request.is_json:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # check if user is an admin
    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    # Get the album to edit
    album = Album.query.filter_by(album_id=album_id).first()
    if not album:
        return jsonify({'error': 'Album not found'}), 404

    # Update album data
    album.name = request.json.get('name', album.name)
    album.release_date = request.json.get('release_date', album.release_date)
    album.artist_id = request.json.get('artist_id', album.artist_id)

    # Commit changes to database
    db.session.commit()

    return jsonify({'message': 'Album updated successfully'}), 200

#delete album
@app.route('/albums/<int:album_id>', methods=['DELETE'])
def delete_album(album_id):
    # Check if user is an admin

    auth_token = extract_auth_token(request)
    if not auth_token:
        return jsonify({'error': 'Authorization header is missing'}), 401
    if extract_auth_token(request):
        if decode_token(extract_auth_token(request)):
            user_id = decode_token(extract_auth_token(request))
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

    
    user = User.query.filter_by(user_id=user_id).first()
    if not user.is_admin:
        return jsonify({'error': 'Only admins can delete albums'}), 403
    # Get the album to delete
    album = Album.query.filter_by(album_id=album_id).first()
    if not album:
        return jsonify({'error': 'Album not found'}), 404

    # Delete the album from the database
    db.session.delete(album)
    db.session.commit()

    return jsonify({'message': 'Album deleted successfully'}), 200


@app.route('/allalbums',methods=['GET'])
def get_albums():
    
    albums = Album.query.all()
    
    serialized_albums = []
    
    for a in albums:
        serialized_albums.append({
            'album_id': a.album_id,
            'name': a.name,
            'release_date': a.release_date,
            'artist_id':a.artist_id
        })
        
    return jsonify(serialized_albums), 200

#get all albums
@app.route('/albums', methods=['GET'])
def get_all_albums():
    conn = db.engine.connect()
    # Execute a SELECT query on the album_view and fetch all records
    albums = conn.execute(text('SELECT * FROM album_view')).fetchall()
    conn.close()

    # Convert the result set into a list of dictionaries
    serialized_albums = []
    for album in albums:
        serialized_albums.append({
            'album_id': album[0],
            'album_name': album[1],
            'release_date': album[2].strftime('%Y-%m-%d'),
            'artist_name': album[3]
        })

    # Return the serialized list of albums in JSON format
    return jsonify(serialized_albums)




