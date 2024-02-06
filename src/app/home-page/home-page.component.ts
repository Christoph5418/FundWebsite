import {  Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { StockFetchingService } from 'src/app/stock-fetching.service';
import { Chart, ChartOptions } from 'chart.js';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DataShareService } from '../data-share.service';
import { StockPriceService } from '../stock-price.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  
    pagData: any;
    sectorData: any[] = [];
    chart: any
    columnDefs: ColDef[] = [
      { field: 'Ticker' },
      { field: 'Current Price' },
      { field: 'Shares'},
      { field: 'Active Exposure'},
      { field: 'Weight' },
      // { field: 'Open Price' },
      // { field: 'Percent Change' },
    ];
  
    tableHeight = "300px";
  
    rowData:any = []
    historicalData: any = []
    sinHistoricalData: any =[]
    startPrice: any = []
    movers:any = [];
    beta:any= ''

    private subscriptions: Subscription[] = [];
  
    //sets chart options and placeholders
    public pieChartOptions: ChartOptions<'pie'> = {
      responsive: false,
      plugins: {
        legend: {
          labels: {
            color: 'rgba(255, 255, 255, .9)', 
          },
        }
      }
    };
    public pieChartLabels = [ [ 'Placeholder' ], [ 'Placeholder' ], 'Placeholder' ];
    public pieChartDatasets = [
      {
        data: [300, 500, 100],
        backgroundColor: ['rgb(0,51,102)','rgb(189,215,238)', 'rgb(5,91,73)', 'rgb(112,121,125)', 'rgb(0,112,192)', 'rgb(191,191,191)',
                          'rgb(134,157,122)', 'rgb(212,180,131)', 'rgb(140,179,105)', 'rgb(110,103,95)', 'rgb(164,36,59)'],
      },
    ];
    public pieChartLegend = true;
    public pieChartPlugins = [];
    aspectRatio: number = 2;
    isMobile: boolean = false;
    constructor(private router: Router, private sharedDataStore: DataShareService) { 

      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });

    }
  
  

    ngOnInit(): void { 
      //checks if mobile
      this.isMobile = window.innerWidth < 675;

      if(this.isMobile){
        this.aspectRatio = 1.35
      }
      
      //gets current data
      this.pagData = this.sharedDataStore.getDataFromLocalStorage();
      this.getSectorData();
  }
 
    private getSectorData(): void{

      //gets value of beta
      console.log(this.pagData)
      this.beta = this.pagData[108][0]

      //gets all of the data from each sector
      for (let i = 0; i < this.pagData.length; i++){
        if (['COM', 'CD', 'CS', 'E', 'FIN', 'H', 'IND', 'IT', 'MAT', 'RE', 'U'].includes(this.pagData[i][0])){
          this.sectorData.push(this.pagData[i])
        }
      }
      this.setTable()
    }
  
    private setTable(): void{
      this.rowData = []
  
      //gets relevant info from pag
      for (let i = 0; i < this.sectorData.length; i++){
        this.rowData.push({'Ticker': this.sectorData[i][1], 'Weight': this.sectorData[i][8], 'Current Price': this.sectorData[i][2] , 'Active Exposure': this.sectorData[i][7], 'Shares': this.sectorData[i][6], 'Percent Change': this.sectorData[i][5]})
        this.startPrice.push(parseFloat(this.sectorData[i][3].slice(1)))
        
        this.sinHistoricalData = []
  
        //gets historical data of each day
        for(let a = 13; a < 135; a++){
          this.sinHistoricalData.push(parseFloat(this.sectorData[i][a]))
        }
        this.historicalData.push(this.sinHistoricalData)


      }

      this.tableHeight = "400px"
          
      
      let moveMuch:any = Array(7).fill(0)



      //gets the 7 most volatile stocks of the day
      for(let i = 0; i < this.rowData.length; i++){
        if(Math.abs(parseFloat(this.rowData[i]['Percent Change'])) > moveMuch[0]){
          moveMuch[0] = Math.abs(parseFloat(this.rowData[i]['Percent Change']));
          
        }
        moveMuch.sort();
      }


      for(let i = 0; i < this.rowData.length; i++){
        if(moveMuch.includes(Math.abs(parseFloat(this.rowData[i]['Percent Change'])))){
          this.movers.push(this.rowData[i])
        }
      }
      
      this.movers = this.movers.slice(-7)


      this.setChart();
    }
  
    private setChart(): void{
  
      //creates pie chart
      let newData: any = []
      let tot = 0;
      this.pieChartDatasets[0].data = [ 100, 100, 100, 100, 100]
  
      let sectorWeight: any = Array(11).fill(0);

      const sectorIndexMap: any = {
        'COM': 0,
        'CD': 1,
        'CS': 2,
        'E': 3,
        'FIN': 4,
        'H': 5,
        'IND': 6,
        'IT': 7,
        'MAT': 8,
        'RE': 9,
        'U': 10
      }

      for(let i = 0; i < this.sectorData.length; i++){
        const sectorName = this.sectorData[i][0];
        const sectorIndex = sectorIndexMap[sectorName];
      
        if (sectorIndex !== undefined) {
          sectorWeight[sectorIndex] += parseFloat(this.sectorData[i][8]);
        }
      }
  
      this.pieChartLabels = ['COM', 'CD', 'CS', 'E', 'FIN', 'H', 'IND', 'IT', 'MAT', 'RE', 'U']
      
      this.pieChartDatasets[0].data = sectorWeight
  
      this.setLine()
  
    }
  
    private setLine(): void{
  
      //calculates total profit of NLF compared to index
      let index: any[] = [];
      let final: any[] = [];
      let sumA = Array(this.historicalData[0].length).fill(0)
      let tot = 0;
  
  
      for(let a = 0; a < this.historicalData.length; a++){
        tot += this.historicalData[a][0] * this.rowData[a]['Shares']
  
        for(let b = 0; b < this.historicalData[0].length; b++){
          sumA[b] += (this.historicalData[a][b] - this.historicalData[a][0]) * this.rowData[a]['Shares']
        }
      }
  
  
      for(let i = 0; i < sumA.length; i++){
        final.push(sumA[i]/tot + 1)
        index.push((parseFloat(this.pagData[109][i])-parseFloat(this.pagData[109][0]))/parseFloat(this.pagData[109][0]) + 1)
      }
  
  
      let c = Array(this.historicalData[0].length).fill('')
  
  
      //displays it
        this.chart = new Chart("HomeChart", {
          type: 'line', //this denotes tha type of chart
  
          data: {// values on X-Axis
            labels: c.slice(0, 122), 
              datasets: [
              {
                label: "NLF",
                data: final.slice(0, 122), // Slice the 'final' array to get the first 53 elements
  
                backgroundColor: 'rgb(43,102,194)',
                borderColor: 'rgb(43,102,194)',
                pointRadius: 0,
                cubicInterpolationMode: 'default',
                pointBackgroundColor: 'rgb(43,102,194)'
              },
              {
                label: "S&P",
                data: index.slice(0, 122), // Slice the 'final' array to get the first 53 elements
  
                backgroundColor: 'rgb(147,199,250)',
                borderColor: 'rgb(147,199,250)',
                pointRadius: 0,
                cubicInterpolationMode: 'default',
                pointBackgroundColor: 'rgb(147,199,250)'
              },
            ]
          },
          options: {
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                ticks:{
                  color: 'white',
                },
                grid: {
                  color: 'lightgray', // Grid line color
                  lineWidth: .2,
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: 'white', // Legend label color
                  font: {
                    size: 14,
                  }
                },
              },
            },
            elements: {
               
            },
            aspectRatio: this.aspectRatio
          }
                  
        });
    }
  }
  
