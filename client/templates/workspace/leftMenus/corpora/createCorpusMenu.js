angular.module('pteraform-platform').directive('createCorpusMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/leftMenus/corpora/create-corpus-menu.html',  //corpusList/corpus-list.html
    controllerAs: 'createCorpus',
    controller: function($scope, $reactive, $stateParams, $state, openCorpus, openDocuments, $timeout) {
      $reactive(this).attach($scope);
      this.title = "";
      this.description = "";
      this.clear = () => {
        this.title = "";
        this.description = "";
      };
      this.save = () => {
        this.call('createCorpus', Meteor.userId(), this.title, this.description, (error, result) => {
          if (!error) {
            this.clear();
          }
        });
      };
    }
  }
});
