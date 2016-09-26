'use strict';

describe('Component: LogComponent', function() {
  // load the controller's module
  beforeEach(module('hapiBodyLoggerApp.log'));

  var LogComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    LogComponent = $componentController('log', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
