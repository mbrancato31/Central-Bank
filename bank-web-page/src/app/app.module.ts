import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransfersComponent } from './transfers/transfers.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TopbarComponent,
    MainPageComponent,
    TransfersComponent,
    TransactionsComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
