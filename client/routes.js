angular.module('pteraform-platform')
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('pteraform', {
        url: '/pteraform?clp&dlp',
        //template: '<corpus-list></corpus-list>',
        template: '<workspace layout="row" style="height:100%"></workspace>',
        params: {
          clp: {
            value: '1',
            squash: true
          },
          dlp: {
            value: '1',
            squash: true
          }
        },
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('welcome', {
        url: '/welcome',
        template: '<splash-welcome></splash-welcome>'
      })
      .state('login', {
        url: '/login',
        template: '<login></login>'
      })
      .state('register', {
        url: '/register',
        template: '<register></register>'
      })
      .state('resetpw', {
        url: '/resetpw',
        template: '<resetpw></resetpw>'
      })
      .state('verify-email', {
        url: '/verify-email/:token',
        onEnter: function ($state, $stateParams) {
          Accounts.verifyEmail($stateParams.token, (err) => {
            if (err) {
              $state.go('welcome');
            } else {
              $state.go('pteraform');
            }
          });
        }
      });

    $urlRouterProvider.otherwise( function( $injector, $location ) {
      if (Meteor.userId() == null) {
        return "/welcome";
      } else {
        return "/pteraform";
      }
    });
  }).run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
        $state.go('welcome');
      } else {
        $state.go('pteraform');
      }
    });
  });
