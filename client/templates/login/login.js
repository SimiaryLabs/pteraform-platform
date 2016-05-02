angular.module("pteraform-platform").directive('login', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/login/login.html',
    controllerAs: 'login',
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
 
      this.login = () => {
        Meteor.loginWithPassword(this.credentials.email, this.credentials.password, (err) => {
          if (err) {
            $scope.$apply( () => {
              this.error = err.reason;
            });
          }
          else {
            $state.go('pteraform');
          }
        });
      };
    }
  }
});
