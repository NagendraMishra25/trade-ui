import { Component, OnInit } from '@angular/core';
import { TradeService } from '../services/trade.service';
import { Stock } from '../models/stock.model';
import { finalize, delay } from 'rxjs/operators';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {

  stocks: Stock[] = [];
  isLoading = true;

  constructor(private service: TradeService) { }

  ngOnInit(): void {
    this.service.getStocks().pipe(finalize(() => this.isLoading = false)).subscribe(data => this.stocks = data);
  }

  onBuyClick(stock: Stock) {
    this.service.buyStock(stock);
  }

  onSellClick(stock: Stock) {
    this.service.sellStock(stock);
  }

}
