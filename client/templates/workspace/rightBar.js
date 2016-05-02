angular.module('pteraform-platform').directive('rightBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/right-bar.html',
    controllerAs: 'rightBar',
    controller: function($scope, $reactive, $stateParams, $state, $mdBottomSheet, $mdSidenav, $mdDialog) {
      $reactive(this).attach($scope);

  }
}
});
