angular.module('pteraform-platform').directive('topMenu', function(activeProjects) {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/topMenus/top-menu.html',
    controllerAs: 'topMenu',
    controller: function($scope, $reactive, $stateParams, $state, $mdBottomSheet, $mdSidenav, $mdDialog) {
      $reactive(this).attach($scope);
      $scope.activeProjects = activeProjects.projects;

      this.currentUser = () => { return Meteor.user(); };

      this.isLoggedIn = () => {
          return Meteor.userId() !== null;
      };
      this.logout = () => {
        Accounts.logout();
        $state.go('welcome');
      };
    }
  }
});
