angular.module('pteraform-platform').service('openDocuments', function() {
  this.docs = {};
  this.paragraphs = {};
  this.gazetteer = {};
  this.currentDocId = "";

  //this.setDocument = function(doc) {
  //  this.doc = doc;
  //};

  //this.getDocument = function() {
  //  return this.doc;
  //};

  this.closeAllDocuments = () => {
    //console.log("CLOSE ALL DOCS");
    this.docs = {};
    this.paragraphs = {};
    this.gazetteer = {};
    this.currentDocId = "";
  };

  this.removeDocument = (docId) => {
    if (this.currentDocId == docId)
      this.currentDocId = "";
    if (this.docs[docId])
      delete this.docs[docId];
    if (this.paragraphs[docId])
      delete this.paragraphs[docId];
  }

  this.addDocument = (d) => {
    this.docs[d._id] = d;
    //console.log("add document: "+ d._id);
    //console.log("document: "+ d);
    this.paragraphs[d._id] = {};
  };

  this.setParagraphs = (docId, para) => {
    if (!this.docs[docId]) return;
    //console.log(docId);
    para.forEach( (p) => {
      //console.log(p);
      this.paragraphs[docId][p._id] = p;
      // combine entities into single structure ordered by begin/end
      this.paragraphs[docId][p._id].entities = [];
      //var self = this;

      // places
      _.each(p.geoEntities.places, (element, index, list) => {
        var entity = {
          type: "geo", 
          geonameid: element.geonameid,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);

        // check if place is not already in doc mini-gazetteer
        if (!this.gazetteer[element.geonameid]) {
          var gazEntry = Meteor.call('getGazetteerEntry', element.geonameid, (error,result) => {
            if (!error) {
              this.gazetteer[element.geonameid] = result;
            }
          });
        }
      });

      // date: year
      _.each(p.temporalEntities.dateYear, (element, index, list) => {
        var entity = {
          type: "temporal",
          granularity: "dateYear",
          value: element.value,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);
      });

      // date: year-month
      _.each(p.temporalEntities.dateYearMonth, (element, index, list) => {
        var entity = {
          type: "temporal",
          granularity: "dateYearMonth",
          value: element.value,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);
      });

      // date: year-month-day
      _.each(p.temporalEntities.dateYearMonthDay, (element, index, list) => {
        var entity = {
          type: "temporal",
          granularity: "dateYearMonthDay",
          value: element.value,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);
      });

      // date: century
      _.each(p.temporalEntities.dateCentury, (element, index, list) => {
        var entity = {
          type: "temporal",
          granularity: "dateCentury",
          value: element.value,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);
      });

      // date: decade
      _.each(p.temporalEntities.dateDecade, (element, index, list) => {
        var entity = {
          type: "temporal",
          granularity: "dateDecade",
          value: element.value,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);
      });

      // date: other
      _.each(p.temporalEntities.dateOther, (element, index, list) => {
        var entity = {
          type: "temporal",
          granularity: "dateOther",
          value: element.value,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);
      });

      // time
      _.each(p.temporalEntities.time, (element, index, list) => {
        var entity = {
          type: "temporal",
          granularity: "time",
          value: element.value,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);
      });

      // set
      _.each(p.temporalEntities.set, (element, index, list) => {
        var entity = {
          type: "temporal",
          granularity: "set",
          value: element.value,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);
      });

      // duration
      _.each(p.temporalEntities.duration, (element, index, list) => {
        var entity = {
          type: "temporal",
          granularity: "duration",
          value: element.value,
          begin: element.begin,
          end: element.end
        };
        this.paragraphs[docId][p._id].entities.push(entity);
      });

      this.paragraphs[docId][p._id].entities.sort(function(a,b) {return (a.begin > b.begin) ? 1 : ((b.begin > a.begin) ? -1 : 0);} );
    });
  };

  this.none = () => {
    return (Object.keys(this.docs).length == 0);
  };
});
