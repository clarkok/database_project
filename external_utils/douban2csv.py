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

conn = http.client.HTTPConnection('api.douban.com')
conn.request('GET', '/v2/book/' + sys.argv[1])
res = conn.getresponse()
print(res.status)
data = res.read()

parsed_data = json.loads(data.decode(encoding='UTF-8'))

for book in parsed_data['books']:
    if len(book['tags']) == 0:
        book['tags'].append({'name': 'Uncategoried'})
    print(book['id'] + ';' +\
        book['tags'][0]['name'] + ';' +\
        book['title'] + ';' +\
        book['publisher'] + ';' +\
        (''.join([x for x in book['pubdate'] if x.isdigit()])) + ';' +\
        book['author'][0] + ';' +\
        (''.join([x for x in book['price'] if x.isdigit()])) + ';' +\
        '100;80'
        )

