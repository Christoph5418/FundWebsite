import { Component, OnInit } from '@angular/core';
import { StockPriceService } from '../stock-price.service';
import { FormsModule } from '@angular/forms';
import * as simpleStats from 'simple-statistics';
import { Chart } from 'chart.js';



interface ScatterDataPoint {
  x: number;
  y: number;
  label: string;
}




@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css']
})
export class StrategyComponent implements OnInit {

  frontiersName: any = [];
  frontiersData: any = []

  inputDisabled: boolean = false;
  ticker: string = '';
  tickerFrontier: string = ''
  stockRevenue: string = '';
  stockSigma: string = '';
  cogsSigma: string = '';
  cogsPercent: string = '';
  iterations: number = 10;
  grossProfit: any[] = [];
  daysAhead:number = 365
  final: any[] =[]
  chart: Chart | undefined
  chart1: Chart | undefined
  aspectRatio: number = 2;
  isMobile: boolean = false;
  errorMessage: any;
  errorMessageFrontier: any;
  addedMessage: any

backgroundColor:any = ['rgb(0,51,102)','rgb(189,215,238)', 'rgb(5,91,73)', 'rgb(112,121,125)', 'rgb(0,112,192)', 'rgb(191,191,191)',
'rgb(134,157,122)', 'rgb(212,180,131)', 'rgb(140,179,105)', 'rgb(110,103,95)', 'rgb(164,36,59)'];



  constructor(private stockPrice: StockPriceService){

  }

  ngOnInit(): void {
      
    this.isMobile = window.innerWidth < 675;

    if(this.isMobile){
      this.aspectRatio = 1.35
    }
  }

  async monteCarlo(): Promise<void>{


  
    this.ticker = this.ticker.replace(/\./g, '-');
    this.ticker = this.ticker.toUpperCase();
    this.final = []

    this.grossProfit = []

    let log_returns:any = []


    let stockData = await this.fetchStockData(this.ticker);

    if(stockData == undefined){
      this.errorMessage = "Please enter a valid ticker"
    }
    else if(isNaN(this.iterations)){
      this.errorMessage = "Please enter integer value for number of iterations"
    } else if (isNaN(this.daysAhead)){
      this.errorMessage = "Please enter integer value for number of days ahead"
    }
    else{
      this.errorMessage = ''
    }


    // for(let i = 0; i < this.iterations; i++){
    //   this.grossProfit.push(this.generateRandomNormal(parseFloat(this.stockRevenue), parseFloat(this.stockSigma)) - 
    //   (parseFloat(this.stockRevenue) * this.generateRandomNormal(parseFloat(this.cogsPercent), parseFloat(this.cogsSigma))))
    // }

    for(let i = 0; i < stockData.length - 1; i++){
      log_returns.push(Math.log( 1 + ((stockData[i+1]['Adj Close'] - stockData[i]['Adj Close'])/ stockData[i]['Adj Close'])))
      // log_returns.push(100*(stockData[i + 1]['Adj Close'] - stockData[i]['Adj Close'])/ stockData[i]['Adj Close']);
      // console.log(100*(stockData[i+1]['Adj Close'] - stockData[i]['Adj Close'])/ stockData[i]['Adj Close'] + ' ' + stockData[i]['Date'])
    }

    let logSD = this.calculateStandardDeviation(log_returns)
    let logMean = this.calculateMean(log_returns)

    let drift = logMean - .5 * logSD * logSD;

    let temp: any = []

    for(let a = 0; a < this.iterations; a++){
      temp = []
      for(let i = 0; i < this.daysAhead; i++){
        temp.push(Math.exp(drift + logSD*simpleStats.probit(Math.random())))
      }
      this.final.push(temp)
    }

    for(let i = 0; i < this.iterations; i++){
      this.final[i][0] = stockData[stockData.length - 1]['Adj Close'];
    }

    for(let a = 0; a < this.iterations; a++){
      for(let i = 1; i < this.daysAhead; i++){
        this.final[a][i] = this.final[a][i] * this.final[a][i-1]
      }    
    }


    this.displayMonteCarlo();

  }

