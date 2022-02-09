import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersBasketComponent } from './orders-basket/orders-basket.component';
import { StockListComponent } from './stock-list/stock-list.component';

const routes: Routes = [
  {path: '', redirectTo: '/stock-list', pathMatch: 'full'},
  {path: 'stock-list', component: StockListComponent},
  {path: 'orders-basket', component: OrdersBasketComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
