'use strict';

describe('Component: FoodComponent', function() {
  // load the controller's module
  beforeEach(module('hapiBodyLoggerApp.food'));

  var FoodComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    FoodComponent = $componentController('food', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
