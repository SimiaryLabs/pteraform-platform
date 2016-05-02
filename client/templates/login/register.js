angular.module("pteraform-platform").directive('register', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/login/register.html',
    controllerAs: 'register',
    controller: function ($scope, $reactive, $state) {
      $reactive(this).attach($scope);
 
      this.credentials = {
        email: '',
        password: ''
      };
 
      this.error = '';
      this.showError = () => {
        return this.error != '';
      };
 
      this.register = () => {
        Meteor.call('createRegularUser', this.credentials, (err) => {
        //Accounts.createUser(this.credentials, (err) => {
          if (err) {
            $scope.$apply( () => {
              this.error = err.reason;
            });
          }
          else {
            $state.go('welcome');
          }
        });
      };
    }
  }
});
