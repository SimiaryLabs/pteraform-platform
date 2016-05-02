angular.module('pteraform-platform').directive('splashWelcome', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/splashWelcome/splash-welcome.html',
    controllerAs: 'splashWelcome',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);
    }
  }
});
