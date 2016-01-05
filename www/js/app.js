angular.module('eezeestocksApp',
[
  'ionic',
  'eezeestocksApp.services',
  'eezeestocksApp.controllers',
  'eezeestocksApp.filters',
  'nvd3',
  'nvChart'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.stocklist', {
    url: '/stocks',
    views: {
      'menuContent': {
        templateUrl: 'templates/stocklist.html',
        controller: 'StocklistCtrl'
      }
    }
  })

  .state('app.stock', {
    url: '/stocks/:stockTicker',
    views: {
      'menuContent': {
        templateUrl: 'templates/stock.html',
        controller: 'StockCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/stocks');
});
