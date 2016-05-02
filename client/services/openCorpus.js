angular.module('pteraform-platform').service('openCorpus', function() {
  this.corpus = {};
  this.id = "";

  this.clearCorpus = () => {
    this.corpus = {};
    this.id = "";
  };

  this.setCorpus = (corpus) => {
    this.corpus = corpus;
    this.id = corpus._id;
  };

  this.none = () => {
    return this.id == "";
  };
});
