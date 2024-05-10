from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load music data and similarities
music_dict = pickle.load(open('../musicrec.pkl', 'rb'))
music = pd.DataFrame(music_dict)
similarity = pickle.load(open('../similarities.pkl', 'rb'))

# Define the music recommendation logic
def recommend(selected_music_name):
    # Get recommendations
    music_index = music[music['title'] == selected_music_name].index[0]
    distances = similarity[music_index]
    music_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    recommended_music = [music.iloc[i[0]].title for i in music_list]
    
    return recommended_music

# Load music data and create a dictionary for autocomplete

@app.route('/autocomplete')
def autocomplete():
    query = request.args.get('query', '').lower()
    suggestions = [title for title in music['title'].values if query in title.lower()]
    return jsonify(suggestions)


@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    selected_music_name = data.get('music_title')
    if selected_music_name:
        recommendations = recommend(selected_music_name)
        return jsonify({'recommendations': recommendations})
    else:
        return jsonify({'error': 'Missing music_title parameter'})

if __name__ == '__main__':
    app.run(debug=True)
