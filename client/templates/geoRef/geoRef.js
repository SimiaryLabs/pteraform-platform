angular.module('pteraform-platform').directive('geoRef', function(leafletData) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      id: "="
    },
    //require: ['^markedParagraph','^documentDetails'],
    templateUrl: 'client/templates/geoRef/geo-ref.html',
    controllerAs: 'geoRef',
    controller: function ($scope, $reactive, openDocuments, docMap) {
      $reactive(this).attach($scope);
      this.geoId = $scope.id;
      this.gazetteerEntry = () => {
        return openDocuments.gazetteer[this.geoId];
      };
      this.click = () => {
        var entry = this.gazetteerEntry();
        leafletData.getMap('docmap').then(function(map) {
          map.setView([entry.latitude, entry.longitude]);
        });
        docMap.clearMarkers();
        docMap.addMarker("m", {
          lat: entry.latitude,
          lng: entry.longitude,
          message: entry.name
        });
      };
    },
    link: function(scope, element, attrs) {
      element.addClass('georef');
    }
  }
});
