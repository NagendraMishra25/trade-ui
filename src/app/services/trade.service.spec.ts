import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { TradeService } from './trade.service';
import { HttpClient } from '@angular/common/http';
import { Mode, Order, Side, Status } from '../models/stock.model';

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

describe('TradeService', () => {
  let service: TradeService;
  let httpTestingController: HttpTestingController;

  const mockHttp = {get: jasmine.createSpy(), post: jasmine.createSpy()};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: HttpClient, useVaule: mockHttp}
      ]
    });
    service = TestBed.inject(TradeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get stocks successfully', () => {
    service.getStocks().subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.length).toBe(mockStocksData.length);
    });

    const req = httpTestingController.expectOne('/api/stocks/get');
    expect(req.request.method).toBe('GET');
    req.flush(mockStocksData);

    httpTestingController.verify();
  });

  it('shoud add order to list when buy', () => {
    const mockStock = {...mockStocksData[0]};
    service.buyStock(mockStock);
    service.orders$.subscribe(orders => {
      expect(orders.length).toBeGreaterThan(0);
      expect(orders[orders.length-1].side).toBe(Side.BUY);
    });
  });

  it('shoud add order to list when sell', () => {
    const mockStock = {...mockStocksData[0]};
    service.sellStock(mockStock);
    service.orders$.subscribe(orders => {
      expect(orders.length).toBeGreaterThan(0);
      expect(orders[orders.length-1].side).toBe(Side.SELL);
    });
  });

  it('should remove order from list', () => {
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
    service.buyStock(mockStock);
    service.removeOrders([{...mockOrder}])
    service.orders$.subscribe(orders => {
      expect(orders).toBeTruthy();
    })
  });

  it('should book order successfully', () => {
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
    const mockSelectedOrders = [{...mockOrder}];
    service.bookOrders([...mockSelectedOrders]);

    const req = httpTestingController.expectOne('/api/stocks/book');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.orders.length).toBeGreaterThan(0);
    req.flush([...mockSelectedOrders.map(od => {od.status = Status.BOOKED; return od;})]);

    httpTestingController.verify();
  });
});
