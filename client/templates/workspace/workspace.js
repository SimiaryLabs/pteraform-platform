angular.module('pteraform-platform').directive('workspace', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/workspace.html',
    controllerAs: 'workspace',
    controller: function($scope, $reactive, $stateParams, $state, $mdBottomSheet, $mdSidenav, $mdDialog, openCorpus, openDocuments) {
      $reactive(this).attach($scope);

      this.corpusSelected = () => {
      };

      this.showDocumentView = () => {
      };

      this.showCorpusListView = () => {
      };

      // The beginnings of the workspace manager service
      $scope.corpusListSelected = true;
      $scope.corpusSelected = false;

      $scope.corpusFlex = 33;
      $scope.documentFlex = 0;

      $scope.corpusListFlex = 100;
      $scope.corpusDetailsFlex = 66;

      $scope.open = function(open) {
        if (toggle == "corpus"){
          $scope.corpusSelected = true;
        }
      }

      $scope.toggle = function(toggle) {
        console.log(toggle);
        //Corpus Card
        if (toggle == "corpus"){
          if ($scope.corpusSelected == false){
            $scope.corpusSelected = true;
          } else {
            $scope.corpusSelected = false;
          }
        }

        // CorpusList within that card
        if (toggle == "corpusList"){
          if ($scope.corpusListSelected == false){
            $scope.corpusListSelected = true;

            $scope.corpusListFlex = 33;
            $scope.corpusDetailsFlex = 66;
          } else {
            $scope.corpusListSelected = false;

            $scope.corpusListFlex = 5;
            $scope.corpusDetailsFlex = 95;
          }
        }

      }


      // show corpus details only if there is one open
      $scope.noCorpusSelected = openCorpus.none();
      $scope.$watch( () => {
        return openCorpus.none();
      }, (newValue, oldValue) => {
        $scope.noCorpusSelected = newValue;
        if (!$scope.noCorpusSelected){
          $scope.corpusFlex = 100;
          $scope.corpusListFlex = 33;
          $scope.corpusDetailsFlex = 66;
        } else {
          $scope.corpusFlex = 0;
          $scope.documentFlex = 100;
        }
      });

      // show document details only if there is one open
      $scope.noDocSelected = openDocuments.none();
      $scope.$watch( () => {
        return openDocuments.none();
      }, (newValue, oldValue) => {
        $scope.noDocSelected = newValue;
        if (!$scope.noDocSelected){
          $scope.corpusFlex = 50;
          $scope.documentFlex = 50;
          //$scope.corpusListFlex = 33;
          //$scope.corpusDetailsFlex = 66;
        } else {
          $scope.corpusFlex = 100;
          $scope.documentFlex = 0;
        }
      });

      $scope.alert = '';
      $scope.showListBottomSheet = function($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
          template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
          controller: 'ListBottomSheetCtrl',
          targetEvent: $event
        }).then(function(clickedItem) {
          $scope.alert = clickedItem.name + ' clicked!';
        });
      };

      $scope.showAdd = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="user.firstName" placeholder="Placeholder text"> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="theMax"> </md-input-container> </div> <md-input-container flex> <label>Address</label> <input ng-model="user.address"> </md-input-container> <div layout layout-sm="column"> <md-input-container flex> <label>City</label> <input ng-model="user.city"> </md-input-container> <md-input-container flex> <label>State</label> <input ng-model="user.state"> </md-input-container> <md-input-container flex> <label>Postal Code</label> <input ng-model="user.postalCode"> </md-input-container> </div> <md-input-container flex> <label>Biography</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </div></md-dialog>',
          targetEvent: ev,
        })
        .then(function(answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.alert = 'You cancelled the dialog.';
        });

    }
  }
}
});
