import json
import executor_utils as eu
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/execution', methods=['POST'])
def execute():
  data = request.get_json()
  if 'code' not in data or 'lang' not in data:
    return 'invalid request'

  sessionId = None
  if 'sessionId' in data:
    sessionId = data['sessionId']

  code = data['code']
  lang = data['lang']
  print ('app', sessionId, code, lang)
  result = eu.execute(code, lang)

  return jsonify(result)

if __name__ == '__main__':
  eu.load_image()
  app.run(host='0.0.0.0', debug=True);