  private displayMonteCarlo(): void{


    if(this.chart){
      this.chart.destroy();
    }

    let datasets:any = []
    for (let i = 0; i < this.final.length; i++) {
      if (this.final[i] !== null) {
        datasets.push(this.generateDataset.call(this, i, this.backgroundColor[i]));
      }
    }


    let c = Array(this.final[0].length).fill('')


    this.chart = new Chart("monteCarlo", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: c.slice(0, this.daysAhead), 
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
          
        },
        
        elements: {
           
        },
        aspectRatio: this.aspectRatio
      }
              
    });

    this.chart.update();
  }

  async fetchStockData(ticker: string): Promise<any> {
    try {
      let stockData = await this.stockPrice.getStockData(ticker);
      return stockData
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  }

  async addFrontier(): Promise<void>{


    this.inputDisabled = true

    this.tickerFrontier = this.tickerFrontier.replace(/\./g, '-');
    this.tickerFrontier = this.tickerFrontier.toUpperCase();



    let stockData = await this.fetchStockData(this.tickerFrontier);



    if(stockData == undefined){
      this.errorMessageFrontier = "Please enter a valid ticker"
      this.addedMessage = ""
    }
    else{
      this.errorMessageFrontier = ''
      if(!this.frontiersName.includes(this.tickerFrontier)){
        this.frontiersName.push(this.tickerFrontier);
        this.frontiersData.push(stockData)
        this.addedMessage = "Added " + this.tickerFrontier
      } else{
        this.addedMessage = this.tickerFrontier + " already added"
      }
    }

    this.inputDisabled = false


  }

  async delFrontier(): Promise<void>{

    this.errorMessageFrontier = ""
    this.tickerFrontier = this.tickerFrontier.replace(/\./g, '-');
    this.tickerFrontier = this.tickerFrontier.toUpperCase();

    for(let i = 0; i < this.frontiersName.length; i++){
      if(this.frontiersName[i] == this.tickerFrontier){
        this.addedMessage = 'Removed ' + this.tickerFrontier
        this.frontiersName.splice(i, 1);
        this.frontiersData.splice(i, 1);
      } else {
        this.addedMessage = "Could not find " + this.tickerFrontier + " to remove"
      }
    }



  }
  
  async frontier(): Promise<void> {

    if(this.chart1){
      this.chart1.destroy();
    }

    let stockData = this.frontiersData;
    let log_return: any[] = []
    let log_returns: any[] = [] 
    let logSDs: any = []
    let logMeans: any = []

    let newLog: any[] = []

    let min: any = 9999999

    for(let a = 0; a < stockData.length; a++)
    {
      for(let i = 0; i < stockData[a].length - 1; i++){
        if (min > stockData[a].length){
          min = stockData[a].length - 1;
        }

        log_return.push(Math.log((stockData[a][i+1]['Adj Close'] / stockData[a][i]['Adj Close'])))
      }

      log_returns.push(log_return)


      log_return = [];
    }


    for(let i = 0; i < log_returns.length; i++){
      newLog.push(log_returns[i].slice(-min))
      logSDs.push(this.calculateStandardDeviation(newLog[i]))
      logMeans.push(this.calculateMean(newLog[i]))
    }

    let covMat = this.covarianceMatrix(newLog)
    let weights: any;
    const scaledCovMat = this.scaleMatrix(covMat, 250);

    let returns: any = []
    let vari: any = []
    let labels: any = []
    let label: any = ''
    for(let i = 0; i < 1000; i++){
      weights = this.createWeights(newLog.length)
      for(let a = 0; a < this.frontiersName.length; a++){
        label += (this.frontiersName[a] + ': ' + weights[a].toFixed(3) + ', ')
      }
      returns.push(this.sumOfProducts(weights, logMeans) * 250)
      const intermediateResult = this.matrixVectorMultiply(scaledCovMat, weights);
      vari.push(Math.sqrt(this.dotProduct(weights, intermediateResult)));
      labels.push(label.slice(0, -2))
      label = ''
    }



        const scatterData = vari.map((volatility: any, index: string | number) => ({
          x: volatility,
          y: returns[index],
          label: labels[index]
      }));





      const ctx = document.getElementById('myChart') as HTMLCanvasElement;

      this.chart1 = new Chart(ctx, {
          type: 'scatter',
          data: {
              datasets: [{
                  label: 'Label',
                  data: scatterData,
                  backgroundColor: 'rgba(0, 123, 255, 0.5)',
                 
              }]
          },
          
          options: {
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    // Access the dataset and data index directly
                    const dataset: any = context.chart.data.datasets[context.datasetIndex];
                    const dataPoint = dataset.data[context.dataIndex];
                    return `${dataPoint?.label}`;
                }
                }
              }
            },
              scales: {
                
                  x: {
                      type: 'linear',
                      position: 'bottom',
                      title: {
                          display: true,
                          text: 'Volatility'
                      }
                  },
                  y: {
                      title: {
                          display: true,
                          text: 'Returns'
                      }
                  }
              },
              aspectRatio: this.aspectRatio
          }
      });


   




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

private generateDataset(index:any, color:any):any {
  return {
    data: this.final[index].slice(0, this.daysAhead),
    backgroundColor: color,
    borderColor: color,
    pointRadius: 0,
    cubicInterpolationMode: 'default',
    pointBackgroundColor: color
  };
}


private covariance(data1: number[], data2: number[]): number {
  const mean1 = this.calculateMean(data1);
  const mean2 = this.calculateMean(data2);
  return data1.reduce((sum, value, index) => sum + (value - mean1) * (data2[index] - mean2), 0) / (data1.length - 1);
}

private covarianceMatrix(data: number[][]): number[][] {
  let matrix: number[][] = [];
  for (let i = 0; i < data.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < data.length; j++) {
          matrix[i][j] = this.covariance(data[i], data[j]);
      }
  }
  return matrix;
}

private createWeights(n: number): number[] {
  if (n <= 0) {
      throw new Error("n must be a positive number");
  }

  let randomNumbers: number[] = [];
  for (let i = 0; i < n - 1; i++) {
      randomNumbers.push(Math.random());
  }

  // Sort the random numbers
  randomNumbers = randomNumbers.sort((a, b) => a - b);

  // Create the list with differences
  const list: number[] = [];
  let previous = 0;
  for (const current of randomNumbers) {
      list.push(current - previous);
      previous = current;
  }
  
  // Add the last element
  list.push(1 - previous);

  return list;
}

private sumOfProducts(list1: number[], list2: number[]): number {
  if (list1.length !== list2.length) {
      throw new Error("Both lists must be of the same length");
  }

  let sum = 0;
  for (let i = 0; i < list1.length; i++) {
      sum += list1[i] * list2[i];
  }

  return sum;
}

private dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
      throw new Error("Vectors must be of the same length");
  }

  return a.reduce((sum, current, index) => sum + current * b[index], 0);
}

private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
  return matrix.map(row => this.dotProduct(row, vector));
}

private scaleMatrix(matrix: number[][], scalar: number): number[][] {
  return matrix.map(row => row.map(value => value * scalar));
}

}

