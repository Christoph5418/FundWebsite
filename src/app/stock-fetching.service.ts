import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockFetchingService {
    private googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-ovEH2cjjx4p1cj49SLwRWZAA8coXB_RLsdxqbzT1AcWpxY5DU4zbamRptFjUcbgmjSqXqM7kKhLK/pub?output=tsv&gid=372495094';

  constructor(private http: HttpClient) { }

  fetchDataFromGoogleSheets(): Observable<any[]> {
    return this.http.get(this.googleSheetsUrl, { responseType: 'text' }).pipe(
      map((tsvData: string) => {
        return this.parseTSV(tsvData);
      })
    );
  }

  private parseTSV(tsvData: string): any[] {
    const lines = tsvData.split('\n');
    const result: any[] = [];
    const headers = lines[0].split('\t'); // Use '\t' as the separator
    let sect: any[] = []
    for (let i = 0; i < lines.length; i++) {
      result.push(lines[i].split('\t'))
    }

    return result;
  }
}
