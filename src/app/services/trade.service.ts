import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, pipe, throwError } from 'rxjs';
import { Stock, Order, Status, Side, Mode } from '../models/stock.model';
import { catchError, finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  private orders: Order[] = [];
  private orderCount: number = 0;
  private ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(this.orders);
  public orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) { }
 
  getStocks() : Observable<Stock[]> {
    return this.http.get<Stock[]>('/api/stocks/get', {});
  }

  buyStock(stock: Stock) {
    const order: Order = {
      orderId: this.orderCount++,
      status: Status.NOT_READY,
      side: Side.BUY,
      stockCode: stock.bloombergTicker,
      executionMode: Mode.MARKET,
      currency: stock.currency,
      stock: stock
    };
    this.orders.push(order);
    this.ordersSubject.next([...this.orders]);
  }

  sellStock(stock: Stock) {
    const order: Order = {
      orderId: this.orderCount++,
      status: Status.NOT_READY,
      side: Side.SELL,
      stockCode: stock.bloombergTicker,
      executionMode: Mode.MARKET,
      currency: stock.currency,
      stock: stock
    };
    this.orders.push(order);
    this.ordersSubject.next([...this.orders]);
  }

  removeOrders(selectedOrders: Order[]) {
    this.orders = this.orders.filter(order => !selectedOrders.find(od => od.orderId === order.orderId));
    this.ordersSubject.next([...this.orders]);
  }

  bookOrders(selectedOrders: Order[]) {
    this.orders = this.orders.map(order => {
      const matchOrder = selectedOrders.find(od => od.orderId === order.orderId);
      return matchOrder ? {...order, status: Status.IN_PROGRESS} : order;
    });
    this.ordersSubject.next([...this.orders]);

    this.http.post<{orders:Order[]}>('/api/stocks/book', {orders: selectedOrders})
    .pipe(
      map(resp => resp.orders),
      catchError(err => {
        this.orders = this.orders.map(order => {
          const matchOrder = selectedOrders.find(od => od.orderId === order.orderId);
          return matchOrder ? {...order, status: Status.REJECTED, error: 'Oops, Its failed to process!'} : order;
        });
        this.ordersSubject.next([...this.orders]);
        return throwError(err);
      })
    )
    .subscribe(respOrders => {
      console.log('respOrders >> ', respOrders);
      this.orders = this.orders.map(order => {
        const matchOrder = respOrders.find(od => od.orderId === order.orderId);
        return {...order, ...matchOrder};
      });
      this.ordersSubject.next([...this.orders]);
    });
  }

}
