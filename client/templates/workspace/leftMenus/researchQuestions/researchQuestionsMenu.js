angular.module('pteraform-platform').directive('researchQuestionsMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/leftMenus/researchQuestions/research-questions-menu.html',  //corpusList/corpus-list.html
    controllerAs: 'researchQuestions',
    controller: function($scope, $reactive, $stateParams, $state, openCorpus, openDocuments, $timeout) {
      $reactive(this).attach($scope);

    }
  }
});
