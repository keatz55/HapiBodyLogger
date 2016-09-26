'use strict';

import angular from 'angular';

export class NewComponent {
  /*@ngInject*/
  constructor($state, Meal, Food, FoodEntry) {
    this.$state = $state;
    this.params = $state.params;
    this.addToMeal = 'yes';

    this.meals = Meal.query();

    this.food = new Food({
      public:true
    });

    this.foodEntry = new FoodEntry({
      servings: 1,
      _meal: this.params.mid,
      _log: this.params.date,
      date: new Date(this.params.date)
    });
  }

  submit() {
    this.food.$save(res=>{
      console.log('Save Food')
      console.log(res)
      if(this.addToMeal === 'yes') {
        this.foodEntry._food = res._id;
        this.foodEntry.$save(res=>{
          console.log('Save Food Entry')
          console.log(res)
          this.saveComplete()
        },err=>{
          console.log(err);
        })
      } else this.saveComplete()

    },err=>{
      console.log(err);
    });
  }

  setMeal() {
    for(var i=0;i<this.meals.length;i++) {
      if(this.foodEntry._meal === this.meals[i]._id)
        this.params.meal = this.meals[i].name;
    }
  }

  saveComplete() {
    this.$state.go('log',{date: this.params.date});
  }

}

export default angular.module('hapiBodyLoggerApp.food.new', [])
  .component('newFood', {
    template: require('./new.html'),
    controller: NewComponent,
  })
  .name;
