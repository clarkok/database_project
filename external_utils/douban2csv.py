#!/usr/bin/python

import json
import sys
import requests

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
    ret = ''
    for x in s:
        if x.isdigit():
            ret += x
        else:
            break
    return (ret)

for book in parsed_data['books']:
    if len(book['tags']) == 0:
        book['tags'].append({'name': 'Uncategoried'})
    print('"' + book['id'] + '";' +\
        '"' + book['tags'][0]['name'] + '"' + ';' +\
        '"' + book['title'] + '"' + ';' +\
        '"' + book['image'] + '"' + ';' +\
        '"' + book['publisher'] + '"' + ';' +\
        '"' + parseInt(book['pubdate']) + '"' + ';' +\
        '"' + book['author'][0] + '"' + ';' +\
        '"' + parseInt(book['price']) + '"' + ';' +\
        '"100";"80"'
        )

