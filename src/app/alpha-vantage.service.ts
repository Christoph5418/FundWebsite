import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlphaVantageService {
  private apiKey = 'U5KNWDLBIIQ8AIBS';
  private apiUrl = 'https://www.alphavantage.co/query';

  constructor(private http: HttpClient) {}

  async getCurrentStockPrice(symbol: string): Promise<number> {
    const endpoint = `${this.apiUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${this.apiKey}`;
    try {
      const response: any = await this.http.get(endpoint).toPromise();
      const latestData = response['Time Series (1min)'];
      const latestTimestamp = Object.keys(latestData)[0];
      const currentPrice = parseFloat(latestData[latestTimestamp]['1. open']);
      return currentPrice;
    } catch (error) {
      console.error('Error fetching stock price:', error);
      throw error;
    }
  }

  async getClosePrice(symbol: string): Promise<number> {
    const endpoint = `${this.apiUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${this.apiKey}`;
    try {
      const response: any = await this.http.get(endpoint).toPromise();
      const latestData = response['Time Series (1min)'];
      const latestTimestamp = Object.keys(latestData)[0];
      const close = parseFloat(latestData[latestTimestamp]['4. close']);
      return close;
    } catch (error) {
      console.error('Error fetching stock price:', error);
      throw error;
    }
  }


  async getPriceFromDayAgo(symbol: string, dayAgo: number): Promise<number> {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - dayAgo);

    // Check if the target date is a Saturday (6) or Sunday (0)
    const dayOfWeek = targetDate.getDay();
    if (dayOfWeek === 6) { // Saturday
        targetDate.setDate(targetDate.getDate() - 1); // Adjust to Friday
    } else if (dayOfWeek === 0) { // Sunday
        targetDate.setDate(targetDate.getDate() - 2); // Adjust to Friday
    }

    // Format the date as "YYYY-MM-DD"
    const formattedDate = targetDate.toISOString().split('T')[0];

    // console.log(formattedDate)
    const endpoint = `${this.apiUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${this.apiKey}`;

    try {
      const response: any = await this.http.get(endpoint).toPromise();
      const dailyData = response['Time Series (Daily)'];
      const closingPrice = parseFloat(dailyData[formattedDate]['4. close']);
      return closingPrice;
    } catch (error) {
      console.error('Error fetching price from one week ago:', error);
      throw error;
    }
  }
  
}
