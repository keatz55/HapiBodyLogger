'use strict';

describe('Component: FatComponent', function() {
  // load the controller's module
  beforeEach(module('hapiBodyLogger.report.fat'));

  var FatComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    FatComponent = $componentController('fat', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
