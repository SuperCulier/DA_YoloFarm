import joblib
model_filename = "decision_tree_model_FanPump.pkl"
model = joblib.load(model_filename)


sample_input = [[30, 40], [23, 30], [25, 50]]  # sample tuple (Nhiet do 30, Do am 40)
prediction = model.predict(sample_input)
print(prediction)
#  i la index cua sample_input
#  prediction[i][0] == 1 : PUMP ON
#  prediction[i][1] == 1 : FAN ON