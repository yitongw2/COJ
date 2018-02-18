import json
from flask import Flask, jsonify, request
import executor_utils as eu

app = Flask(__name__)

@app.route('/build_and_run', methods=['POST'])
def build_and_run():
    data = request.get_json()
    if 'code' not in data or 'lang' not in data:
        return 'You should provide "code" and "lang"'
    
    code = data['code']
    lang = data['lang']

    print("API got called with code: %s in %s" % (code, lang))

    result = eu.build_and_run(code, lang)

    return jsonify(result)

if __name__ == '__main__':
    eu.load_image()
    app.run(debug=True)
