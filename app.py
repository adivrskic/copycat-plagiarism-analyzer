from flask import Flask, render_template, request
import pypandoc
import os

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