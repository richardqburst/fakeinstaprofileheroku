#curl -X POST -H "Content-Type: application/json" http://127.0.0.1:5000//predict -d @data.json 

import pickle,json
import numpy as np
from flask import Flask, request, render_template
from flask_cors import CORS
import time

model = None
scale = None
app = Flask(__name__)
CORS(app)


def load_model():
    global model
    # model variable refers to the global variable
    with open('trainedModel.sav', 'rb') as f:
        model = pickle.load(f)


def load_scale():
    global scale
    # model variable refers to the global variable
    with open('scale.sav', 'rb') as g:
    	scale = pickle.load(g)

@app.route('/')
def home_endpoint():
    return render_template('index.html')
    #return ("hi")

@app.route('/trainmodel')
def home_endpoint2():
    

@app.route('/predict', methods=['POST'])
def get_prediction():
    # Works only for a single sample
    if request.method == 'POST':
        data=request.get_json() 
        #data = request.args.get('pic')
        #s = json.dumps(request.data)
        print(data)
        featuresList = list(data.values())
        data = np.array(featuresList)[np.newaxis, :]  # converts shape from (4,) to (1, 4)
        newdata = scale.transform(data)
        prediction = model.predict(newdata)  # runs globally loaded model on the data
    return str(prediction)


if __name__ == '__main__':
    load_model()  # load model at the beginning once only
    load_scale()
    app.run()