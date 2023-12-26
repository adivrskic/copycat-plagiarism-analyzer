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
        
    if(is_valid_file(file_extension)):
        lines = convert_to_txt(file)
        return ' '.join(map(str, lines)), 200
    else:
        return 'Invalid file type', 400
    
@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json()
    selected_phrases = extract_phrases(data['val'], data['type'])
    
    res = {'aggregateSimilarity': 0, 'results': []}
    agg_similarity_overall = 0
    
    for phrase in selected_phrases:
        print(phrase)
    
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
        divisor = 1
                
        if(data['type'] == 'deep'):
            counter_end = 10
                
        for link in links:
            link_href = link.get('href')
            if "url?q=" in link_href and not "webcache" in link_href and not "maps" in link_href and not 'support.google.com' in link_href and not 'search' in link_href and counter < counter_end:
                counter+=1
                divisor+=1
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
                    highest_similarity_link = link_href.split('url?q=')[1].split('&sa=')[0]
                
                agg_similarity_link += similarity[0][1]
            
        agg_similarity_overall += float(agg_similarity_link / divisor)
                
        res['results'].append({
            'similarity': float(agg_similarity_link / divisor),
            'link': str(highest_similarity_link),
            'phrase': phrase.strip(),
        })   
        
    res['aggregateSimilarity'] = float(agg_similarity_overall / len(res['results']))          

    if(len(res['results']) == 0 or res['aggregateSimilarity'] == 0):
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

def extract_phrases(val, type):
    num = 6
    if(type == 'deep'):
        num = 10
    phrases = []
    for i in range(num):
        with open('output.txt'.strip().format(i)) as f:
            regex = "(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s"
            phrases = re.split(regex, val)
            
    print(set(sample(phrases, k=num)))
    return set(sample(phrases, k=num))
