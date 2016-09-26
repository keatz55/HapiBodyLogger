'use strict';

describe('Component: CarbsComponent', function() {
  // load the controller's module
  beforeEach(module('hapiBodyLoggerApp.report.carbs'));

  var CarbsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CarbsComponent = $componentController('carbs', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
