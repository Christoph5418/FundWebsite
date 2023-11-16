import { Component, OnInit } from '@angular/core';
import { DataShareService } from './data-share.service';
import { StockFetchingService } from './stock-fetching.service';
import { StockPriceService } from './stock-price.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'fund';

  page:any = 'HOME'
  pagData: any

  constructor(private sharedDataStore: DataShareService, private stockFetchingService: StockFetchingService, private stockPrice: StockPriceService) { }

  ngOnInit(): void{
    this.pagData = this.sharedDataStore.getDataFromLocalStorage();
    this.sharedDataStore.setGSInfo(this.pagData);


    //dont get it from pag until end


    this.sharedDataStore.sharedVariable$.subscribe(data => {
      this.page = data;
    });  

    this.stockFetchingService.fetchDataFromGoogleSheets().subscribe(data => {
      this.pagData = data;
      this.sharedDataStore.saveDataToLocalStorage(this.pagData);      
   });  
    

  }

  
}
