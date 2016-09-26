'use strict';

describe('Component: ProteinComponent', function() {
  // load the controller's module
  beforeEach(module('hapiBodyLoggerApp.report.protein'));

  var ProteinComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ProteinComponent = $componentController('protein', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
