angular.module('pteraform-platform').directive('openDocumentsPanel', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/openDocumentsPanel/open-documents-panel.html',
    controllerAs: 'openDocumentsPanel',
    controller: function ($scope, $reactive, $stateParams, $state, openDocuments, openCorpus) {
      $reactive(this).attach($scope);
      $scope.openDocs = openDocuments.docs;

      //$scope.$watch( () => {
      //  return openCorpus.id;
      //}, (newValue, oldValue) => {
      //  openDocuments.closeAllDocuments();
      //  $scope.openDocs = openDocuments.docs;
      //});

      this.openDocument = (doc) => {
        // check if the document is not yet open
        if (!openDocuments.docs[doc._id]) {
          openDocuments.addDocument(doc);
        }
        openDocuments.currentDocId = doc._id;
      };

      this.closeDocument = (doc) => {
        openDocuments.removeDocument(doc._id);
      };

    }
  }
});
