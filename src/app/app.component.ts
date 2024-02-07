import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataShareService } from './data-share.service';
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


  private apiUrl = 'http://172.16.33.178:5001/sheets';

  constructor(
    private sharedDataStore: DataShareService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    const fetchDataSubscription = this.fetchData().subscribe(data => {
      let twoDArray: any[][] = [];
      this.pagData = data;

      data.forEach((obj: { [x: string]: any; }) => {
        let row: any[] = [];
        // Iterate over each key in the object
        Object.keys(obj).forEach(key => {
            // Push the value of each key into the row array
            row.push(obj[key]);
        });
        // Push the row array into the two-dimensional array
        twoDArray.push(row);
    });
    console.log(twoDArray);
  
      this.sharedDataStore.setGSInfo(data);
    }, error => {
      console.error('Error fetching data:', error);
    }); 

    this.subscriptions.push(fetchDataSubscription);

    // Gets data from browser cache if possible
   this.pagData = this.sharedDataStore.getDataFromLocalStorage();

    // Sets the info for all components
   this.sharedDataStore.setGSInfo(this.pagData);

    // Subscription to get page to display
    const pageSubscription = this.sharedDataStore.sharedVariable$.subscribe(data => {
      this.page = data;
    });
    this.subscriptions.push(pageSubscription);

  //   const stockSub = this.stockFetchingService.fetchDataFromGoogleSheets().subscribe(data => {
  //     this.pagData = data;
  //    this.sharedDataStore.saveDataToLocalStorage(this.pagData); 
  //     console.log(this.pagData)     
  //     console.log('test')
  //  });  

  //  this.subscriptions.push(stockSub);
  }


  fetchData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}