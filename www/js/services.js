angular.module('eezeestocksApp.services', [])
.factory('StocklistData', function(){

  var stocks = [
    { ticker: 'AAPL'},
    { ticker: 'GPRO'},
    { ticker: 'FB'},
    { ticker: 'NFLX'},
    { ticker: 'TSLA'},
    { ticker: 'BRK-A'}
  ];

  var stocklistData = {};
  stocklistData.stocks = stocks;

  stocklistData.getStockByTicker = function(stockTicker){
    for ( var i=0; i < stocks.length; i++){
      if ( stocks[i].ticker == stockTicker){
        return stocks[i];
      }
    }

    return {};
  };

    return stocklistData;
});
