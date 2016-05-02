angular.module('pteraform-platform').directive('temporalRef', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      id: "="
    },
    templateUrl: 'client/templates/temporalRef/temporal-ref.html',
    controllerAs: 'temporalRef',
    controller: function ($scope, $reactive, openDocuments) {
      $reactive(this).attach($scope);
      this.granularity = $scope.granularity;
      this.value = $scope.value;
    },
    link: function(scope, element, attrs) {
      element.addClass('temporalref');
    }
  }
});
