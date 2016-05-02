angular.module('pteraform-platform').service('workspaceService', function() {

  this.leftMenuContent = 'corpusList';

  this.leftMenuTop = [
    {
      link : '',
      title: 'Corpus list',
      icon: 'list',
      content: 'corpusList'
    },
    {
      link : '',
      title: 'Create corpus',
      icon: 'add_circle',
      content: 'createCorpus'
    },
    {
      //link : 'showListBottomSheet($event)',
      link: '',
      title: 'Settings',
      icon: 'settings',
      content: 'settings'
    }//,
    //{
     // link : '',
     // title: 'Collaborators',
     // icon: 'group',
     // content: 'collaborators'
    //},
    //{
    //  link : '',
    //  title: 'Research Questions',
    //  icon: 'mode_edit',
    //  content: 'researchQuestions'
    //}
  ];
  this.leftMenuAdmin = [
    {
      //link : 'showListBottomSheet($event)',
      link: '',
      title: 'Settings',
      icon: 'settings',
      content: 'settings'
    }//,
    //{
    //  link : '',
    //  title: 'Trash',
    //  icon: 'delete'
    //}
  ];

});
