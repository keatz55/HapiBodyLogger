'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {

  constructor() {
    'ngInject';
  }

}

export default angular.module('directives.report.navbar', [])
  .component('reportNavbar', {
    template: require('./_navbar.html'),
    controller: NavbarComponent
  })
  .name;
