from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
from requests import get
import requests
import csv
from io import StringIO

app = Flask(__name__)


CORS(app)

# gets stock data from yahoo finance
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
    
@app.route('/sheets')
def get_sheets():
    url = 'https://docs.google.com/spreadsheets/d/1k6qrzXNFCBD_UJ9K6VqbqnYR6WkzTBVFTJ-lBE_6shU/export?format=tsv&id=1k6qrzXNFCBD_UJ9K6VqbqnYR6WkzTBVFTJ-lBE_6shU&gid=372495094'
    r = requests.get(url)
    if r.status_code == 200:
        data = r.text

        # Use StringIO to turn the text data into a file-like object
        tsv_data = StringIO(data)

        # Parse the TSV data
        reader = csv.reader(tsv_data, delimiter='\t')

        # Convert reader to a list of lists (2D array)
        data_2d_array = [row for row in reader]
        
        return jsonify(data_2d_array)
    else:
        return jsonify(error="Error occurred while fetching data from Google Sheets")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

