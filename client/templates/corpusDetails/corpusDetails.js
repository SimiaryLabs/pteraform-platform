angular.module('pteraform-platform').directive('corpusDetails', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/corpusDetails/corpus-details.html',
    controllerAs: 'corpusDetails',
    controller: function ($scope, $reactive, $stateParams, $state, $timeout, openDocuments, openCorpus, corpusD3MapData, $mdDialog) {
      $reactive(this).attach($scope);

      this.currentAddDocumentTab = 0;
      this.addDocSpeedDialIsOpen = false;
      this.showTabs = false;
      this.showInsertToolbar = false;
      this.currentTab = 0;
      this.perPage = 10;
      this.dlp = parseInt($stateParams.dlp, 10);
      this.sort = {
        modifyDate: -1
      };

      //this.docId = openDocuments.currentDocId;
      //this.corpusId = $stateParams.corpusId;
      this.corpusId = openCorpus.id;
      this.corpus = openCorpus.corpus;

      this.pollDB = () => {
        this.call('countDocuments', Meteor.userId(), this.corpusId, (error, result) => {
          if (!error) {
            this.documentCount = result;
          }
        });
        this.call('countGeoParsed', Meteor.userId(), this.corpusId, (error, result) => {
          if (!error) {
            this.geoParsedCount = result;
          }
        });
        this.call('countTemporalParsed', Meteor.userId(), this.corpusId, (error, result) => {
          if (!error) {
            this.temporalParsedCount = result;
          }
        });
        if (this.corpusId) {
          this.call('geoIndexingStats', Meteor.userId(), this.corpusId, (error, result) => {
            if (!error) {
              this.indexingStats = result;
            }
          });
        }
      };

      this.originalCorpusTitle = this.corpus.title;
      this.originalCorpusDescription = this.corpus.description;

      this.documentCount = null;
      this.geoParsedCount = null;
      this.temporalParsedCount = null;
      this.indexingStats = { status: "undefined" };

      // watches for Service changes
      $scope.$watch( () => {
        return openCorpus.id;
      }, (newValue, oldValue) => {
        this.dlp = 1;
        this.corpus = openCorpus.corpus;
        this.originalCorpusTitle = this.corpus.title;
        this.originalCorpusDescription = this.corpus.description;
        this.corpusId = newValue;
        this.pollDB();
        this.call('countryStatsForCorpus', Meteor.userId(), this.corpusId, (error, result) => {
          if (!error) {
            this.countryStats = result;
            corpusD3MapData.setData(this.countryStats);
          }
        });
      });

      this.subscribe('documents', () => {
        return [
          this.getReactively('corpusId'),
          {
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('dlp') - 1) * this.perPage),
            sort: this.getReactively('sort')
          }
        ]
      });

      this.indexingReady = () => {
        return (this.indexingStats.status != "building") && (this.indexingStats.status != "completed");
      };

      this.indexingBuilding = () => {
        return this.indexingStats.status == "building";
      };

      this.indexingCompleted = () => {
        return this.indexingStats.status == "completed";
      };

      this.startGeoIndexing = () => {
        this.call("makeGeoIndex", Meteor.userId(), this.corpus._id, (error, result) => {
          if (error) {
            console.log(error);
          } else {
            //console.log(result);
            this.call('geoIndexingStats', Meteor.userId(), this.corpusId, (error, result) => {
              if (!error) {
                this.indexingStats = result;
              }
            });
          }
        });
      };

      this.deleteGeoIndex = () => {
        this.call("deleteGeoIndex", Meteor.userId(), this.corpus._id, (error, result) => {
          if (error) {
            console.log(error);
          } else {
            this.call('geoIndexingStats', Meteor.userId(), this.corpusId, (error, result) => {
              if (!error) {
                this.indexingStats = result;
              }
            });
          }
        });
      };

      this.deleteGeoIndexConfirm = (ev) => {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .title('Delete Geo Index?')
          .textContent('Are you sure that you want to delete the geo index for this corpus? This action cannot be undone.')
          .ariaLabel('Delete geo index')
          .targetEvent(ev)
          .ok('OK')
          .cancel('Cancel');
        $mdDialog.show(confirm).then( () => {
          this.deleteGeoIndex();
        }, () => {
          //
        });
      };

      this.cancelGeoIndexing = () => {
      };

      this.showTab = (tab) => {
        this.currentTab = tab;
        this.showTabs = true;
      };

      this.hideTabs = () => {
        this.showTabs = false;
      };

      this.changed = () => {
        return (this.corpus.title !== this.originalCorpusTitle) || (this.corpus.description !== this.originalCorpusDescription); 
      };

      this.revert = () => {
        this.corpus.title = this.originalCorpusTitle;
        this.corpus.description = this.originalCorpusDescription;
      };

      this.save = () => {
        // call to set new details
        this.call('modifyCorpus', Meteor.userId(), this.corpus._id, { title: this.corpus.title, description: this.corpus.description }, (error, result) => {
          if (error) {
            // TODO: alert 
            console.log(error);
          } else {
            this.originalCorpusTitle = this.corpus.title;
            this.originalCorpusDescription = this.corpus.description;
          }
        });
      };

      this.removeDocument = (docId) => {
        console.log("remove doc id " + docId);
      };

      this.pageChanged = (newPage) => {
        this.dlp = newPage;
        $state.transitionTo('pteraform', { dlp: newPage }, { inherit: true, notify: false, reload: false, location: "replace" } );
      };

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

      this.helpers({
        //corpus: () => {
        //  return Corpora.findOne({_id: this.getReactively('corpusId')});
        //},
        documents: () => {
          return Documents.find({}, { sort : this.getReactively('sort') });
        }
      });


      // Dialog boxes
      this.showAddDocumentDialog = function(ev,whichTab) {
        $mdDialog.show({
          controller: AddDocumentDialogController,
          templateUrl: 'client/templates/corpusDetails/add-document-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: { currentAddDocumentTab: whichTab }
        })
        .then( (answer) => {
          $scope.status = 'You said the information was "' + answer + '".';
          if (answer.title && answer.text) {
            var prop = {};
            try {
              if (answer.properties == '')
                answer.properties = '{}';
              prop = JSON.parse(answer.properties);
            } catch (e) {
            }
            console.log(answer.text);
            this.call('addDocument', Meteor.userId(), this.corpusId, answer.title, answer.text, 1.0, prop )
          }
        }, () => {
          $scope.status = 'You cancelled the dialog.';
        });
        function AddDocumentDialogController($scope, $mdDialog, currentAddDocumentTab) {
          $scope.currentAddDocumentTab = currentAddDocumentTab;
          $scope.rawText = {
            title: "",
            text: "",
            properties: "{}"
          };
          $scope.hide = function() {
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
          $scope.answer = function(answer) {
            $mdDialog.hide($scope.rawText);
          };
        }
      };

      // polling functions for counts, which enable mongodb to do the counts calculations
      // ping db every 30 sec
      var onTimeout = () => {
        this.pollDB();
        timer = $timeout(onTimeout, 10000);
      };
      var timer = $timeout(onTimeout, 10000);

      // destructors to prevent memory leaks
      $scope.$on("$destroy", () => {
        if (timer) {
          $timeout.cancel(timer);
        }
      });
    }
  }
});
