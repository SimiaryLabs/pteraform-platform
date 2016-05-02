angular.module('pteraform-platform').directive('collaboratorsMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/leftMenus/collaborators/collaborators-menu.html',  //corpusList/corpus-list.html
    controllerAs: 'collaborators',
    controller: function($scope, $reactive, $stateParams, $state, openCorpus, openDocuments, $timeout) {
      $reactive(this).attach($scope);

    }
  }
});
