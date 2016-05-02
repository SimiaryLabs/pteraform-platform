angular.module('pteraform-platform').directive('leftMenuExtension', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/leftMenus/left-menu-extension.html',
    controllerAs: 'leftMenuExtension',
    controller: function($scope, $reactive, $stateParams, $state, $mdBottomSheet, $mdSidenav, $mdDialog, workspaceService) {
      $reactive(this).attach($scope);

      $scope.$watch(function () {
         return workspaceService.leftMenuContent;
       },
        function(newVal, oldVal) {
          $scope.leftMenuContent = newVal;
      }, true);

      $scope.corpusList = "corpusList";
  }
}
});
