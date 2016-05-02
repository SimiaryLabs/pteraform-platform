angular.module('pteraform-platform').service('docMap', function() {
  this.markers = {};

  this.clearMarkers = () => {
    this.markers = {};
  };

  this.getMarkers = () => {
    return this.markers;
  };

  this.addMarker = (markerId, marker) => {
    this.markers[markerId] = marker;
  };

  this.deleteMarker = (markerId) => {
    delete this.markers[markerId];
  };
});
