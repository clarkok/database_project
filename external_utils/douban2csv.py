#!/usr/local/bin/python3

import json
import sys
import requests
import re

if (len(sys.argv) < 2):
    keyword = input('Please input a keyword to search from Douban: ');
else:
    keyword = sys.argv[1];

parsed_data = requests.get('http://api.douban.com/v2/book/search?q=' + keyword).json();

def parseInt(s):
    parse = re.search(r"[0-9\.]+", s);
    if parse is not None:
        return parse.group(0)
    return ""

for book in parsed_data['books']:
    if len(book['tags']) == 0:
        book['tags'].append({'name': 'Uncategoried'})
    if len(book['author']) == 0:
        book['author'].append("Unknown")
    print(
        '"' + book['tags'][0]['name'] + '"' + ';' +\
        '"' + book['title'] + '"' + ';' +\
        '"' + book['image'] + '"' + ';' +\
        '"' + book['publisher'] + '"' + ';' +\
        '"' + parseInt(book['pubdate']) + '"' + ';' +\
        '"' + book['author'][0] + '"' + ';' +\
        '"' + parseInt(book['price']) + '"' + ';' +\
        '"100";"80"'
        )

