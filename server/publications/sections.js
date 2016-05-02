Meteor.publish("sections", function (docId, options) {
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
  options.fields = { _id: 1, document: 1, title: 1, type: 1, number: 1 };
  return Sections.find(selector, options);
});

