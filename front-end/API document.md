# 1 Get Ingredients

## Description

Get ingredients with highest prediction ratings.

It will be used to create ingredients network graph

## Parameter

| Parameter            | dataType       | description                                                  | isRequired |
| -------------------- | -------------- | ------------------------------------------------------------ | ---------- |
| selected_ingredients | array (string) | All selected ingredients                                     | Required   |
| model                | string         | The recipe context for model training  <br/>**Default**: 'None' for model trained by all recipes <br/>'a' for xxx <br/>'b' for xxx | Optional   |
| nodes_number         | int            | How many nodes to show in graph <br/>**Default**: 20         | Optional   |

## Response

**Form**: CSV

| Header             | dataType | description                                                  |
| ------------------ | -------- | ------------------------------------------------------------ |
| source             | String   | source node for edge                                         |
| target             | string   | target node for edge                                         |
| is_source_selected | boolean  | whether the source node is selected ingredients              |
| is_target_selected | boolean  | whether the target node is selected ingredients              |
| frequency          | Int      | The frequency of such pair of ingredients appear in one recipe |

**Sample**
<img src="https://github.gatech.edu/ygao464/CSE6242_FinalProject/blob/main/image/ingredients.png">


# 2 Get Prediction Rating

## Description

Get prediction ratings for a given collection of ingredines

It will be used to draw prediction rating card and tooltip

## Parameter

| Parameter            | dataType       | description                                                  | isRequired |
| -------------------- | -------------- | ------------------------------------------------------------ | ---------- |
| selected_ingredients | array (string) | All selected ingredients                                     | Required   |
| model                | string         | The recipe context for model training  <br/>**Default**: 'None' for model trained by all recipes <br/>'a' for xxx <br/>'b' for xxx | Optional   |

## Response

**Form**: value 

| Header | dataType | description                          |
| ------ | -------- | ------------------------------------ |
| rating | decimal  | Prediction rating, range from 0 to 5 |



# 3 Get Recipe Recommendation

## Description

Get recipe recommendation list, sorted by its rating

It should be filtered by selected_ingredients and selected filter type (nutrition or rating) 

## Parameter

| Parameter            | dataType       | description                                                  | isRequired |
| -------------------- | -------------- | ------------------------------------------------------------ | ---------- |
| selected_ingredients | array (string) | All selected ingredients                                     | Required   |
| model                | string         | The recipe context for model training  <br/>**Default**: 'None' for model trained by all recipes <br/>'a' for xxx <br/>'b' for xxx | Optional   |
| recipe_number        | int            | How many recipes to be shown <br/>**Default**: 5             | Optional   |
| filter_type          | string         | **Default**: 'rating'<br />Options includes 'Calories', 'Carbohydrate', 'Protein', 'Fat', 'Rating' | Optional   |
| low                  | decimal        | The lowest value of filter<br />**Default**: None            | Optional   |
| high                 | decimal        | The highest value of filter<br />**Default**: None           | Optional   |

## Response

**Form**: CSV

| Header        | dataType | description   |
| ------------- | -------- | ------------- |
| recipe_name   | string   | Recipe name   |
| recipe_rating | decimal  | Recipe rating |

**Sample**
<img src="https://github.gatech.edu/ygao464/CSE6242_FinalProject/blob/main/image/recipes.png">




# 4 Get Recipe Statistics

## Description

Get recipe statistics' distribution, filtered by selected_ingredients

It will be used to create nutrition histograms

## Parameter

| Parameter            | dataType       | description                                                  | isRequired |
| -------------------- | -------------- | ------------------------------------------------------------ | ---------- |
| selected_ingredients | array (string) | All selected ingredients                                     | Required   |
| model                | string         | The recipe context for model training  <br/>**Default**: 'None' for model trained by all recipes <br/>'a' for xxx <br/>'b' for xxx | Optional   |

## Response

**Form**: json

| Schema  |                 |                                                              |
| ------- | --------------- | ------------------------------------------------------------ |
| results | array[object]   | Results                                                      |
| type    | string          | Statistics type, including "Rating","Calories","Carbohydrate","Protein","Fat" |
| data    | array (decimal) | the value of corresponding statistics type                   |

**Sample**
<img src="https://github.gatech.edu/ygao464/CSE6242_FinalProject/blob/main/image/statistics.png">

