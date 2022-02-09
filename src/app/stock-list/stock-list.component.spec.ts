import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Order } from '../models/stock.model';
import { TradeService } from '../services/trade.service';

import { StockListComponent } from './stock-list.component';

const mockStock = {
  "stockId": "7f5f0946-1144-472a-b14e-61bb39a7d976",
  "currency": "HKD",
  "ric": "0434.HK",
  "bloombergTicker": "434 HK",
  "bloombergTickerLocal": "434 HK",
  "name": "Boyaa Interactive International Ltd",
  "country": "Hong Kong",
  "price": 500.24
}

describe('StockListComponent', () => {
  let component: StockListComponent;
  let fixture: ComponentFixture<StockListComponent>;
  let service: TradeService;

  const ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  const mockTradeService = {
    orders: [],
    orderCount: 0,
    orders$: ordersSubject.asObservable(),
    getStocks: jasmine.createSpy().and.returnValue(of([])),
    buyStock: jasmine.createSpy(),
    sellStock: jasmine.createSpy(),
    removeOrders: jasmine.createSpy(),
    bookOrders: jasmine.createSpy()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ StockListComponent ],
      providers: [
        {provide: TradeService, useValue: mockTradeService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TradeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add stock in order when buy stock', () => {
    component.onBuyClick({...mockStock});
    expect(service.buyStock).toHaveBeenCalled();
  });

  it('should add stock in order when sell stock', () => {
    component.onSellClick({...mockStock});
    expect(service.sellStock).toHaveBeenCalled();
  });
});
