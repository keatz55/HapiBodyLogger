'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routes from './log.routes';
// import settings from './settings/settings.component';

export class LogComponent {

  // $onInit() {}

  /*@ngInject*/
  constructor($state, Log, Meal, FoodEntry) {
    this.$state = $state;
    this.params = $state.params;
    this.date = new Date(this.params.date);

    this.Log = Log;
    this.getLog();

    this.newMealSection = false;
    this.newMealName = null;

    this.Meal = Meal;

    this.FoodEntry = FoodEntry;

  }

  getLog() {
    this.log = this.Log.get({id:this.params.date});
  }

  newMeal() {
    this.Meal.save({name: this.newMealName, index: this.log.length}).$promise.then(res=>{
      this.getLog();
      this.newMealSection = false;
      this.newMealName = null;
      this.newMealSubmitted = false;
    },err=>{
      console.log(err)
      this.newMealSubmitted = false;
    });
  }

  updateMeal(meal,name) {
    meal.name = name;
    this.Meal.update(meal)
  }

  removeMeal(id) {
    this.Meal.remove({id:id}).$promise.then(res=>{
      this.getLog();
      this.removeMealSubmitted = false;
    },err=>{
      console.log(err);
      this.removeMealSubmitted = false;
    });;
  }

  removeFoodEntry(id) {
    this.FoodEntry.remove({id:id}).$promise.then(res=>{
      this.getLog();
    },err=>{
      console.log(err)
    });
  }

  getTotalCalories(meal) {
    var total = 0;
    for(var i=0;i<meal.foodEntries.length;i++) {
      var entry = meal.foodEntries[i];
      total += (entry.servings * entry.food.calories);
    }
    return total;
  }
  getTotalCarbs(meal) {
    var total = 0;
    for(var i=0;i<meal.foodEntries.length;i++) {
      var entry = meal.foodEntries[i];
      total += (entry.servings * entry.food.totalCarbs);
    }
    return total;
  }
  getTotalFat(meal) {
    var total = 0;
    for(var i=0;i<meal.foodEntries.length;i++) {
      var entry = meal.foodEntries[i];
      total += (entry.servings * entry.food.totalFat);
    }
    return total;
  }
  getTotalProtein(meal) {
    var total = 0;
    for(var i=0;i<meal.foodEntries.length;i++) {
      var entry = meal.foodEntries[i];
      total += (entry.servings * entry.food.protein);
    }
    return total;
  }

  getDate(mealSlug) {

    if(!this.date) this.date = new Date();

    var mm = this.date.getMonth() + 1; // getMonth() is zero-based
    var dd = this.date.getDate();
    var yyyy = this.date.getFullYear()
    var dateSlug = [ String(mm).length > 1 ? '' : '0', mm, '-', String(dd).length > 1 ? '' : '0', dd, '-', yyyy].join('');

    this.$state.go('log',{date: dateSlug, meal: mealSlug},{reload:false});
  }
  
}

export default angular.module('hapiBodyLoggerApp.log', [uiRouter])
  .config(routes)
  .component('log', {
    template: require('./log.html'),
    controller: LogComponent
  })
  .name;
