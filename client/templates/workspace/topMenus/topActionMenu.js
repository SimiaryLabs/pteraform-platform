angular.module('pteraform-platform').directive('topActionMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/topMenus/top-action-menu.html',
    controllerAs: 'topActionMenu',
    controller: function($scope, $reactive, $stateParams, $state, $mdBottomSheet, $mdSidenav, $mdDialog) {
      $reactive(this).attach($scope);

  }
}
});
