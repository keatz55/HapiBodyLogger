'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var foodEntryCtrlStub = {
  index: 'foodEntryCtrl.index',
  show: 'foodEntryCtrl.show',
  create: 'foodEntryCtrl.create',
  upsert: 'foodEntryCtrl.upsert',
  patch: 'foodEntryCtrl.patch',
  destroy: 'foodEntryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var foodEntryIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './food-entry.controller': foodEntryCtrlStub
});

describe('FoodEntry API Router:', function() {
  it('should return an express router instance', function() {
    expect(foodEntryIndex).to.equal(routerStub);
  });

  describe('GET /api/food-entries', function() {
    it('should route to foodEntry.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'foodEntryCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/food-entries/:id', function() {
    it('should route to foodEntry.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'foodEntryCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/food-entries', function() {
    it('should route to foodEntry.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'foodEntryCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/food-entries/:id', function() {
    it('should route to foodEntry.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'foodEntryCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/food-entries/:id', function() {
    it('should route to foodEntry.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'foodEntryCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/food-entries/:id', function() {
    it('should route to foodEntry.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'foodEntryCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
