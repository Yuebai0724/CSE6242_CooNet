from flask import Flask, flash, redirect, render_template, request, session, abort,send_from_directory,send_file,jsonify
import pandas as pd

import json

import pickle
import lightgbm as lgb
from itertools import combinations
from collections import Counter, defaultdict
from models.model import Model

from models.TW_freq_filter import frequency, recipeFilter

df_frequency = pd.read_csv("realData/frequency.csv")


#1. Declare application
application= Flask(__name__)

#2. Declare data stores
class DataStore():
    Selected_ingredients = None #e.g. ['potatoes', 'bananas', 'strawberries']
    Input_tags = None #e.g. [1,1,1,1,1]
    Cluster_ID = None #e.g. 2

    Network_data=None #json data
    Rating=None
    Recipe_recommend= None
    Recipe_stats=None
data=DataStore()


@application.route("/main",methods=["GET","POST"])

#3. Define main code
@application.route("/",methods=["GET","POST"])
def homepage():

    #if request.method == 'POST':
    #Selected_ingredients = request.form.get('Ingredients',['potatoes', 'bananas', 'strawberries'])

    """
    try:
        Selected_ingredients = request.args.getlist('selected[]')
    except:
        print("have not select")
    print("----request1----")
    print(request.args)

    if len(Selected_ingredients)==0:
    """
    print("----request1----")
    Selected_ingredients = ['potatoes', 'beef', 'salt']

    print(Selected_ingredients)
    data.Selected_ingredients = Selected_ingredients
    Input_tags = [1,1,1,1,1]
    data.Input_tags = Input_tags

    model = Model()
    cluster_id = model.cluster(Input_tags)
    data.Cluster_ID = cluster_id[0]

    output = model.regression(Selected_ingredients,cluster_id=cluster_id[0])
    ingredients = output['name'].tolist()
    print(ingredients)

    network_data = frequency(df_frequency, Selected_ingredients, ingredients)
    #print(network_data)

    d = {"name": "statistics", "data": []}
    with open('testData/statistic.json') as f:
        stats = json.load(f)

    d['data']=stats
    e = json.dumps(d)
    data.Recipe_stats = json.loads(e)


    d2 = {"name": "network_data", "data": []}
    #with open('testData/ingredients.json') as f:
    #    Ingredients_recommend = json.load(f)

    d2['data']=network_data
    e2 = json.dumps(d2)
    data.Network_data = json.loads(e2)
    print("---updated1---")


    if request.method == 'POST':
        print("try to jump to reuslt")
        print(request.form['jumpto'])
        return render_template(request.form['jumpto']+".html", Selected_ingredients = Selected_ingredients)

    return render_template("index.html", Selected_ingredients = Selected_ingredients)


@application.route("/get-ingredients",methods=["GET","POST"])
def get_ingredients():

    Selected_ingredients = request.args.getlist('selected[]')

    print("----request2----")
    print(request.args)

    if len(Selected_ingredients)==0:
        Selected_ingredients = data.Selected_ingredients

    print(Selected_ingredients)
    data.Selected_ingredients = Selected_ingredients

    model = Model()
    cluster_id = data.Cluster_ID

    output = model.regression(Selected_ingredients,cluster_id=cluster_id)
    ingredients = output['name'].tolist()
    print(ingredients)

    network_data = frequency(df_frequency, Selected_ingredients, ingredients)
    d2 = {"name": "network_data", "data": []}

    d2['data']=network_data
    e2 = json.dumps(d2)
    data.Network_data = json.loads(e2)
    print("---updated2---")

    Network_data=data.Network_data
    print("----get ingredients----")
    return jsonify(Network_data)

@application.route("/get-stats",methods=["GET","POST"])
def get_stats():
    with open('testData/statistic.json') as f:
        stats = json.load(f)
    return jsonify(stats)

@application.route("/ingredient-list")
def ingredient_list():
    with open('realData/ingredient_list.json') as f:
        stats = json.load(f)
    return jsonify(stats)

@application.route("/get-tags")
def get_tags():
    with open('realData/tag_list.json') as f:
        stats = json.load(f)
    return jsonify(stats)

@application.route("/get-pred'")
def get_prediction():
    # with open('realData/tag_list.json') as f:
    #     stats = json.load(f)
    # return jsonify(stats)



if __name__ == "__main__":
    application.run(debug=True)
