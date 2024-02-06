import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataShareService } from './data-share.service';
import { StockFetchingService } from './stock-fetching.service';
import { StockPriceService } from './stock-price.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'fund';
  page: any = 'HOME';
  pagData: any;
  private subscriptions: Subscription[] = [];


  // constructor(
  //   private sharedDataStore: DataShareService,
  //   private stockFetchingService: StockFetchingService,
  // ) { }

  ngOnInit(): void {
    // Gets data from browser cache if possible
   // this.pagData = this.sharedDataStore.getDataFromLocalStorage();

    // Sets the info for all components
   // this.sharedDataStore.setGSInfo(this.pagData);

    // Subscription to get page to display
    // const pageSubscription = this.sharedDataStore.sharedVariable$.subscribe(data => {
    //   this.page = data;
    // });
    //this.subscriptions.push(pageSubscription);

  //   const stockSub = this.stockFetchingService.fetchDataFromGoogleSheets().subscribe(data => {
  //     this.pagData = data;
  //  //   this.sharedDataStore.saveDataToLocalStorage(this.pagData); 
  //     console.log(this.pagData)     
  //     console.log('test')
  //  });  
  
  //  this.subscriptions.push(stockSub);
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}