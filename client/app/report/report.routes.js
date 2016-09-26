'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('report', {
      url: '/report?days',
      template: '<report></report>'
    })
    .state('carbs-report', {
      url: '/report/carbs',
      template: '<carbs-report></carbs-report>'
    })
    .state('fat-report', {
      url: '/report/fat',
      template: '<fat-report></fat-report>'
    })
    .state('protein-report', {
      url: '/report/protein',
      template: '<protein-report></protein-report>'
    });
}
