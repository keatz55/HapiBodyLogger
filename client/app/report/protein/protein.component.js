'use strict';
import angular from 'angular';

import angularChart from 'angular-chart.js';

export class ProteinComponent {
  /*@ngInject*/
  constructor($state, FoodEntry) {
    this.$state = $state;
    this.params = $state.params;

    this.FoodEntry = FoodEntry;

    this.buildGraph();

  }

  buildGraph() {

    this.entries = this.FoodEntry.query().$promise.then(res=>{

      this.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

      this.labels = this.getDateArray(this.params.days || 7);
      var lineData = [];
      for(var i=0;i<this.labels.length;i++)
        lineData.push(150);

      var barData = [];
      for(var i=0;i<this.labels.length;i++) {
        var label = this.labels[i];
        // console.log(label);
        var match = false;
        for(var j=0;j<res.length;j++) {
          var entry = res[j];
          if(label === entry._id.date)
            match = entry;
        }
        if (!match) {
          barData.push(0);
        } else {
          barData.push(this.extractData(match));
        }

      }
      
      this.data = [
        barData,
        lineData
      ];
      this.datasetOverride = [
        {
          label: "Net Protein Consumed",
          borderWidth: 1,
          type: 'bar'
        },
        {
          label: "Daily Goal",
          borderWidth: 3,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          type: 'line'
        }
      ];

    },err=>{
      console.log(err);
    });

    
  }

  extractData(entry) {
    var total = 0;
    for(var i=0;i<entry.foodEntries.length;i++) {
      var foodEntry = entry.foodEntries[i];
      total += ( foodEntry.servings * foodEntry.food.protein);
    }
    return total;
  }


  getDateArray(days) {
    var result = [];
    for (var i=days; i>=0; i--) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        result.push( this.formatDate(d) )
    }
    return result;
  }
  formatDate(date){
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    // var yyyy = date.getFullYear();
    if(dd<10) {dd='0'+dd}
    if(mm<10) {mm='0'+mm}
    date = mm+'/'+dd;//+'/'+yyyy;
    return date
 }
}

export default angular.module('hapiBodyLoggerApp.report.protein', [angularChart])
  .component('proteinReport', {
    template: require('./protein.html'),
    controller: ProteinComponent,
  })
  .name;
