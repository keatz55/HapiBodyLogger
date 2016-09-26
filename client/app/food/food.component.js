'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routes from './food.routes';
import newFood from './new/new.component'

export class FoodComponent {
  /*@ngInject*/
  constructor($state, Meal, Food, FoodEntry) {
    this.params = $state.params;

    this.food = Food.query();

    this.foodEntries = FoodEntry.query();

  }

  addFood() {

  }
}

export default angular.module('hapiBodyLoggerApp.food', [uiRouter, newFood])
  .config(routes)
  .component('food', {
    template: require('./food.html'),
    controller: FoodComponent,
  })
  .name;
