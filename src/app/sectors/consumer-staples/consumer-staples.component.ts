import {  Component, Input, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Chart, ChartOptions } from 'chart.js';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { DataShareService } from '../../data-share.service';
import { StockPriceService } from '../../stock-price.service';
import * as simpleStats from 'simple-statistics';

@Component({
  selector: 'app-consumer-staples',
  templateUrl: './consumer-staples.component.html',
  styleUrls: ['./consumer-staples.component.css']
})

export class ConsumerStaplesComponent {
  sector: any = "CS";
  sectorName: any = "Consumer Staples";
  sectorIndex: any = 'XLP';
  sectorNum: any = '112';


  pagData: any;
  sectorData: any[] = [];
  chart: any
  stockChart: Chart[] = []
  columnDefs: ColDef[] = [
    { field: 'Ticker' },
    { field: 'Current Price' },
    { field: 'Shares'},
    { field: 'Active Exposure'},
    { field: 'Weight' },
    // { field: 'Open Price' },
    // { field: 'Percent Change' },
  ];
  monteChart: Chart[]= []
  tableHeight = "300px";
  rowData:any = []
  historicalData: any = []
  sinHistoricalData: any =[]
  startPrice: any = []
  finalMonte: any = []

  //sets information for pie and other charts
  backgroundColor: any = ['rgb(0,51,102)','rgb(189,215,238)', 'rgb(5,91,73)', 'rgb(112,121,125)', 'rgb(0,112,192)', 'rgb(191,191,191)',
  'rgb(134,157,122)', 'rgb(212,180,131)', 'rgb(140,179,105)', 'rgb(110,103,95)', 'rgb(164,36,59)']

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, .9)', 
          
        },
        
      }
    },
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

  constructor(private sharedDataStore: DataShareService, private stockPrice: StockPriceService) { 


  }

  async ngOnInit(): Promise<void> { 
    window.scrollTo(0, 0);

    //checks if mobile
    this.isMobile = window.innerWidth < 675;

    if(this.isMobile){
      this.aspectRatio = 1.35
    }
      //gets current data
      this.pagData = this.sharedDataStore.getGSInfo();
      this.getSectorData();
  }


  private getSectorData(): void{
    //gets list of stocks only in sector
    for (let i = 0; i < this.pagData.length; i++){
      if (this.pagData[i][0] == this.sector){
        this.sectorData.push(this.pagData[i])
      }
    }
    this.setTable()
  }


  private setTable(): void{
    this.rowData = []
    
    //gets relevant data
    for (let i = 0; i < this.sectorData.length; i++){
      this.rowData.push({'Ticker': this.sectorData[i][1], 'Weight': this.sectorData[i][8], 'Current Price': this.sectorData[i][2] , 'Active Exposure': this.sectorData[i][7], 'Shares': this.sectorData[i][6], 'Percent Change': this.sectorData[i][5]})
      this.startPrice.push(parseFloat(this.sectorData[i][3].slice(1)))
      
      this.sinHistoricalData = []
   
      //gets past year of data
      for(let a = 13; a < 136; a++){
        this.sinHistoricalData.push(parseFloat(this.sectorData[i][a]))
      }
      this.historicalData.push(this.sinHistoricalData)
    }

    

    this.tableHeight = ((this.rowData.length + 1) * 43) + "px"
              
    this.setChart();
  }

  private setChart(): void{

    let newData: any = []
    let tot = 0;
    //sets default values
    this.pieChartDatasets[0].data = [ 100, 100, 100, 100, 100]

    //creates pie chart
    this.pieChartLabels = []
    for (let i =0; i<this.rowData.length; i++){
      this.pieChartLabels.push(this.rowData[i]['Ticker'])
      newData.push(parseFloat(this.rowData[i]['Weight']))
      tot +=parseFloat(this.rowData[i]['Weight']);
    }

    newData = newData.map(function(element: number){
      return element/tot * 100
    });
    
    this.pieChartDatasets[0].data = newData

    this.setLine()

  }

  private setLine(): void{

    let index: any[] = [];
    let final: any[] = [];
    let sumA = Array(this.historicalData[0].length).fill(0)
    let tot = 0;


    //gets total amount of earned per stock
    for(let a = 0; a < this.historicalData.length; a++){
      tot += this.historicalData[a][0] * this.rowData[a]['Shares']

      for(let b = 0; b < this.historicalData[0].length; b++){
        sumA[b] += (this.historicalData[a][b] - this.historicalData[a][0]) * this.rowData[a]['Shares']
      }
    }


    //normalizes it
    for(let i = 0; i < sumA.length; i++){
      final.push(sumA[i]/tot + 1)
      index.push((parseFloat(this.pagData[parseFloat(this.sectorNum)][i])-parseFloat(this.pagData[parseFloat(this.sectorNum)][0]))/parseFloat(this.pagData[parseFloat(this.sectorNum)][0]) + 1)
    }



    //creates line graph
    let c = Array(this.historicalData[0].length).fill('')

    let canvasElement: HTMLElement | null = document.getElementById('MyChart');

    if(canvasElement)
    {
      canvasElement.id = `MyChart${this.sectorName}`
    }

    

    this.chart = new Chart("MyChart" + this.sectorName, {
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
            label: this.sectorIndex,
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
        aspectRatio: 2
      }
              
    });



    let arr: any[] = []
    

    for(let i = 0; i < 12; i++){
      arr.push(document.getElementById(`${i}`));
      if(arr[i]){
        arr[i].id = `${i}+${this.sectorName}`
      }
    }


    for(let i = 0; i < this.historicalData.length; i++)
      {
       
      let chart =  new Chart(`${i}+${this.sectorName}`, {
        type: 'line', //this denotes tha type of chart
        data: {// values on X-Axis
          labels: c.slice(0, 123), 
            datasets: [
            {
              // label: this.rowData1[i]['Ticker'],
              data: this.historicalData[i].slice(0, 123), // Slice the 'final' array to get the first 53 elements

              backgroundColor: this.pieChartDatasets[0].backgroundColor[i],
              borderColor: this.pieChartDatasets[0].backgroundColor[i],
              pointRadius: 0,
              cubicInterpolationMode: 'default',
              pointBackgroundColor: this.pieChartDatasets[0].backgroundColor[i]
            },
          ]
        },
        options: {
          scales: {
            x: {
              grid: {
                display: true,
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
              display: false,
              labels: {
                color: 'white', // Legend label color
                
                font: {
                  size: 14,
                }
              },
            },
            title: { // This section is for the title
              display: true,
              text: this.rowData[i]['Ticker'],
              font: {
                size: 20, // Set the font size for the title
                weight: 'bold' // Optional: Set the font weight for the title
              },
              color: 'white', // Set the title color
              padding: {top: 10, bottom: 30} // Optional: Set padding around the title
            }
          },
          elements: {
            
          },
          aspectRatio: 1.25
        }
                
      });
      
      this.stockChart.push(chart)
    }

    this.setMonteCarlo()
  }

  async setMonteCarlo(): Promise<void>{
    
    //calculations for monteCarlo
    let final: any = []

    for(let i = 0; i < this.rowData.length; i++){

      final = []

      let ticker = this.rowData[i]['Ticker']
      let log_returns:any = []

      let stockData:any = await this.stockPrice.getStockData(ticker.replace(/\./g, '-'))

      for(let i = 0; i < stockData.length - 1; i++){
        log_returns.push(Math.log( 1 + ((stockData[i+1]['Adj Close'] - stockData[i]['Adj Close'])/ stockData[i]['Adj Close'])))
      }

      let logSD = this.calculateStandardDeviation(log_returns)
      let logMean = this.calculateMean(log_returns)
  
      let drift = logMean - .5 * logSD * logSD;
  
      let temp: any = []

      for(let a = 0; a < 10; a++){
        temp = []
        for(let i = 0; i < 365; i++){
          temp.push(Math.exp(drift + logSD*simpleStats.probit(Math.random())))
        }
        final.push(temp)
      }
  
      for(let i = 0; i < 10; i++){
        final[i][0] = stockData[stockData.length - 1]['Adj Close'];
      }
  
      for(let a = 0; a < 10; a++){
        for(let i = 1; i < 365; i++){
          final[a][i] = final[a][i] * final[a][i-1]
        }    
      }


      this.finalMonte.push(final)
    }

    this.displayMonte();



  }

  private displayMonte(): void{
    //dispalys monteCarlo
    let arr: any[] = []

    for(let i = 0; i < this.finalMonte.length; i++){


      arr.push(document.getElementById(`${i + 12}`));

      if(arr[i]){
        arr[i].id = `${i + 12}+${this.sectorName}`
      }

      let datasets:any = []

      for (let a = 0; a < this.finalMonte[i].length; a++) {
        if (this.finalMonte[i][a] !== null) {
          datasets.push(this.generateDataset.call(this, i, a, this.backgroundColor[a]));
        }
      }




      let c = Array(this.finalMonte[0][0].length).fill('')



      this.monteChart.push(new Chart(`${i + 12}+${this.sectorName}`, {
        type: 'line', //this denotes tha type of chart

        data: {// values on X-Axis
          labels: c.slice(0, 365), 
            datasets: datasets
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
              display: false,
              labels: {
                
                color: 'white', // Legend label color
                font: {
                  size: 14,
                }
              },
            },
            title: { // This section is for the title
              display: true,
              text: this.rowData[i]['Ticker'],
              font: {
                size: 20, // Set the font size for the title
                weight: 'bold' // Optional: Set the font weight for the title
              },
              color: 'white', // Set the title color
              padding: {top: 10, bottom: 30} // Optional: Set padding around the title
            }
          },
          elements: {
            
          },
          aspectRatio: 2
        }
                
      }))
    
    }


  
  }


  private generateDataset(iter:any, index:any, color:any):any {

    return {
      data: this.finalMonte[iter][index].slice(0, 365),
      backgroundColor: color,
      borderColor: color,
      pointRadius: 0,
      cubicInterpolationMode: 'default',
      pointBackgroundColor: color
    };
  }


  private calculateMean(numbers: number[]): number {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / numbers.length;
    return mean;
  }
  
  private calculateStandardDeviation(numbers: number[]): number {
    const mean = this.calculateMean(numbers);
    const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
    const variance = this.calculateMean(squaredDifferences);
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
  }

}
