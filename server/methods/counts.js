Meteor.methods({
  // returns the count of all corpora owned by the user
  countCorpora: function( userId ) {
    check( userId, Match.OneOf( Meteor.userId(), String ) );
    let rawCorpora = Corpora.rawCollection();
    let countQuery = Meteor.wrapAsync(rawCorpora.count, rawCorpora);
    let count = countQuery({owner: userId});
    return count; 
  },
  // returns the total count of all documents owned by the user
  countTotalDocuments: function( userId ) {
    check( userId, Match.OneOf( Meteor.userId(), String ) );
    let rawDocuments = Documents.rawCollection();
    let countQuery = Meteor.wrapAsync(rawDocuments.count, rawDocuments);
    let count = countQuery({owner: userId});
    return count; 
  },
  // returns the count of all documents for a corpus owned by the user
  countDocuments: function( userId, corpusId ) {
    check( userId, Match.OneOf( Meteor.userId(), String ) );
    check( corpusId, Match.OneOf( String ) );
    let rawDocuments = Documents.rawCollection();
    let countQuery = Meteor.wrapAsync(rawDocuments.count, rawDocuments);
    let count = countQuery({owner: userId, corpus: corpusId});
    return count; 
  },
  // return the count of all geoParsed documents for a corpus owned by the user
  countGeoParsed: function( userId, corpusId ) {
    check( userId, Match.OneOf( Meteor.userId(), String ) );
    check( corpusId, Match.OneOf( String ) );
    let rawDocuments = Documents.rawCollection();
    let countQuery = Meteor.wrapAsync(rawDocuments.count, rawDocuments);
    let count = countQuery({owner: userId, corpus: corpusId, geoParsed: true});
    return count;
  },
  // return the count of all temporalParsed documents for a corpus owned by the user
  countTemporalParsed: function( userId, corpusId ) {
    check( userId, Match.OneOf( Meteor.userId(), String ) );
    check( corpusId, Match.OneOf( String ) );
    let rawDocuments = Documents.rawCollection();
    let countQuery = Meteor.wrapAsync(rawDocuments.count, rawDocuments);
    let count = countQuery({owner: userId, corpus: corpusId, temporalParsed: true});
    return count;
  },
  // return the count of paragraphs for a corpus owned by the user
  countParagraphsInCorpus: function( userId, corpusId ) {
    check( userId, Match.OneOf( Meteor.userId(), String ) );
    check( corpusId, Match.OneOf( String ) );
    let rawParagraphs = Paragraphs.rawCollection();
    let countQuery = Meteor.wrapAsync(rawParagraphs.count, rawParagraphs);
    let count = countQuery({owner: userId, corpus: corpusId});
    return count;
  },
  // return the count of geoparsed place references for a corpus owned by the user
  countPlacesInCorpus: function( userId, corpusId ) {
    check( userId, Match.OneOf( Meteor.userId(), String ) );
    check( corpusId, Match.OneOf( String ) );
    let rawParagraphs = Paragraphs.rawCollection();
    let countQuery = Meteor.wrapAsync(rawParagraphs.aggregate, rawParagraphs);
    let count = countQuery([
      { $match: { 
          owner: userId, 
          corpus: corpusId, 
          "geoEntities": { $exists: true } 
        }
      },
      { $group: { 
          _id: 0, 
          total: { $sum: { $size: "$geoEntities.places" } }
        }
      }
    ]);
    if (count[0])
      return count[0].total;
    else
      return 0;
  },
  // return the count of geoparsed place references for a document owned by the user
  countPlacesInDocument: function( userId, docId) {
    check( userId, Match.OneOf( Meteor.userId(), String ) );
    check( docId, Match.OneOf( String ) );
    let rawParagraphs = Paragraphs.rawCollection();
    let countQuery = Meteor.wrapAsync(rawParagraphs.aggregate, rawParagraphs);
    let count = countQuery([
      { $match: { 
          owner: userId, 
          document: docId, 
          "geoEntities": { $exists: true } 
        }
      },
      { $group: { 
          _id: 0, 
          total: { $sum: { $size: "$geoEntities.places" } }
        }
      }
    ]);
    if (count[0])
      return count[0].total;
    else 
      return 0;
  },
  countryStatsForCorpus: function( userId, corpusId ) {
    check( userId, Match.OneOf( Meteor.userId(), String ) );
    check( corpusId, Match.OneOf( NonEmptyString ) );

    let db = Documents.rawDatabase();
    let rawDocuments = Documents.rawCollection();
    let dbCommand = Meteor.wrapAsync(db.command, db);
    let mr = dbCommand({
      "mapreduce": "documents",
      "map" : "function() { for (var key in this.countryStats) { emit(key, null); } }",   
      "reduce" : "function(key, stuff) { return null; }",    
      "out": "country" + "_keys_" + corpusId, 
      "query": { corpus: corpusId }
    });
    let dbCollection = Meteor.wrapAsync(db.collection, db);
    let collection = dbCollection(mr.result);
    let distinctQuery = Meteor.wrapAsync(collection.distinct, collection);
    let distinctIds = distinctQuery("_id");
    //console.log(distinctIds);
    let result = distinctIds.map(function(c) {
      let cvalue = "$countryStats." + c ;
      let countQuery = Meteor.wrapAsync(rawDocuments.aggregate, rawDocuments);
      let count = countQuery([
          { $match: {corpus: corpusId}},
          { $group: {_id: null, total: { $sum: cvalue }}}
      ])[0].total;
      return {"iso3": country_iso2_to_iso3[c], "value": count};
    });
    return result;
  }
});
