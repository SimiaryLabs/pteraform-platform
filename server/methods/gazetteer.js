Meteor.methods({
  // returns the name, lat, lon of a gazetteer entry
  getGazetteerEntry: function( id ) {
    check( id, Match.OneOf( String, Match.Integer) );
    return Gazetteer.findOne( { geonameid: id }, { field: { _id: 1, name: 1, latitude: 1, longitude: 1 } } );
  }
});
