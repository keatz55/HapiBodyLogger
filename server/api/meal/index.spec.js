'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var mealCtrlStub = {
  index: 'mealCtrl.index',
  show: 'mealCtrl.show',
  create: 'mealCtrl.create',
  upsert: 'mealCtrl.upsert',
  patch: 'mealCtrl.patch',
  destroy: 'mealCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var mealIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './meal.controller': mealCtrlStub
});

describe('Meal API Router:', function() {
  it('should return an express router instance', function() {
    expect(mealIndex).to.equal(routerStub);
  });

  describe('GET /api/meals', function() {
    it('should route to meal.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'mealCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/meals/:id', function() {
    it('should route to meal.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'mealCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/meals', function() {
    it('should route to meal.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'mealCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/meals/:id', function() {
    it('should route to meal.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'mealCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/meals/:id', function() {
    it('should route to meal.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'mealCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/meals/:id', function() {
    it('should route to meal.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'mealCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
