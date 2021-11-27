
import numpy as np
import json
import pandas as pd

data_size = 2000
properties = ["Rating", "Calories", "Carbohydrate", "Protein", "Fat"]

arr = np.random.normal(loc=10, scale=5, size=(data_size, 5))
name = np.arange(data_size).reshape([data_size, 1])
df = pd.DataFrame(arr, columns=properties)
df['Name'] = name
print(df.head(5))

df_json = df.to_json(orient='records')

with open("testData/statistic.json", 'w') as outfile:
    json.dump(df_json, outfile)
