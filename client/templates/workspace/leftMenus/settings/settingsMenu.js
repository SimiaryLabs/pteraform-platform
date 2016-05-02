angular.module('pteraform-platform').directive('settingsMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/workspace/leftMenus/settings/settings-menu.html',  //corpusList/corpus-list.html
    controllerAs: 'settings',
    controller: function($scope, $reactive, $stateParams, $state, openCorpus, openDocuments, $timeout, $mdDialog) {
      $reactive(this).attach($scope);
      this.title = "";
      this.description = "";
      this.clear = () => {
        this.title = "";
        this.description = "";
      };
      this.save = () => {
        this.clear();
      };
      this.currentUser = () => { return Meteor.user(); };

      this.subscribe( "APIKey" );
      this.helpers({
        apiKey: () => {
          var apiKey = APIKeys.findOne();

          if ( apiKey ) {
            return apiKey.key;
          }
        }
      });

      this.regenerateApiKeyConfirm = (ev) => {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .title('Regenerate API Key?')
          .textContent("Are you sure? This will invalidate your current key!")
          .ariaLabel('Regenerate API key')
          .targetEvent(ev)
          .ok('OK')
          .cancel('Cancel');
        $mdDialog.show(confirm).then( () => {
          this.regenerateApiKey();
        }, () => {
          //
        });
      };
      this.regenerateApiKey = () => {
        Meteor.call( "regenerateApiKey", Meteor.userId(), function( error, response ) {
          if ( error ) {
            //Bert.alert( error.reason, "danger" );
          } else {
            //Bert.alert( "All done! You have a new API key.", "success" );
          }
        });
      }
    }
  }
});
