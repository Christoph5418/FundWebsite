import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class StockPriceService {
 private apiUrl = 'http://45.79.173.173:5001/stock-data';


  constructor(private http: HttpClient) { }

  async getStockData(ticker: string): Promise<any[][]> {
    console.log("tried at " + ticker);
    const url = `${this.apiUrl}/${ticker}`;
    console.log(url)
    try {
      const response = await this.http.get<any[]>(url).toPromise();
      console.log('got back from server')
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
