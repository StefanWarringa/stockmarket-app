(function(){

  function stocklistDataService($q, $http) {

        function yahooQuotesServiceURL(symbol){
          return 'http://finance.yahoo.com/webservice/v1/symbols/' + symbol + '/quote?format=json&view=detail';
        };

        function yahooQuotesDetailsServiceURL(symbol){
          return 'http://query.yahooapis.com/v1/public/yql?q=' +
                  encodeURIComponent("select * from yahoo.finance.quotes where symbol IN ('" + symbol + "')") +
                  '&format=json&env=http://datatables.org/alltables.env';
        };

        var stocks = [
          { ticker: 'AAPL'},
          { ticker: 'GPRO'},
          { ticker: 'FB'},
          { ticker: 'NFLX'},
          { ticker: 'TSLA'},
          { ticker: 'BRK-A'}
        ];

        function getStockByTicker(stockTicker){
          var deferred = $q.defer();

          $http
          .get(yahooQuotesServiceURL(stockTicker))
          .success(function(response){
            var quoteData = response.list.resources[0].resource.fields;
            deferred.resolve(quoteData);
          })
          .error(function(error){
            deferred.reject(error);
          });

          return deferred.promise;
        }

        function getStockDetails(stockTicker){
          var deferred = $q.defer();

          $http
          .get(yahooQuotesDetailsServiceURL(stockTicker))
          .success(function(response){
            var quoteData = response.query.results.quote;
            deferred.resolve(quoteData);
          })
          .error(function(error){
            deferred.reject(error);
          });

          return deferred.promise;
        }

        return {
          stocks : stocks,
          getStockByTicker : getStockByTicker,
          getStockDetails: getStockDetails
        };
  }

  angular.module('eezeestocksApp.services', [])
  .factory('StocklistData', stocklistDataService);

}());
