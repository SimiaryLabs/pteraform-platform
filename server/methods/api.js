Meteor.methods({
  apiKey: function ( userId ) {
    check( userId, Meteor.userId() );
    return APIKeys.findOne( { "owner": userId }, { fields: { "key": 1 } } ); 
  },
  regenerateApiKey: function( userId ){
    check( userId, Meteor.userId() );

    var newKey = Random.hexString( 32 );

    // Perform the update.
    try {
      var keyId = APIKeys.update( { "owner": userId }, {
        $set: {
          "key": newKey
        }
      });
      return keyId;
    } catch(exception) {
      // If an error occurs, return it to the client.
      return exception;
    }
  },
  createCorpus: function ( userId, title, description ) {
    check(userId, Meteor.userId() );
    check(title, NonEmptyString);
    check(description, String);
    let apiKey = Meteor.call('apiKey', userId);
    let api = Meteor.settings.private.pteraformAPIServer + "corpus";
    try {
      let result = HTTP.call('POST', api, {
        data: {
          api_key: apiKey.key,
          title: title, 
          description: description 
        }
      });
      return result;
    } catch (error) {
      throw new Meteor.Error("create corpus failed", error.message);
    }
  },
  modifyCorpus: function ( userId, corpusId, fields ) {
    check(userId, Meteor.userId());
    check(corpusId, String);
    let apiKey = Meteor.call('apiKey', userId);
    let api = Meteor.settings.private.pteraformAPIServer + "corpus";
    let data = {
      api_key: apiKey.key,
      _id: corpusId
    };
    if (fields.title) {
      check(fields.title, String);
      data.title = fields.title;
    }
    if (fields.description) {
      check(fields.description, String);
      data.description = fields.description;
    }
    if (Object.keys(data).length == 2) throw new Meteor.Error("modify corpus failed", "No data to modify");
    try {
      let result = HTTP.call('PUT', api, {
        data: data
      });
      return result;
    } catch (error) { 
      throw new Meteor.Error("modify corpus failed", error.message);
    }
  },
  addDocument: function ( userId, corpusId, title, text, docboost, properties ) {
    check(userId, Meteor.userId());
    check(corpusId, String);
    check(title, String);
    check(text, NonEmptyString);
    check(docboost, Number);
    check(properties, Object);
    //check(options, Object);
    let apiKey = Meteor.call('apiKey', userId);
    let api = Meteor.settings.private.pteraformAPIServer + "document";
    let options = {
      doTemporal: true,
      doGeo: true
    };
    let data = {
      api_key: apiKey.key,
      corpus: corpusId,
      title: title,
      text: text,
      docboost: docboost,
      properties: properties,
      options: options
    };
    try {
      let result = HTTP.call('POST', api, {
        data: data
      });
      return result;
    } catch (error) {
      throw new Meteor.Error("add corpus failed", error.message);
    }
  }, 
  modifyDocument: function ( userId, docId, fields) {
    check(userId, Meteor.userId());
    check(docId, String);
    let apiKey = Meteor.call('apiKey', userId);
    let api = Meteor.settings.private.pteraformAPIServer + "document";
    let data = {
      api_key: apiKey.key,
      _id: docId
    }
    if (fields.title) {
      check(fields.title, String);
      data.title = fields.title;
    }
    if (Object.keys(data).length == 2) throw new Meteor.Error("modify document failed", "No data to modify");
    try {
      let result = HTTP.call('PUT', api, {
        data: data
      });
      return result;
    } catch (error) { 
      throw new Meteor.Error("modify document failed", error.message);
    }
  }
});
