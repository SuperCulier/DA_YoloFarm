import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import accuracy_score
import joblib

# Đọc dataset
def load_data(file_path):
    df = pd.read_csv(file_path)
    df = df.dropna()  # Loại bỏ giá trị thiếu
    return df

# Huấn luyện mô hình
def train_model(X_train, y_train):
    model = DecisionTreeClassifier(max_depth=4, random_state=42)  # Giới hạn độ sâu để tránh overfitting
    model.fit(X_train, y_train)
    return model

# Kiểm tra mô hình
def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f'Accuracy: {accuracy:.4f}')

# Trực quan hóa cây quyết định
def visualize_tree(model):
    plt.figure(figsize=(12, 8))
    plot_tree(model, feature_names=['tempreature', 'humidity'], class_names=['OFF', 'ON'], filled=True, rounded=True)
    plt.show()

if __name__ == "__main__":
    file_path = "IoTProcessed_Data.csv"
    
    # Load dataset
    df = load_data(file_path)
    X = df[['tempreature', 'humidity']]
    y = df[['Watering_plant_pump_ON','Fan_actuator_ON']]  # Nhãn đầu ra
    
    # Chia tập dữ liệu
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model_filename = "decision_tree_model_FanPump.pkl"

    # Huấn luyện mô hình
    model = train_model(X_train, y_train)

    # Lưu mô hình
    joblib.dump(model, model_filename)
    print("Độ sâu của cây quyết định:", model.get_depth())

    # Đánh giá mô hình
    evaluate_model(model, X_test, y_test)
    
    # Trực quan hóa cây quyết định
    visualize_tree(model)
