const path = require('path');
const express = require('express');
const jsonServer = require('json-server');
const server = jsonServer.create();
const dbRouter = require('./db.json');
const router = jsonServer.router(dbRouter);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// avoid CORS issues
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.use(jsonServer.rewriter({
    '**/api/stocks/get': '/stocks'
}));

server.use(function(req, res, next) {
    console.log('req >> ', req);
    console.log('req.url >> ', req.url);
    if(req.method === 'POST') {
        const data = processData(req.body.orders);
        res.json({orders: data});
    } else {
        next();
    }
});


server.use(router);
server.listen(8081, function(){
    console.log('NG Rest server is running');
});

function processData(orders) {
    return orders.map(order => {
        if(order['stockCode'] === '5 HK') {
            order['status'] = 'Rejected';
            order['error'] = 'Oops, there seems internal server error!';
        } else if(order['stockCode'] === '11 HK') {
            order['status'] = 'Rejected';
            order['error'] = 'Oops, Gateway time out error!';
        } else if(order['stockCode'] === '388 HK') {
            order['status'] = 'Rejected';
        } else {
            order['status'] = 'Booked';
            if(order['executionMode'] === 'Market') order['price'] = Math.random()*1000;
        }
        return order;
    });
}
