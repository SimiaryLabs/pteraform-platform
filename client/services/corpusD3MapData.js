angular.module('pteraform-platform').service('corpusD3MapData', function(colorBrewer) {
  this.data = [];
  this.divId = "#corpusD3map";
  this.countries = "/topojson/world/countries.json";

  this.worldmap = d3.geomap.choropleth()
    .width(1008)
    .height(525)
    .geofile(this.countries)
    //.colors(colorBrewer.colorbrewer.YlOrRd[7])
    .colors(colorBrewer.colorbrewer.YlGnBu[6])
    .column('value')
    .duration(500)
    .format(d3.format(',.02f'));
    //.legend(true)
    //.postUpdate(annotation);

  this.annotation = () => {
  };

  this.setData = (data) => {
    this.data = data;
    d3.select(this.divId)
        .datum(this.data)
        .call(this.worldmap.draw, this.worldmap);
  };

  this.setDivId = (divId) => {
    this.divId = divId;
  };

});
