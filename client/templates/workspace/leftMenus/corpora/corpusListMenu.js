angular.module('pteraform-platform').directive('corpusListMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/leftMenus/corpora/corpus-list-menu.html',  //corpusList/corpus-list.html
    controllerAs: 'corpusList',
    controller: function($scope, $reactive, $stateParams, $state, openCorpus, openDocuments, $timeout) {
      $reactive(this).attach($scope);
      $scope.openDocs = openDocuments.docs;

      this.perPage = 7;
      this.clp = parseInt($stateParams.clp, 10);
      this.sort = {
        title: 1
      };

      this.pollDB = () => {
        // count corpora
        this.call('countCorpora', Meteor.userId(), function (error, result) {
          if (!error) this.corpusCount = result;
        } );

      };

      this.corpusCount = 0;
      this.pollDB();

      this.newCorpusTitle = "";
      this.newCorpusDescription = "";

      this.subscribe('corpora', () => {
        return [
          {
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('clp') - 1) * this.perPage),
            sort: this.getReactively('sort')
          }
        ]
      });

      this.createCorpus = () => {
        if (this.newCorpusTitle) {
          this.call('createCorpus', Meteor.userId(), this.newCorpusTitle, this.newCorpusDescription, (error, result) => {
            if (error) {
              // TODO: alert
              console.log(error);
            } else {
              this.newCorpusTitle = "";
              this.newCorpusDescription = "";
              this.poll();
            }
          });
        } else {
          // TODO: alert empty title
        }
      };

      this.selectCorpus = (corpus) => {

        // Review later (candiate to be moved to workspace service)
        $scope.toggleSidenav('left');

        // check if the corpus is not yet open
        if (openCorpus.id !== corpus._id) {
          openCorpus.setCorpus(corpus);
        }

        // Also review this later
        $scope.corpusSelected = true;
      };

      this.pageChanged = (newPage) => {
        this.clp = newPage;
        $state.transitionTo('pteraform', { clp: newPage }, { inherit: true, notify: false, reload: false, location: "replace" } );
      };

      this.helpers({
        corpora: () => {
          return Corpora.find({}, { sort : this.getReactively('sort') });
        },
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        }
      });

      // polling functions for counts, which enable mongodb to do the counts calculations

      // ping db for counts every 60 sec
      var onTimeout = () => {
        this.pollDB();
        timer = $timeout(onTimeout, 60000);
      };
      var timer = $timeout(onTimeout, 60000);

      // destructors to prevent memory leaks
      $scope.$on("$destroy", () => {
        if (timer) {
          $timeout.cancel(timer);
        }
      });
    }
  }
});
