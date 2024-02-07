import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AgGridModule } from 'ag-grid-angular';
import { MatTableModule } from '@angular/material/table';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SectorComponent } from './sector/sector.component';
import { StrategyComponent } from './strategy/strategy.component';
import { FormsModule } from '@angular/forms';
import { CommunicationServicesComponent } from './sectors/communication-services/communication-services.component';
import { ConsumerStaplesComponent } from './sectors/consumer-staples/consumer-staples.component';
import { EnergyComponent } from './sectors/energy/energy.component';
import { FinancialsComponent } from './sectors/financials/financials.component';
import { HealthcareComponent } from './sectors/healthcare/healthcare.component';
import { IndustrialsComponent } from './sectors/industrials/industrials.component';
import { InformationTechnologyComponent } from './sectors/information-technology/information-technology.component';
import { MaterialsComponent } from './sectors/materials/materials.component';
import { RealEstateComponent } from './sectors/real-estate/real-estate.component';
import { UtilitiesComponent } from './sectors/utilities/utilities.component';
import { ConsumerDiscretionaryComponent } from './sectors/consumer-discretionary/consumer-discretionary.component';

const appRoutes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'strategy', component: StrategyComponent},
  {path: 'communication-services', component: CommunicationServicesComponent},
  {path: 'consumer-discretionary', component: ConsumerDiscretionaryComponent},
  {path: 'consumer-staples', component: ConsumerStaplesComponent},
  {path: 'energy', component: EnergyComponent},
  {path: 'financials', component: FinancialsComponent},
  {path: 'healthcare', component: HealthcareComponent},
  {path: 'industrials', component: IndustrialsComponent},
  {path: 'information-technology', component: InformationTechnologyComponent},
  {path: 'materials', component: MaterialsComponent},
  {path: 'real-estate', component: RealEstateComponent},
  {path: 'utilities', component: UtilitiesComponent},
  
]


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomePageComponent,
    SectorComponent,
    StrategyComponent,
    CommunicationServicesComponent,
    ConsumerStaplesComponent,
    EnergyComponent,
    FinancialsComponent,
    HealthcareComponent,
    IndustrialsComponent,
    InformationTechnologyComponent,
    MaterialsComponent,
    RealEstateComponent,
    UtilitiesComponent,
    ConsumerDiscretionaryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule,
    MatTableModule,
    // BrowserAnimationsModule,
    NgChartsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
