import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockPriceService {
  private apiUrl = 'http://127.0.0.1:5000/stock-data';

  constructor(private http: HttpClient) { }

  async getStockData(ticker: string): Promise<any[][]> {
    const url = `${this.apiUrl}/${ticker}`;
    try {
      const response = await this.http.get<any[]>(url).toPromise();
      // Assuming the response is a 2D array, return it directly
      return response as any[][];
    } catch (error) {
      console.error('Error occurred while retrieving stock data:', error);
      throw error; // Rethrow the error to be caught by the caller
    }
  }

  async getFullStockData(ticker: any[]): Promise<any[][][]> {

    let response: any = []

    for(let i = 0; i < ticker.length; i++){
      const url = `${this.apiUrl}/${ticker[i]}`;
      response.push(await this.http.get<any[]>(url).toPromise())

    }

    return response as any[][][];
    
  }



}
