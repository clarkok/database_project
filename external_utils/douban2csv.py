#!/usr/bin/python

import json
import sys
import requests
import re

if (len(sys.argv) < 2):
    print(
"""
Usage douban2csv.py <query>
Example:
    douban2csv.py 'search?q=computer'
""");
    exit(-1)

parsed_data = requests.get('http://api.douban.com/v2/book/' + sys.argv[1]).json();

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

