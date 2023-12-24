from flask import Flask, render_template, request, Response
import pypandoc
import os
import re
from random import sample
import json
import requests
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

ALLOWED_FILE_TYPES = ['.doc', '.docx', '.odt', '.txt' ]

@app.route("/", methods=["GET", "POST"])
def start():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get('file')
    _, file_extension = os.path.splitext(file.filename)
    
    print(file, file_extension)
    
    if(is_valid_file(file_extension)):
        lines = convert_to_txt(file)
        print(lines)
        return ' '.join(map(str, lines)), 200
    else:
        return 'Invalid file type', 400
    
@app.route("/scan", methods=["POST"])
def scan():
    return 'True', 200
    scan_type = request.get_data().decode('utf-8')
    print(scan_type)
    selected_phrases = extract_phrases(scan_type)
    res = {'aggregateSimilarity': 0, 'results': []}
    agg_similarity_overall = 0
    
    # Make a Google search with each phrase
    for phrase in selected_phrases:
        url = 'https://google.com/search?start=0&q=' + phrase.strip()
        
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        links = soup.findAll("a")
        
        agg_similarity_link = 0
        highest_similarity = 0
        highest_similarity_link = ''
        counter = 0
        counter_end = 6
        if(scan_type == 'deep'):
            counter_end = 12
                
        for link in links:
            link_href = link.get('href')
            if "url?q=" in link_href and not "webcache" in link_href and counter < 5:
                counter+=1
                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')
                body = soup.find('body')
                text = body.get_text()
                
                # Convert the texts into TF-IDF vectors
                vectorizer = TfidfVectorizer()
                vectors = vectorizer.fit_transform([phrase, text])

                # Calculate the cosine similarity between the vectors
                similarity = cosine_similarity(vectors)
                
                if(similarity[0][1] > highest_similarity):
                    highest_similarity = similarity[0][1]
                    highest_similarity_link = link
                
                agg_similarity_link += similarity[0][1]
            
        agg_similarity_overall += float(agg_similarity_link / 5)
        print(agg_similarity_overall)
        res['results'].append({
            'similarity': float(agg_similarity_link / 5),
            'link': str(highest_similarity_link),
            'phrase': phrase,
        })    
        
    res['aggregateSimilarity'] = float(agg_similarity_overall / 5)          

    
    if(len(res) == 0):
        return 'Empty Result', 500
    
    return json.dumps(res), 200
    

# Helpers 
def is_valid_file(ext):
    return ext in ALLOWED_FILE_TYPES

def convert_to_txt(file):
    file.save('./' + file.filename)
    pypandoc.convert_file('./' + file.filename, 'plain', outputfile="output.txt")
    
    lines=[]
    with open('output.txt', encoding="utf8") as fp:  
        for line in fp.readlines():
            lines.append(line)
    return lines

def extract_phrases(scan_type):
    num = 6
    if(scan_type == 'deep'):
        num = 12
    phrases = []
    for i in range(num):
        with open('output.txt'.format(i)) as f:
            phrases += (re.findall(r".*?[\.\!\?]+", f.read()))

    return set(sample(phrases, k=num))
