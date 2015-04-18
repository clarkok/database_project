#!/usr/bin/python

import json
import http.client
import sys

if (len(sys.argv) < 2):
    print(
"""
Usage douban2csv.py <query>
Example:
    douban2csv.py 'search?q=computer'
""");
    exit(-1)

conn = http.client.HTTPConnection('api.douban.com')
conn.request('GET', '/v2/book/' + sys.argv[1])
res = conn.getresponse()
data = res.read()

def parseInt(s):
    ret = ''
    for x in s:
        if x.isdigit():
            ret += x
        else:
            break
    return (ret)

parsed_data = json.loads(data.decode(encoding='UTF-8'))

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

