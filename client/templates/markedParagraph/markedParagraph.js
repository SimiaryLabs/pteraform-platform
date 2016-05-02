angular.module('pteraform-platform').directive('markedParagraph', function($compile, openDocuments) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      paragraphId: "="
    },
    templateUrl: 'client/templates/markedParagraph/marked-paragraph.html',
    controllerAs: 'markedParagraph',
    controller: function ($scope, $reactive) {
      $reactive(this).attach($scope);
      this.paragraphId = $scope.paragraphId;

      this.paragraph = () => {
        return openDocuments.paragraphs[openDocuments.currentDocId][this.paragraphId];
      };

    },
    link: function(scope, element, attributes, ctrl, transcludeFn) {
      this.paragraph = () => {
        return openDocuments.paragraphs[openDocuments.currentDocId][scope.paragraphId];
      };

      scope.$watch(function() {
          //console.log(openDocuments.currentDocId);
          //console.log(scope.paragraphId);
          //console.log(openDocuments.paragraphs[openDocuments.currentDocId]);
          return openDocuments.paragraphs[openDocuments.currentDocId][scope.paragraphId];
        }, (p, oldValue) => {
          //console.log(p);
          if (p && p.text) {
            var markedTextArray = [];
            var cumulativeOffset = 0;
            if (p.entities) {
            //if (p.geoEntities && p.geoEntities.places) {
              //p.geoEntities.places.sort(function(a,b) {return (a.begin > b.begin) ? 1 : ((b.begin > a.begin) ? -1 : 0);} );
              //_.each(p.geoEntities.places, function(element, index, list) {
              _.each(p.entities, function(element, index, list) {
                var refOpen = "";
                var refClose = "";
                if (element.type == "geo") {
                  refOpen = "<geo-ref id=\""+element.geonameid+"\">";
                  refClose = "</geo-ref>";
                } else if (element.type == "temporal") {
                  if (element.granularity == "dateYear" || element.granularity == "dateYearMonth" || 
                      element.granularity == "dateYearMonthDay" || element.granularity == "dateCentury" ||
                      element.granularity == "dateDecade") {
                    refOpen = "<temporal-ref granularity=\""+element.granularity+"\" value=\""+element.value+"\">";
                    refClose = "</temporal-ref>";
                  }
                }
                var localBeginOffset = element.begin-p.begin;
                var localEndOffset = element.end-p.begin;
                var preText = p.text.slice(cumulativeOffset, localBeginOffset);
                var taggedText = p.text.slice(localBeginOffset, localEndOffset);
                markedTextArray.push(preText);
                markedTextArray.push(refOpen);
                markedTextArray.push(taggedText);
                markedTextArray.push(refClose);
                cumulativeOffset = localEndOffset;
              });
              markedTextArray.push(p.text.slice(cumulativeOffset)); // get the remainder of the paragraph
            }
            var markedText = markedTextArray.join('');
            var htmlText = "<p>"+ markedText + "</p>";
            var template = angular.element($compile(htmlText)(scope));
            element.replaceWith(template);
          }
        }
      );
    }
  }
});
