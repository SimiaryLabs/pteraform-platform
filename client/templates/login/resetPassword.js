angular.module("pteraform-platform").directive('resetpw', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/login/reset-password.html',
    controllerAs: 'resetpw',
    controller: function ($scope, $reactive, $state) {
      $reactive(this).attach($scope);
 
      this.credentials = {
        email: ''
      };
 
      this.error = '';
      this.showError = () => {
        return this.error != '';
      };
 
      this.reset = () => {
        Accounts.forgotPassword(this.credentials, (err) => {
          if (err) {
            $scope.$apply( () => {
              this.error = "Error sending password reset email.";
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
