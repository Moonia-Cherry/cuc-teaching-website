from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import importlib

app = Flask(__name__)
CORS(app)

@app.route('/run', methods=['POST'])
def run():
    data = request.get_json()
    code = data['code']
    # 指定Conda环境中的Python解释器路径
    python_interpreter = r"C:\Users\shanchuan\anaconda3\envs\zxbjq\python.exe"
    try:
        # 使用subprocess运行Python代码
        result = subprocess.run([python_interpreter, '-c', code], capture_output=True, text=True, check=True)
        output = result.stdout
    except subprocess.CalledProcessError as e:
        output = e.stderr
    return jsonify({'output': output})

def install_and_import(package):
    try:
        importlib.import_module(package)
    except ImportError:
        subprocess.run([sys.executable, '-m', 'pip', 'install', package], check=True)

# 在需要的地方调用
install_and_import('matplotlib')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
