angular.module('pteraform-platform').directive('corpusD3Map', function(corpusD3MapData, openCorpus) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      paragraphId: "="
    },
    templateUrl: 'client/templates/corpusD3Map/corpus-d3-map.html',
    controllerAs: 'corpusD3Map',
    controller: function ($scope, $reactive) {
      $reactive(this).attach($scope);
    },
    link: function(scope, element, attributes, ctrl, transcludeFn) {
/**
      scope.$watch(function() {
          return openCorpus.id;
        }, (corpusId) => {
          //console.log(p);
          //
          let testData = [];

            {"nasme": "Mauritania", "iso3": "MRT", "value": 3.987022610593231},
            {"name": "Haiti", "iso3": "HTI", "value": 2.055923194684372},
            {"name": "Pakistan", "iso3": "PAK", "value": 1.1872799074119798},
            {"name": "India", "iso3": "IND", "value": 1.128500018547947},
            {"name": "Nepal", "iso3": "NPL", "value": 0.9419904225671796},
            {"name": "Moldova", "iso3": "MDA", "value": 0.9362162143939345},
            {"name": "Benin", "iso3": "BEN", "value": 0.7996555862466124},
            {"name": "Côte d'Ivoire", "iso3": "CIV", "value": 0.79046862989705},
            {"name": "Gambia", "iso3": "GMB", "value": 0.7841560942930117},
            {"name": "Gabon", "iso3": "GAB", "value": 0.8395954359133931}
          ];

          corpusD3MapData.setData(testData);
        }
      );
**/
      scope.$watch(
        function () {
          return [element[0].parentElement.offsetWidth, element[0].parentElement.offsetHeight].join('x');
        },
        function (value) {
          //console.log(element);
          
          //corpusD3MapData.resizeWorldMap(element[0].childNodes[0].offsetWidth, element[0].childNodes[0].offsetHeight);
        }
      );
    }
  }
});
