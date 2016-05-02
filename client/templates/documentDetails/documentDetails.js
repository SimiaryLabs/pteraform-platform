angular.module('pteraform-platform').directive('documentDetails', function(leafletData) {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/documentDetails/document-details.html',
    controllerAs: 'documentDetails',
    controller: function ($scope, $reactive, $stateParams, openDocuments, $timeout, docMap) {
      $reactive(this).attach($scope);

      this.docId = openDocuments.currentDocId;
      this.doc = openDocuments.docs[this.docId];
      this.placeRefCount = null;

      this.pollDB = () => {
        this.call('countPlacesInDocument', Meteor.userId(), this.docId, function (error, result) {
          if (!error) this.placeRefCount = result;
        } );
      };


      this.originalDocTitle = "";
      if (this.doc) this.originalDocTitle = this.doc.title;

      // watches for Service changes
      $scope.$watch( () => {
        return openDocuments.currentDocId;
      }, (newValue, oldValue) => {
        this.docId = newValue;
        this.doc = openDocuments.docs[this.docId];
        this.originalDocTitle = "";
        if (this.doc) this.originalDocTitle = this.doc.title;
        //console.log(this.doc);
        this.call('countPlacesInDocument', Meteor.userId(), this.docId, function (error, result) {
          if (!error) this.placeRefCount = result;
        } );
        docMap.clearMarkers();
      });

      $scope.$watch( () => {
        return docMap.markers;
      }, (markers) => {
        $scope.mapMarkers = markers;
      });

      $scope.rightMenu = [
        {
          link : '',
          title: 'Sections',
          icon: 'pages'
        },
        {
          link : '',
          title: 'Paragraphs',
          icon: 'local_library'
        },
        {
          link : '',
          title: 'Words',
          icon: 'message'
        },
        {
          link : '',
          title: 'Place Refs',
          icon: 'location_on'
        }
      ];
      $scope.rightAdmin = [
        {
          link : '',
          title: 'Trash',
          icon: 'delete'
        },
        {
          link : 'showListBottomSheet($event)',
          title: 'Settings',
          icon: 'settings'
        }
      ];

      // Get the count of all the place references in the document
      this.call('countPlacesInDocument', Meteor.userId(), this.docId, function (error, result) {
        if (!error) this.placeRefCount = result;
      } );

      this.subscribe('sections', () => {
        return [ this.getReactively('docId'), {} ]
      });

      this.subscribe('paragraphs', () => {
        return [ this.getReactively('docId'), {} ]
      });

      this.changed = () => {
        return this.doc && (this.doc.title !== this.originalDocTitle);
      };

      this.revert = () => {
        if (this.doc) this.doc.title = this.originalDocTitle;
      };

      this.save = () => {
        if (this.doc) {
          // call to set new details
          this.call('modifyDocument', Meteor.userId(), this.doc._id, { title: this.doc.title }, (error, result) => {
            if (error) {
              // TODO: alert 
              console.log(error);
            } else {
              this.originalDocTitle = this.doc.title;
            }
          });
        }
      };

      this.getParagraph = (id) => {
        return Paragraphs.findOne(id);
      };

      this.helpers({
        //doc: () => {
        //  let doc = Documents.findOne( { _id: this.getReactively('docId') } );
          //currentDocument.doc = doc; // update the currentDocument service used by other controllers
        //  return doc;
        //},
        sections: () => {
          return Sections.find( { document: this.getReactively('docId') } );
        },
        paragraphs: () => {
          let paragraphs =  Paragraphs.find( { document: this.getReactively('docId') } );

          // check if the paragraphs have been loaded and processed for this document
          openDocuments.setParagraphs(this.docId, paragraphs);
          return paragraphs;
        }
      });

      // set up the Leaflet map
      angular.extend($scope, {
        tiles: {
          url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          options: {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',

          }
        },
        mapDefaults: {
          scrollWheelZoom: false,
          minZoom: 1,
          maxZoom: 19
        },
        mapCenter: {
          lat: 15.0,
          lng: 0.0,
          zoom: 2
        },
        mapMarkers: {}
      });

      // make sure leaflet fills size
      $timeout(function() {
        leafletData.getMap('docmap').then(function(map) {
          map.invalidateSize();
        });
      });

      // ping db for counts every 2 sec
      var onTimeout = () => {
        this.pollDB();
        timer = $timeout(onTimeout, 30000);
      };
      var timer = $timeout(onTimeout, 30000);
      
      // destructors to prevent memory leaks
      $scope.$on("$destroy", () => {
        if (timer) {
          $timeout.cancel(timer);
        }
      });
    }, link: function postLink(scope, element, attrs) {
      scope.$watch(
        function () {
          return [element[0].offsetWidth, element[0].offsetHeight, element[0].offsetLeft, element[0].offsetTop].join('x');
        },
        function (value) {
          leafletData.getMap('docmap').then(function(map) {
            map.invalidateSize();
          });
          //console.log('directive got resized:', value.split('x'));
        }
      );
    } 
  }
});
