from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
from requests import get
from flask_sslify import SSLify  # Install this package if not already installed
import requests
from googleapiclient.discovery import build
from google.cloud import language

app = Flask(__name__)
sslify = SSLify(app)

CORS(app)

SPREADSHEET_ID = '1k6qrzXNFCBD_UJ9K6VqbqnYR6WkzTBVFTJ-lBE_6shU'
RANGE_NAME = 'GoogleFinance!A1:EF122'
API_KEY = 'AIzaSyCqQljJFS1e7kNPhhNHdcoCUTA4_EJsV9s'

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
    sheets = build('sheets', 'v4', developerKey=API_KEY).spreadsheets()
    result = sheets.values().get(spreadsheetId=SPREADSHEET_ID, range=RANGE_NAME).execute()
    values = result.get('values', [])

    return jsonify(values)

    r = requests.get(url)  # Use requests.get here
    if r.status_code == 200:
        data = r.text
        return data
    else:
        return jsonify(error="Error occurred while fetching data from Google Sheets."), 500

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5001, ssl_context=('/etc/letsencrypt/live/nittanylionfundportfoliorisk.com/cert.pem', '/etc/letsencrypt/live/nittanylionfundportfoliorisk.com/privkey.pem'))
     #app.run(host='0.0.0.0', port=5001)
