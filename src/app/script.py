from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, resources={r"/stock-data/*": {"origins": "http://localhost:4200"}})


def get_stock_data(symbol):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365 * 100)
    
    try:
        data = yf.download(symbol, start=start_date, end=end_date)
        return data[['Adj Close']].reset_index().to_dict(orient='records')
    except Exception as e:
        print("Error occurred:", e)
        return None

@app.route('/stock-data/<ticker>')
def get_stock_api(ticker):
    stock_data = get_stock_data(ticker)
    if stock_data:
        return jsonify(stock_data)
    else:
        return jsonify(error="Error occurred while retrieving stock data for the ticker symbol."), 500

if __name__ == '__main__':
    app.run(debug=True)