import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StockPriceService } from './stock-price.service';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  private storageKey = 'myArrayData';


  private sharedVariableSubject = new BehaviorSubject<string>('HOME'); // Initialize with 'HOME'
  
  sharedVariable$ = this.sharedVariableSubject.asObservable();

  stockInfo: any
  constructor(private stockPriceService: StockPriceService) { }

  yearInfo: any = [];
  stockDataInfo: any[] = []

  
  setGSInfo(data: any): void{
    this.stockInfo = data
  }

  getGSInfo(): any{
    return this.stockInfo
  }

  public saveDataToLocalStorage(data: string[][]): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.storageKey, serializedData);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  public getDataFromLocalStorage(): string[][] | null {
    try {
      const serializedData = localStorage.getItem(this.storageKey);
      return serializedData ? JSON.parse(serializedData) : null;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  }


}
