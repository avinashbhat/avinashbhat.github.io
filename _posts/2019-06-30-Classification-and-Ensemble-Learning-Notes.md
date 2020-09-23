---
layout: post
title: Classification and Ensemble Learning Notes
description: Classification and Ensemble Learning Notes
summary: Classification and Ensemble Learning Notes
date: 2019-06-30
category: blog
comments: true
tags: [code, machine-learning]
---
This post explores decision trees, and some of the ensemble models used to improve the score. Read it through to get to know some standard ways for classification using decision trees.


```python
import pandas as pd
import numpy as np
```

The dataset being used is the breast cancer dataset which can be downloaded from [here](https://archive.ics.uci.edu/ml/datasets/breast+cancer). 
First load the dataset into the variable. Three main things one should do to understand the data are to see the data in a table format, see the data types of each of the columnns, check the number of null values.


```python
# Dataset does not have column names, so adding separately from breast-cancer.names file
names = ['Class', 'age', 'menopause', 'tumor-size', 'inv-nodes', 
        'node-caps', 'deg-malig', 'breast', 'breast-quad', 'irradiate']
cancer_actual = pd.read_csv('breast-cancer.data', names=names)
# To understand the data
print(cancer_actual.head())
# To get the datatypes
print(cancer_actual.dtypes)
# To get the null values
print(cancer_actual.isnull().sum())
# To remove the rows with question marks
cancer_actual = cancer_actual[(cancer_actual.astype(str) != '?').all(axis=1)]
```

                      Class    age menopause tumor-size inv-nodes node-caps  \
    0  no-recurrence-events  30-39   premeno      30-34       0-2        no   
    1  no-recurrence-events  40-49   premeno      20-24       0-2        no   
    2  no-recurrence-events  40-49   premeno      20-24       0-2        no   
    3  no-recurrence-events  60-69      ge40      15-19       0-2        no   
    4  no-recurrence-events  40-49   premeno        0-4       0-2        no   
    
       deg-malig breast breast-quad irradiate  
    0          3   left    left_low        no  
    1          2  right    right_up        no  
    2          2   left    left_low        no  
    3          2  right     left_up        no  
    4          2  right   right_low        no  
    Class          object
    age            object
    menopause      object
    tumor-size     object
    inv-nodes      object
    node-caps      object
    deg-malig       int64
    breast         object
    breast-quad    object
    irradiate      object
    dtype: object
    Class          0
    age            0
    menopause      0
    tumor-size     0
    inv-nodes      0
    node-caps      0
    deg-malig      0
    breast         0
    breast-quad    0
    irradiate      0
    dtype: int64


Once we have the basic understanding of the data, we can begin with the data preprocessing. Since I do not have any null values, I won't be dropping any columns and deleting the rows with null values. There are ways in which we can approximate values into these missing data points (refer [this](https://machinelearningmastery.com/handle-missing-data-python/), [this](https://towardsdatascience.com/handling-missing-values-in-machine-learning-part-1-dda69d4f88ca) and [this](https://towardsdatascience.com/handling-missing-values-in-machine-learning-part-2-222154b4b58e)) but that's for another post. For now, we just ignore these values.

Among those machine learning models I know, none of them can handle the categorical values well. They need them to be either label encoded, or better, one hot encoded. Now, label encoding can be done with scikit learn module (refer [this](https://scikit-learn.org/stable/modules/preprocessing_targets.html#preprocessing-targets) and [this](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelEncoder.html)), although one column at a time.


```python
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
# Always copy the dataset, so that if there is any more operations need to be performed, 
# you don't have to scramble through for it
cancer_le_encoded = cancer_actual.copy()
# Construct a mapping so that the dictionary can be constructed later
mapping_dictionary = {}
for col in cancer_le_encoded[names]:
    cancer_le_encoded[col] = le.fit_transform(cancer_le_encoded[col])
    for each in zip(le.classes_, le.transform(le.classes_)):
            mapping_dictionary[str(col) + '_' + str(each[0])] = each[1]
# cancer_le_encoded[names] = cancer_le_encoded[names].apply(lambda col: le.fit_transform(col))
print(cancer_le_encoded.head())
```

       Class  age  menopause  tumor-size  inv-nodes  node-caps  deg-malig  breast  \
    0      0    1          2           5          0          0          2       0   
    1      0    2          2           3          0          0          1       1   
    2      0    2          2           3          0          0          1       0   
    3      0    4          0           2          0          0          1       1   
    4      0    2          2           0          0          0          1       1   
    
       breast-quad  irradiate  
    0            1          0  
    1            4          0  
    2            1          0  
    3            2          0  
    4            3          0  


Now let's split the dataset into y and X.


```python
print(mapping_dictionary, len(mapping_dictionary))
```

    {'Class_no-recurrence-events': 0, 'Class_recurrence-events': 1, 'age_20-29': 0, 'age_30-39': 1, 'age_40-49': 2, 'age_50-59': 3, 'age_60-69': 4, 'age_70-79': 5, 'menopause_ge40': 0, 'menopause_lt40': 1, 'menopause_premeno': 2, 'tumor-size_0-4': 0, 'tumor-size_10-14': 1, 'tumor-size_15-19': 2, 'tumor-size_20-24': 3, 'tumor-size_25-29': 4, 'tumor-size_30-34': 5, 'tumor-size_35-39': 6, 'tumor-size_40-44': 7, 'tumor-size_45-49': 8, 'tumor-size_5-9': 9, 'tumor-size_50-54': 10, 'inv-nodes_0-2': 0, 'inv-nodes_12-14': 1, 'inv-nodes_15-17': 2, 'inv-nodes_24-26': 3, 'inv-nodes_3-5': 4, 'inv-nodes_6-8': 5, 'inv-nodes_9-11': 6, 'node-caps_no': 0, 'node-caps_yes': 1, 'deg-malig_1': 0, 'deg-malig_2': 1, 'deg-malig_3': 2, 'breast_left': 0, 'breast_right': 1, 'breast-quad_central': 0, 'breast-quad_left_low': 1, 'breast-quad_left_up': 2, 'breast-quad_right_low': 3, 'breast-quad_right_up': 4, 'irradiate_no': 0, 'irradiate_yes': 1} 43



```python
y = cancer_le_encoded['Class']
cancer_le_encoded = cancer_le_encoded.drop(['Class'], axis=1)
y_mappings = {}
y_mappings['Class_no-recurrence-events'] = 0
y_mappings['Class_recurrence-events'] = 1
del mapping_dictionary['Class_no-recurrence-events']
del mapping_dictionary['Class_recurrence-events']
```

Easiest way to do one hot encoding is using pandas, again one column at a time. Multicolumn encoding is not supported in any of the Python libraries as of now.


```python
# For one hot encoding
cancer_ohe_encoded = pd.DataFrame()
# Get the column names to iterate over the dataframe
cols = cancer_le_encoded.columns.values
for col in cols:
    col = pd.get_dummies(cancer_le_encoded[col], prefix=col)
    cancer_ohe_encoded = pd.concat([cancer_ohe_encoded, col], axis=1)   
cancer_ohe_encoded.head()
print(cancer_ohe_encoded.columns.values, len(cancer_ohe_encoded.columns.values))
```

    ['age_0' 'age_1' 'age_2' 'age_3' 'age_4' 'age_5' 'menopause_0'
     'menopause_1' 'menopause_2' 'tumor-size_0' 'tumor-size_1' 'tumor-size_2'
     'tumor-size_3' 'tumor-size_4' 'tumor-size_5' 'tumor-size_6'
     'tumor-size_7' 'tumor-size_8' 'tumor-size_9' 'tumor-size_10'
     'inv-nodes_0' 'inv-nodes_1' 'inv-nodes_2' 'inv-nodes_3' 'inv-nodes_4'
     'inv-nodes_5' 'inv-nodes_6' 'node-caps_0' 'node-caps_1' 'deg-malig_0'
     'deg-malig_1' 'deg-malig_2' 'breast_0' 'breast_1' 'breast-quad_0'
     'breast-quad_1' 'breast-quad_2' 'breast-quad_3' 'breast-quad_4'
     'irradiate_0' 'irradiate_1'] 41



```python
print(len(mapping_dictionary))
```

    41



```python
X = cancer_ohe_encoded
```

Now we need to split the values into training and test split, post which we split it into training and validation split. Here we take 10% of the data into test and 10% of the subsequent training data into validation data.


```python
# Initial train, test split
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1)
print(len(X_train), len(X_test), len(y_train), len(y_test))
```

    249 28 249 28



```python
# Train Validation Split
X_train, X_valid, y_train, y_valid = train_test_split(X_train, y_train, test_size=0.1)
print(len(X_train), len(X_valid), len(y_train), len(y_valid))
```

    224 25 224 25


Let's start with the decision tree classification.


```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, recall_score, precision_score, confusion_matrix, f1_score
import matplotlib.pyplot as plt
import seaborn as sb
```

Create a model object and fit the training data. Check out [score](https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html#sklearn.tree.DecisionTreeClassifier.score) for each split of data.


```python
decision_tree_model = DecisionTreeClassifier()
decision_tree_fit = decision_tree_model.fit(X_train, y_train)
```


```python
print("Training: " + str(decision_tree_fit.score(X_train,y_train)))
print("Validation: " + str(decision_tree_fit.score(X_valid, y_valid)))
print("Test: " + str(decision_tree_fit.score(X_test, y_test)))
```

    Training: 0.9821428571428571
    Validation: 0.6
    Test: 0.75


Predict the validation set. Some major evaluation metrics for classification trees are confusion matrix, accuracy score, recall score and F1 score. (Some good references - [this](https://www.machinelearningplus.com/machine-learning/evaluation-metrics-classification-models-r/), [this](https://scikit-learn.org/stable/modules/model_evaluation.html) and [this](https://towardsdatascience.com/common-classification-model-evaluation-metrics-2ba0a7a7436e))


```python
# Validate using the validation split
prediction_value_valid = decision_tree_fit.predict(X_valid)
confusion_matrix_valid = confusion_matrix(y_true=y_valid, y_pred=prediction_value_valid)
print("precision score : "+ str(precision_score(y_valid, prediction_value_valid))) # tp/tp+fp
print("accuracy score : "+ str(accuracy_score(y_valid, prediction_value_valid))) # total correct 
print("recall score : "+ str(recall_score(y_valid, prediction_value_valid)))   # tp/tp+fn
print("f1 score : "+ str(f1_score(y_valid, prediction_value_valid)))
```

    precision score : 0.4444444444444444
    accuracy score : 0.6
    recall score : 0.4444444444444444
    f1 score : 0.4444444444444444


Ideally, the validation set is added to training set before prediction for test set. This increases the size of training data.


```python
# Check the test split accuracy
prediction_value_test = decision_tree_fit.predict(X_test)
confusion_matrix_test = confusion_matrix(y_true=y_test, y_pred=prediction_value_test)
print("precision score : "+ str(precision_score(y_test, prediction_value_test))) # tp/tp+fp
print("accuracy score : "+ str(accuracy_score(y_test, prediction_value_test))) # total correct 
print("recall score : "+ str(recall_score(y_test, prediction_value_test)))   # tp/tp+fn
print("f1 score : "+ str(f1_score(y_test, prediction_value_test)))
```

    precision score : 0.4
    accuracy score : 0.75
    recall score : 0.3333333333333333
    f1 score : 0.3636363636363636


We can try to visualize this tree. I found the easiest way to be the '[export_graphviz](https://scikit-learn.org/stable/modules/generated/sklearn.tree.export_graphviz.html)' module from sklearn library.
This module exports the decision tree in a dot format, which then has to be exported as a PNG. I'm further writing this to a dot file, from which I'll generate the visualization using command line.


```python
from sklearn.tree import export_graphviz
visualization = export_graphviz(decision_tree_model, feature_names=list(mapping_dictionary.keys()))
with open('decision_tree_simple.dot', 'w') as f:
    f.write(visualization)
```

Run this wile with [webgraphviz](http://www.webgraphviz.com/) for the visualization. You can also try it out in your local system using the graphviz module.

Now moving on to improving the accuracy, bagging, boosting and random forest models.
Take the precision score to be a baseline.


```python
from sklearn.ensemble import BaggingClassifier
from sklearn.model_selection import KFold, cross_val_score
```

Here, we are doing [cross validation](https://scikit-learn.org/stable/modules/cross_validation.html) (refer [this](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_score.html)). So we do not need validation set.


```python
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=9)
print(len(X_train), len(X_test), len(y_train), len(y_test))
```

    249 28 249 28


[KFold](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.KFold.html) is a cross validation technique (refer [this](https://medium.com/datadriveninvestor/k-fold-cross-validation-6b8518070833) and [this](https://machinelearningmastery.com/k-fold-cross-validation/)). 


```python
kfold = KFold(n_splits=10, random_state=1)
dt_model = DecisionTreeClassifier()
num_trees = 100
bagging_model = BaggingClassifier(base_estimator=dt_model, n_estimators=num_trees, random_state=1)
results = cross_val_score(bagging_fit, X_train, y_train, cv=kfold)
print("Cross Validation Score:  " + str(results.mean()))
```

    Cross Validation Score:  0.7353333333333333


Starting with bagging module.


```python
bagging_fit = bagging_model.fit(X_train, y_train)
bagging_prediction = bagging_fit.predict(X_test)
confusion_matrix_test = confusion_matrix(y_true=y_test, y_pred=bagging_prediction)
print("precision score : "+ str(precision_score(y_test, bagging_prediction))) # tp/tp+fp
print("accuracy score : "+ str(accuracy_score(y_test, bagging_prediction))) # total correct 
print("recall score : "+ str(recall_score(y_test, bagging_prediction)))   # tp/tp+fn
print("f1 score : "+ str(f1_score(y_test, bagging_prediction)))
```

    precision score : 0.5
    accuracy score : 0.7857142857142857
    recall score : 0.3333333333333333
    f1 score : 0.4


Next is the Random Forest Model.


```python
from sklearn.ensemble import RandomForestClassifier
kfold = KFold(n_splits=10, random_state=1)
num_trees = 100
random_forest_fit = RandomForestClassifier(n_estimators=num_trees, max_features=3)
results = cross_val_score(random_forest_fit, X_train, y_train, cv=kfold)
print("Cross Validation Score:  " + str(results.mean()))
random_fit = random_forest_fit.fit(X_train, y_train)
random_forest_prediction = random_fit.predict(X_test)
confusion_matrix_test = confusion_matrix(y_true=y_test, y_pred=random_forest_prediction)
print("precision score : "+ str(precision_score(y_test, random_forest_prediction))) # tp/tp+fp
print("accuracy score : "+ str(accuracy_score(y_test, random_forest_prediction))) # total correct 
print("recall score : "+ str(recall_score(y_test, random_forest_prediction)))   # tp/tp+fn
print("f1 score : "+ str(f1_score(y_test, random_forest_prediction)))
```

    Cross Validation Score:  0.751
    precision score : 1.0
    accuracy score : 0.8571428571428571
    recall score : 0.3333333333333333
    f1 score : 0.5


We have a good accuracy, and also a decent F1 score.

Now working with the Extra Trees model.


```python
from sklearn.ensemble import ExtraTreesClassifier
num_trees = 100
kfold = KFold(n_splits=10, random_state=1)
et_model = ExtraTreesClassifier(n_estimators=num_trees, max_features=3)
results = cross_val_score(et_model, X_train, y_train, cv=kfold)
print("Cross Validation Score:  " + str(results.mean()))
et_fit = et_model.fit(X_train, y_train)
extra_tree_prediction = et_fit.predict(X_test)
confusion_matrix_test = confusion_matrix(y_true=y_test, y_pred=extra_tree_prediction)
print("precision score : "+ str(precision_score(y_test, extra_tree_prediction))) # tp/tp+fp
print("accuracy score : "+ str(accuracy_score(y_test, extra_tree_prediction))) # total correct 
print("recall score : "+ str(recall_score(y_test, extra_tree_prediction)))   # tp/tp+fn
print("f1 score : "+ str(f1_score(y_test, extra_tree_prediction)))
```

    Cross Validation Score:  0.7393333333333333
    precision score : 1.0
    accuracy score : 0.8571428571428571
    recall score : 0.3333333333333333
    f1 score : 0.5


Extra Trees is similar to that of Random Forest.


```python
from sklearn.ensemble import AdaBoostClassifier
num_trees = 100
kfold = KFold(n_splits=10, random_state=1)
ad_model = AdaBoostClassifier(n_estimators=num_trees, random_state=1)
results = cross_val_score(ad_model, X_train, y_train, cv=kfold)
print("Cross Validation Score:  " + str(results.mean()))
adaboost_fit = ad_model.fit(X_train, y_train)
adaboost_prediction = adaboost_fit.predict(X_test)
confusion_matrix_test = confusion_matrix(y_true=y_test, y_pred=adaboost_prediction)
print("precision score : "+ str(precision_score(y_test, adaboost_prediction))) # tp/tp+fp
print("accuracy score : "+ str(accuracy_score(y_test, adaboost_prediction))) # total correct 
print("recall score : "+ str(recall_score(y_test, adaboost_prediction)))   # tp/tp+fn
print("f1 score : "+ str(f1_score(y_test, adaboost_prediction)))
```

    Cross Validation Score:  0.6708333333333333
    precision score : 0.3333333333333333
    accuracy score : 0.75
    recall score : 0.16666666666666666
    f1 score : 0.2222222222222222


Hmm, a lower f1 score in AdaBoost? Okay.


```python
from sklearn.ensemble import GradientBoostingClassifier
num_trees = 100
kfold = KFold(n_splits=10, random_state=1)
gbc_model = GradientBoostingClassifier(n_estimators=num_trees, random_state=1)
results = cross_val_score(gbc_model, X_train, y_train, cv=kfold)
print("Cross Validation Score:  " + str(results.mean()))
gradient_boost_fit = gbc_model.fit(X_train, y_train)
gb_prediction = gradient_boost_fit.predict(X_test)
confusion_matrix_test = confusion_matrix(y_true=y_test, y_pred=gb_prediction)
print("precision score : "+ str(precision_score(y_test, gb_prediction))) # tp/tp+fp
print("accuracy score : "+ str(accuracy_score(y_test, gb_prediction))) # total correct 
print("recall score : "+ str(recall_score(y_test, gb_prediction)))   # tp/tp+fn
print("f1 score : "+ str(f1_score(y_test, gb_prediction)))
```

    Cross Validation Score:  0.7071666666666666
    precision score : 0.25
    accuracy score : 0.7142857142857143
    recall score : 0.16666666666666666
    f1 score : 0.2


Maybe bagging models are better. More on Gradient Boosting [here](https://towardsdatascience.com/introduction-to-gradient-boosting-on-decision-trees-with-catboost-d511a9ccbd14).


```python
from sklearn.ensemble import VotingClassifier
kfold = KFold(n_splits=10, random_state=1)
num_trees = 100
# create the sub models
estimators = []
estimators.append(('decision_trees', DecisionTreeClassifier()))
estimators.append(('random_forest', RandomForestClassifier(n_estimators=num_trees, max_features=3)))
estimators.append(('extra_trees', ExtraTreesClassifier(n_estimators=num_trees, max_features=3)))
estimators.append(('adaboost', AdaBoostClassifier(n_estimators=num_trees, random_state=1)))
estimators.append(('gradient_boost', GradientBoostingClassifier(n_estimators=num_trees, random_state=1)))
ensemble = VotingClassifier(estimators)
results = cross_val_score(ensemble, X_train, y_train, cv=kfold)
print("Cross Validation Score:  " + str(results.mean()))
ensemble_fit = ensemble.fit(X_train, y_train)
ensemble_prediction = ensemble_fit.predict(X_test)
confusion_matrix_test = confusion_matrix(y_true=y_test, y_pred=ensemble_prediction)
print("precision score : "+ str(precision_score(y_test, ensemble_prediction))) # tp/tp+fp
print("accuracy score : "+ str(accuracy_score(y_test, ensemble_prediction))) # total correct 
print("recall score : "+ str(recall_score(y_test, ensemble_prediction)))   # tp/tp+fn
print("f1 score : "+ str(f1_score(y_test, ensemble_prediction)))
```

    Cross Validation Score:  0.727
    precision score : 0.6666666666666666
    accuracy score : 0.8214285714285714
    recall score : 0.3333333333333333
    f1 score : 0.4444444444444444


So final one is Voting classifier. This compares multiple models and ranks them based on some weights. This is a concept called [stacking](http://blog.kaggle.com/2016/12/27/a-kagglers-guide-to-model-stacking-in-practice/). Read more on this [here](http://rasbt.github.io/mlxtend/user_guide/classifier/EnsembleVoteClassifier/).

We explored multiple modules involving ensemble learning and trees for the breast cancer dataset. We also saw that Random Forest and Extra trees models have the best scores for this dataset. This post shows the way in which a dataset needs to be addressed, the decision tree model preparations, metrics for evaluation of the models and visualization techniques. Thanks.
