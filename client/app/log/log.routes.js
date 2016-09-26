'use strict';

export default function routes($stateProvider) {
  'ngInject';
  
  $stateProvider
    .state('log-settings', {
      url: '/log/settings?date',
      template: '<log-settings></log-settings>'
    })
    .state('log', {
      url: '/log/:date',
      template: '<log></log>'
    });
}
