import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { Mode, Order, Status } from '../models/stock.model';
import { TradeService } from '../services/trade.service';

@Component({
  selector: 'app-orders-basket',
  templateUrl: './orders-basket.component.html',
  styleUrls: ['./orders-basket.component.css']
})
export class OrdersBasketComponent implements OnInit, OnDestroy {

  unsubscribe$: ReplaySubject<Boolean> = new ReplaySubject<Boolean>(1);
  orders: Order[] = [];
  selectedOrders: Order[] = [];

  constructor(private service: TradeService, private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.service.orders$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => this.orders = data);
  }

  onRemoveClick() {
    this.service.removeOrders(this.selectedOrders);
    this.selectedOrders = [];
  }

  onBookClick() {
    this.service.bookOrders(this.selectedOrders);
    this.selectedOrders = [];
  }

  onCheckClick(event: Event, order: Order) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked) this.selectedOrders.push(order)
    else this.selectedOrders = this.selectedOrders.filter(od => od.orderId !== order.orderId);
  }

  onModeChange(event: Event, order: Order) {
    order.executionMode = (event.target as HTMLSelectElement).value as Mode;
    if(order.executionMode === Mode.MARKET) order.price = undefined;
    this.checkOrderReady(order)
  }

  onPriceChange(event: Event, order: Order) {
    order.price = +(event.target as HTMLInputElement).value;
    this.checkOrderReady(order);
  }

  onQuantityChange(event: Event, order: Order) {
    order.quantity = +(event.target as HTMLInputElement).value;
    this.checkOrderReady(order);
  }

  isBookingNotAllowed() {
    return this.selectedOrders.length === 0 || this.selectedOrders.some(order => order.status === Status.NOT_READY || order.status === Status.BOOKED);
  }

  checkOrderReady(order: Order) {
    const isReady = order.side && order.stockCode && (order.executionMode === Mode.LIMIT ? order.price > 0 : true) && order.currency && order.quantity > 0;
    if(isReady) order.status = Status.READY;
    else order.status = Status.NOT_READY;
  }

  shouldDisable(order: Order) {
    return order.status === Status.IN_PROGRESS || order.status === Status.BOOKED || order.status === Status.REJECTED;
  }

  formatNumber(value: number) {
    return (value || value === 0) ? this.decimalPipe.transform(value, '1.0-2') : '';
  }

  getStatusClass(status: Status) {
    switch(status) {
      case Status.NOT_READY: return 'badge bg-warning';
      case Status.READY: return 'badge bg-primary';
      case Status.IN_PROGRESS: return 'bg bg-info';
      case Status.BOOKED: return 'badge bg-success';
      case Status.REJECTED: return 'badge bg-danger';
      default:
        return 'badge bg-primary';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

}
