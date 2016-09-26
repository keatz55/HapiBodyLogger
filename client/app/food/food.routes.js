'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('food', {
      url: '/log/:date/:meal/food?mid',
      template: '<food></food>'
    })
    .state('new-food', {
      url: '/log/food/new?date&meal&mid',
      template: '<new-food></new-food>'
    });
}
