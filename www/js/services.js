angular.module('eezeestocksApp.services', [])
.factory('StocklistData', function(){

  var stocks = [
    { title: 'Stock 1', id: 1 },
    { title: 'Stock 2', id: 2 },
    { title: 'Stock 3', id: 3 },
    { title: 'Stock 4', id: 4 },
    { title: 'Stock 5', id: 5 },
    { title: 'Stock 6', id: 6 }
  ];

  var stocklistData = {};
  stocklistData.stocks = stocks;

  stocklistData.getStockByTicker = function(stockTicker){
    for ( var i=0; i < stocks.length; i++){
      if ( stocks[i].id == stockTicker){
        return stocks[i];
      }
    }

    return {};
  };

    return stocklistData;
});
