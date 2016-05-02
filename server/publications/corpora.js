Meteor.publish("corpora", function (options) {
  let selector = {
    $and: [
      {owner: this.userId},
      {owner: {$exists: true}}
    ]
  };

  // only return these fields
  options.fields = {_id: 1, title: 1, description: 1, modifyDate: 1};
  return Corpora.find(selector, options);
});

Meteor.publish("corpus", function (corpusId) {
  let selector = {
    $and: [
      {_id: corpusId},
      {owner: this.userId},
      {owner: {$exists: true}}
    ]
  };

  let options = { fields: { _id: 1, title: 1, description: 1, modifyDate: 1 },
                  limit: 1 };
  return Corpora.find(selector, options);
});
