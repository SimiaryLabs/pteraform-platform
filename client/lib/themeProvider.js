angular.module('pteraform-platform').config(function($mdThemingProvider) {

  //
  // Custom Palettes
  //

  // UCLA Blue Base
  $mdThemingProvider.definePalette('UCLABlue', {
    '50': '#ffffff',
    '100': '#d9ddea',
    '200': '#b5bcd6',
    '300': '#8693bd',
    '400': '#7382b2',
    '500': '#5f70a7',
    '600': '#526295',
    '700': '#475582',
    '800': '#3c486e',
    '900': '#323b5a',
    'A100': '#ffffff',
    'A200': '#d9ddea',
    'A400': '#7382b2',
    'A700': '#475582',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100 A200 A400'
  });

  // Custom Blue
  $mdThemingProvider.definePalette('customBlue', {
    '50': '#f6f7fa',
    '100': '#c5cbdf',
    '200': '#a1abcb',
    '300': '#7382b2',
    '400': '#5f70a7',
    '500': '#526295',
    '600': '#475581',
    '700': '#3c486e',
    '800': '#313b5a',
    '900': '#272e46',
    'A100': '#f6f7fa',
    'A200': '#c5cbdf',
    'A400': '#5f70a7',
    'A700': '#3c486e',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 A100 A200'
  });

  // Arylide Yellow Base
  $mdThemingProvider.definePalette('ArylideYellow', {
    '50': '#ffffff',
    '100': '#f9ebc3',
    '200': '#f3db90',
    '300': '#edc64f',
    '400': '#eabd34',
    '500': '#e7b418',
    '600': '#cb9e15',
    '700': '#b08912',
    '800': '#94730f',
    '900': '#785e0c',
    'A100': '#ffffff',
    'A200': '#f9ebc3',
    'A400': '#eabd34',
    'A700': '#b08912',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 500 600 700 A100 A200 A400 A700'
  });

  $mdThemingProvider.definePalette('CoralTree', {
    '50': '#ffffff',
    '100': '#ead9dd',
    '200': '#d6b5bc',
    '300': '#bd8693',
    '400': '#b27382',
    '500': '#a75f70',
    '600': '#955262',
    '700': '#824755',
    '800': '#6e3c48',
    '900': '#5a323b',
    'A100': '#ffffff',
    'A200': '#ead9dd',
    'A400': '#b27382',
    'A700': '#824755',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100 A200 A400'
  });

  // Eggshell Base
  $mdThemingProvider.definePalette('Eggshell', {
    '50': '#ffffff',
    '100': '#ffffff',
    '200': '#ffffff',
    '300': '#ffffff',
    '400': '#f8f9e7',
    '500': '#f0f2cf',
    '600': '#e8ebb7',
    '700': '#e1e59f',
    '800': '#d9de87',
    '900': '#d2d86f',
    'A100': '#ffffff',
    'A200': '#ffffff',
    'A400': '#f8f9e7',
    'A700': '#e1e59f',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 500 600 700 800 900 A100 A200 A400 A700'
  });

  // Raw Umber
  $mdThemingProvider.definePalette('RawUmber', {
    '50': '#f0e4d9',
    '100': '#dbbea2',
    '200': '#cba17a',
    '300': '#b67d47',
    '400': '#a06e3f',
    '500': '#8a5f36',
    '600': '#74502d',
    '700': '#5e4125',
    '800': '#48321c',
    '900': '#322214',
    'A100': '#f0e4d9',
    'A200': '#dbbea2',
    'A400': '#a06e3f',
    'A700': '#5e4125',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 A100 A200'
  });


  // Mapping Colour Palettes with Intention Groups
  $mdThemingProvider.theme('default')
  .primaryPalette('customBlue', {
    'default': '400',
    'hue-1': '300',
    'hue-2': '700',
    'hue-3': 'A200'
  })
  .accentPalette('amber', {
    'default': '500', //A200
    'hue-1': '300', //A100
    'hue-2': '800', //A400
    'hue-3': 'A700' //A700
  })
  .warnPalette('red', {
    'default': '500',
    'hue-1': '300',
    'hue-2': '800',
    'hue-3': 'A100'
  });
  //.backgroundPalette('Eggshell', {
  //  'default': '400',
  //  'hue-1': '300',
  //  'hue-2': '800',
  //  'hue-3': 'A100'
  //});

  // Alternative Theme, placeholder for extensions
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')

});
