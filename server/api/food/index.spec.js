'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var foodCtrlStub = {
  index: 'foodCtrl.index',
  show: 'foodCtrl.show',
  create: 'foodCtrl.create',
  upsert: 'foodCtrl.upsert',
  patch: 'foodCtrl.patch',
  destroy: 'foodCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var foodIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './food.controller': foodCtrlStub
});

describe('Food API Router:', function() {
  it('should return an express router instance', function() {
    expect(foodIndex).to.equal(routerStub);
  });

  describe('GET /api/food', function() {
    it('should route to food.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'foodCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/food/:id', function() {
    it('should route to food.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'foodCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/food', function() {
    it('should route to food.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'foodCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/food/:id', function() {
    it('should route to food.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'foodCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/food/:id', function() {
    it('should route to food.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'foodCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/food/:id', function() {
    it('should route to food.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'foodCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
