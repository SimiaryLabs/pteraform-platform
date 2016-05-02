Meteor.publish("documents", function (corpusId, options) {
  check(corpusId, String);
  let selector = {
    $and: [
      { owner: this.userId },
      { owner: { $exists: true } },
      { corpus: corpusId },
      { corpus: { $exists: true } }
    ]
  };

  // only return these fields
  options.fields = { _id: 1, title: 1, modifyDate: 1, geoParsed: 1, temporalParsed: 1, geoboosted: 1, wordCount: 1, sections: 1, paragraphs: 1 };
  return Documents.find(selector, options);
});

Meteor.publish("doc", function (docId) {
  let selector = {
    $and: [
      { _id: docId },
      { owner: this.userId },
      { owner: { $exists: true } }
    ]
  };

  let options = { fields: { _id: 1, document: 1, title: 1, modifyDate: 1, begin: 1, end: 1, geoParsed: 1, temporalParsed: 1, geoboosted: 1, wordCount: 1, sections: 1, paragraphs: 1 },
                  limit: 1 };
  return Documents.find(selector, options);
});
