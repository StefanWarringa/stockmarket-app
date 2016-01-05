(function(){

  function applicationController($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  }

  function stockListController($scope, StocklistData) {
    $scope.stocks = StocklistData.stocks;
  }

  function stockController($scope, $stateParams, $filter, StocklistData, chartDataService) {

    // See: https://raw.githubusercontent.com/j3ko/nv-chart/master/examples/linePlusBarWithFocusChart.html
    var xTickFormat = function(d) {
      var dx = $scope.chartData[0].values[d] && $scope.chartData[0].values[d].x || 0;
      if (dx > 0) {
        return d3.time.format('%x')(new Date(dx));
      }
      return null;
    };

    var x2TickFormat = function(d) {
      var dx = $scope.chartData[0].values[d] && $scope.chartData[0].values[d].x || 0;
      return d3.time.format('%x')(new Date(dx));
    };

    var y1TickFormat = function(d) {
      return d3.format(',f')(d);
    };

    var y2TickFormat = function(d) {
      return '$' + d3.format(',.2f')(d);
    };

    var y3TickFormat = function(d) {
      return d3.format(',f')(d);
    };

    var y4TickFormat = function(d) {
      return '$' + d3.format(',.2f')(d);
    };

    var xValueFunction = function(d, i) {
      return i;
    };


    var chartOptions = {
      chartType: 'linePlusBarWithFocusChart',
      data: 'chartData',
      color: d3.scale.category10().range(),
      margin: {
        top: 30,
        right: 60,
        bottom: 50,
        left: 70
      },
      useInteractiveGuideline: true,
      xValue: xValueFunction,
      xAxisTickFormat: xTickFormat,
      x2AxisTickFormat: x2TickFormat,
      y1AxisTickFormat: y1TickFormat,
      y2AxisTickFormat: y2TickFormat,
      y3AxisTickFormat: y3TickFormat,
      y4AxisTickFormat: y4TickFormat,
      transitionDuration: 500
    };


    function getPriceData(ticker){
      $scope.stock =
        StocklistData
        .getStockByTicker(ticker)
        .then(function(stockquote){
          $scope.pricedata = stockquote;
        });
    }

    function getDetailsData(ticker){
      $scope.stock =
        StocklistData
        .getStockDetails(ticker)
        .then(function(stockdetails){
          $scope.marketdata = stockdetails;
        });
    }

    function getChartData(ticker) {
      var currentDate = $filter('date')(new Date(),'yyyy-MM-dd');
      var oneYearAgo = $filter('date')(new Date().setDate(new Date().getDate() - 365),'yyyy-MM-dd');

      chartDataService
      .getHistoricalData(ticker,oneYearAgo,currentDate)
      .then(function(dataSeries){
        var volumeData = []; volumeData.push(dataSeries.volumeData);
        var priceData = []; priceData.push(dataSeries.priceData);

        $scope.chartData = [
    			{
    				key : "volume" ,
    				bar: true,
    				values : dataSeries.volumeData
    			},
    			{
    				key : "ticker" ,
    				values : dataSeries.priceData
    			}
        ].map(function(series) {
  				series.values = series.values.map(function(d) {
            return {x: d[0], y: d[1] };
          });
  				return series;
  			});

        $scope.chartOptions = chartOptions;

        //console.log($scope.chartData);
      });
    }

    $scope.$on("$ionicView.afterEnter", function(){
      var ticker = $stateParams.stockTicker;

      $scope.ticker = ticker;
      $scope.chartview = 1;
      getPriceData(ticker);
      getDetailsData(ticker);
      getChartData(ticker);
    });
  }


angular.module('eezeestocksApp.controllers', [])
  .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', applicationController])
  .controller('StocklistCtrl', ['$scope', 'StocklistData', stockListController])
  .controller('StockCtrl', ['$scope', '$stateParams', '$filter', 'StocklistData', 'ChartDataService', stockController]);
}());
