angular.module('pteraform-platform').directive('leftMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/leftMenus/left-menu.html',
    replace: true,
    controllerAs: 'leftMenu',
    controller: function($scope, $reactive, $stateParams, $state, $mdBottomSheet, $mdSidenav, $mdDialog, workspaceService) {
      $reactive(this).attach($scope);

      $scope.toggleLeftSidenav = function() {
        $mdSidenav('left').toggle();
      };

      $scope.openLeftSidenav = function(menuContent) {
        $mdSidenav('left').open();
        workspaceService.leftMenuContent = menuContent;
      };

      $scope.menu = workspaceService.leftMenuTop;
      $scope.admin = workspaceService.leftMenuAdmin;


  }
}
});
