Meteor.publish("paragraphs", function (docId, options) {
  check(docId, String);
  let selector = {
    $and: [
      { owner: this.userId },
      { owner: { $exists: true } },
      { document: docId }
    ]
  };

  // only return these fields
  if (options == null)
    options = {};
  options.fields = { _id: 1, document: 1, begin: 1, end: 1, text: 1, geoEntities: 1, temporalEntities: 1 };
  //console.log(selector);
  //console.log(options);
  //console.log(Paragraphs.find(selector,options).fetch());
  return Paragraphs.find(selector, options);
});

