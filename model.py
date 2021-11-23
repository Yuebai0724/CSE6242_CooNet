import pandas as pd
import numpy as np
import pickle
import lightgbm as lgb

class Model():

    def cluster(self, input_tag: list):

        model_input = [input_tag]
        loaded_model = pickle.load(open('kmeans.sav', 'rb'))
        cluster_id = loaded_model.predict(model_input)

        return cluster_id

    def regression(self, input_ingredients: list, cluster_id: int):

        df = pd.read_csv('ancillary.csv')
        df_model = df[~df['name'].isin(input_ingredients)]

        for i in input_ingredients:
            df_model[i].replace(0,1,inplace=True)

        X = df_model.drop(['name'], axis=1, inplace=False)

        file_name = 'model_' + str(cluster_id) + '.txt'
        bst = lgb.Booster(model_file=file_name)
        prediction = bst.predict(X)
        column_values = pd.Series(prediction).values

        df_model.insert(loc=0, column='rating_prediction', value=column_values)
        result = df_model[['name','rating_prediction']].copy()
        output = result.sort_values(by='rating_prediction', ascending=False).head(20)

        return output
    # output: dataframe, columns: 'name'(recommended ingredients), 'rating_prediction'


