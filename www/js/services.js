(function(){

  function stocklistDataService($q, $http) {

        function yahooQuotesServiceURL(symbol){
          return 'http://finance.yahoo.com/webservice/v1/symbols/' + symbol + '/quote?format=json&view=detail';
        }

        function yahooQuotesDetailsServiceURL(symbol){
          return 'http://query.yahooapis.com/v1/public/yql?q=' +
                  encodeURIComponent("select * from yahoo.finance.quotes where symbol IN ('" + symbol + "')") +
                  '&format=json&env=http://datatables.org/alltables.env';
        }

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

  function chartDataService ($q, $http, chartDataCacheService) {

    function yahooHistoricalDataURL(symbol, startDate, endDate) {
      return  'http://query.yahooapis.com/v1/public/yql?q=' +
              encodeURIComponent(
                'select * from yahoo.finance.historicaldata where symbol = "' + symbol +
                '" and startDate = "' + startDate +
                '" and endDate = "' + endDate + '"'
              ) +
              '&format=json&env=http://datatables.org/alltables.env';
    }

    function getHistoricalData(ticker, startDate, endDate) {

      var chartDataCache = chartDataCacheService.get(ticker);

      var deferred = $q.defer();

      if ( chartDataCache) {
        deferred.resolve(chartDataCache);
      } else {
        $http
        .get(yahooHistoricalDataURL(ticker, startDate, endDate))
        .success(function(response){
          var history = response.query.results.quote;
          var priceData = [], volumeData = [];

          history.forEach(function(dayData){
            var date = Date.parse(dayData.Date);
            var price = parseFloat(Math.round(dayData.Close * 100) / 100).toFixed(3);
            var volume = dayData.Volume;

            volumeData.push([date ,volume]);
            priceData.push([date ,price]);
          });

          var chartData = {priceData: priceData, volumeData: volumeData};
          deferred.resolve(chartData);
          chartDataCacheService.put(ticker, chartData)
        })
        .error(function(error){
          deferred.reject(error);
        });
      }

      return deferred.promise;
    }

    return {
      getHistoricalData : getHistoricalData
    };
  }

  function chartDataCacheService(cacheFactory) {
    var cacheId = 'chartDataCache';

    var chartDataCache;

    if (!cacheFactory.get(cacheId)){
      chartDataCache = cacheFactory(cacheId, {
        maxAge: 60 * 60 * 8 * 1000,
        deleteOnExpire: 'aggressive',
        storageMode: 'localStorage'
      });
    } else {
      chartDataCache = cacheFactory.get(cacheId);
    }

    return chartDataCache;
  }

  angular.module('eezeestocksApp.services', [])
  .factory('ChartDataCacheService', ['CacheFactory',chartDataCacheService])
  .factory('StocklistData', ['$q','$http', stocklistDataService])
  .factory('ChartDataService', ['$q','$http','ChartDataCacheService',chartDataService]);

}());
