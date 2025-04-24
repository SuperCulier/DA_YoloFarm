import joblib
model_filename = "decision_tree_model_FanPump.pkl"
model = joblib.load(model_filename)

#  FORMAT INPUT: [[tempeterature, hudimity]] cho 1 sample
#                [[tempeterature, hudimity], [tempeterature, hudimity], ...] cho nhieu sample
sample_input = [[30, 40], [23, 30], [25, 50]]  # sample tuple (Nhiet do 30, Do am 40)
prediction = model.predict(sample_input)
print(prediction)
#  i la index cua ket qua du doan theo sample_input thu i-th
#  prediction[i][0] == 1 : PUMP ON
#  prediction[i][1] == 1 : FAN ON