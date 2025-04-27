import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import os

# Đọc dataset
def load_data(file_path):
    df = pd.read_csv(file_path)
    df = df.dropna()  # Loại bỏ giá trị thiếu
    return df

# Huấn luyện mô hình
def train_model(X_train, y_train):
    model = MultiOutputClassifier(DecisionTreeClassifier(max_depth=3, random_state=20))  # MultiOutputClassifier bao bọc DecisionTreeClassifier
    model.fit(X_train, y_train)
    return model

# Kiểm tra mô hình và tính các metric
def evaluate_model(model, X_test, y_test):
    # Dự đoán cho tất cả các nhãn đầu ra
    y_pred = model.predict(X_test)
    
    # Đánh giá cho từng đầu ra
    for i, label in enumerate(y_test.columns):
        print(f"Metrics for {label}:")
        
        # Accuracy
        accuracy = accuracy_score(y_test.iloc[:, i], y_pred[:, i])
        print(f"  Accuracy: {accuracy:.4f}")
        
        # Precision
        precision = precision_score(y_test.iloc[:, i], y_pred[:, i], average='binary')
        print(f"  Precision: {precision:.4f}")
        
        # Recall
        recall = recall_score(y_test.iloc[:, i], y_pred[:, i], average='binary')
        print(f"  Recall: {recall:.4f}")
        
        # F1 Score
        f1 = f1_score(y_test.iloc[:, i], y_pred[:, i], average='binary')
        print(f"  F1 Score: {f1:.4f}")
        
    # Đánh giá tổng thể
    print("\nOverall Metrics:")
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Overall Accuracy: {accuracy:.4f}")

# Trực quan hóa cây quyết định
def visualize_tree(model):
    plt.figure(figsize=(12, 8))
    plot_tree(model.estimators_[0], feature_names=['tempreature', 'humidity'], class_names=['OFF', 'ON'], filled=True, rounded=True)
    plt.show()

def main_train_model():
    current_dir = os.path.dirname(__file__)  # thư mục của AI_train.py
    data_path = os.path.join(current_dir, "..", "dataset", "IoTProcessed_Data.csv")
    print(data_path)
    # Chuẩn hóa đường dẫn
    data_path = os.path.abspath(data_path)

    # Load dataset
    df = load_data(data_path)
    X = df[['tempreature', 'humidity']]
    y = df[['Watering_plant_pump_ON','Fan_actuator_ON']]  # Nhãn đầu ra
    
    # Chia tập dữ liệu
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=20)

    model_filename = os.path.join(current_dir, "..", "dataset", "decision_tree_model_FanPump.pkl")
    model_filename = os.path.abspath(model_filename)

    # Huấn luyện mô hình
    model = train_model(X_train, y_train)

    # Lưu mô hình
    joblib.dump(model, model_filename)
    print("Độ sâu của cây quyết định:", model.estimators_[0].get_depth())  # Lấy độ sâu từ cây đầu tiên trong MultiOutputClassifier

    # Đánh giá mô hình
    evaluate_model(model, X_test, y_test)
    
    # Trực quan hóa cây quyết định (cây đầu tiên)
    visualize_tree(model)
    return True

def predict(temp, humid):
    current_dir = os.path.dirname(__file__)
    model_filename = os.path.join(current_dir, "..", "dataset", "decision_tree_model_FanPump.pkl")
    model_filename = os.path.abspath(model_filename)

    model = joblib.load(model_filename)
    prediction = model.predict([[temp, humid]])
    return prediction[0][0], prediction[0][1]
