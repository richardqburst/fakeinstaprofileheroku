import pandas as pd
import numpy as np
import time

begin = time.time()
#Importing Dataset
dataset = pd.read_csv("dataset/user_fake_authentic_2class.csv")
dataset.head()

#Preparing Data For Training
#NOTE: omitting 15 increases accuracy 
X = dataset.iloc[:, [0,1,2,3,4,5,6,7,8,9,10,11,12]].values
y = dataset.iloc[:, 17].values

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=0)

#Feature Scaling
from sklearn.preprocessing import StandardScaler

sc = StandardScaler()
#X_train = sc.fit_transform(X_train)
#X_test = sc.transform(X_test)

sc.fit(X_train)
X_train = sc.transform(X_train)
X_test = sc.transform(X_test)

#Training the Algorithm
from sklearn.ensemble import RandomForestClassifier

classifier = RandomForestClassifier(n_estimators=80, random_state=0)
classifier.fit(X_train, y_train)
y_pred = classifier.predict(X_test)

#save classifier as a pickle file
import pickle
pickle.dump(classifier, open('trainedModel.sav', 'wb'))
pickle.dump(sc, open('scale.sav', 'wb'))

#datavk =  [1109,83012986 ,198 ,10  ,1, 1, 179.57, 0,    0.01,       2.16         ,0.015   ,0           , 1.29]
#datadt =  [6111,24487504 ,8   ,35  ,1, 0, 101.54, 0.08, 0.01,       2.30         ,0.06    ,0.33        , 0.25]
#datadsr = [2800,117300   ,922 ,122 ,1, 0, 348,    0,    0.34799999, 1.159999967  ,0.01    ,0.086999998 ,0.477999985] 
#data = np.array(datadsr)[np.newaxis, :]
#newdata = sc.transform(data)
#ny_pred = classifier.predict(newdata)
#print(ny_pred)

#loaded_model = pickle.load(open('trainedModel.sav', 'rb'))
#y_pred = loaded_model.predict(X_test)
#Evaluating the Algorithm
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

#print(confusion_matrix(y_test,y_pred))
#print(classification_report(y_test,y_pred))
print(accuracy_score(y_test, y_pred))

end = time.time()
print(f"Total runtime of the program is {end - begin}") 