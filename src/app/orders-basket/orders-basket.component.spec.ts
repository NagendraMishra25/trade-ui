import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Mode, Order, Side, Status } from '../models/stock.model';
import { TradeService } from '../services/trade.service';

import { OrdersBasketComponent } from './orders-basket.component';

const mockStocksData = [
  {
    "stockId": "7f5f0946-1144-472a-b14e-61bb39a7d976",
    "currency": "HKD",
    "ric": "0434.HK",
    "bloombergTicker": "434 HK",
    "bloombergTickerLocal": "434 HK",
    "name": "Boyaa Interactive International Ltd",
    "country": "Hong Kong",
    "price": 500.24
  },
  {
    "stockId": "cfcb2aab-0ae6-4a9a-8acd-4e931e768553",
    "currency": "HKD",
    "ric": "3618.HK",
    "bloombergTicker": "3618 HK",
    "bloombergTickerLocal": "3618 HK",
    "name": null,
    "country": null,
    "price": 74.63
  }
];

describe('OrdersBasketComponent', () => {
  let component: OrdersBasketComponent;
  let fixture: ComponentFixture<OrdersBasketComponent>;
  let service: TradeService;

  const ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  const mockTradeService = {
    orders: [],
    orderCount: 0,
    orders$: ordersSubject.asObservable(),
    getStocks: jasmine.createSpy(),
    buyStock: jasmine.createSpy(),
    sellStock: jasmine.createSpy(),
    removeOrders: jasmine.createSpy(),
    bookOrders: jasmine.createSpy()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ OrdersBasketComponent ],
      providers: [
        DecimalPipe,
        {provide: TradeService, useValue: mockTradeService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersBasketComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TradeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove order', () => {
    component.onRemoveClick();
    expect(service.removeOrders).toHaveBeenCalled();
  });

  it('should rembookove order', () => {
    component.onBookClick();
    expect(service.bookOrders).toHaveBeenCalled();
  });

  it('should select order', () => {
    const mockStock = {...mockStocksData[0]};
    const mockOrder: Order = {
      orderId: 0,
      status: Status.NOT_READY,
      side: Side.SELL,
      stockCode: mockStock.bloombergTicker,
      executionMode: Mode.MARKET,
      currency: mockStock.currency,
      stock: mockStock
    };

    component.onCheckClick({target: {checked: true}} as any, mockOrder);
    expect(component.selectedOrders.length).toBeGreaterThan(0);
  })
});
