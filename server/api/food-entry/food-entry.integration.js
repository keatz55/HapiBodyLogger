'use strict';

var app = require('../..');
import request from 'supertest';

var newFoodEntry;

describe('FoodEntry API:', function() {
  describe('GET /api/food-entries', function() {
    var foodEntrys;

    beforeEach(function(done) {
      request(app)
        .get('/api/food-entries')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          foodEntrys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(foodEntrys).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/food-entries', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/food-entries')
        .send({
          name: 'New FoodEntry',
          info: 'This is the brand new foodEntry!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFoodEntry = res.body;
          done();
        });
    });

    it('should respond with the newly created foodEntry', function() {
      expect(newFoodEntry.name).to.equal('New FoodEntry');
      expect(newFoodEntry.info).to.equal('This is the brand new foodEntry!!!');
    });
  });

  describe('GET /api/food-entries/:id', function() {
    var foodEntry;

    beforeEach(function(done) {
      request(app)
        .get(`/api/food-entries/${newFoodEntry._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          foodEntry = res.body;
          done();
        });
    });

    afterEach(function() {
      foodEntry = {};
    });

    it('should respond with the requested foodEntry', function() {
      expect(foodEntry.name).to.equal('New FoodEntry');
      expect(foodEntry.info).to.equal('This is the brand new foodEntry!!!');
    });
  });

  describe('PUT /api/food-entries/:id', function() {
    var updatedFoodEntry;

    beforeEach(function(done) {
      request(app)
        .put(`/api/food-entries/${newFoodEntry._id}`)
        .send({
          name: 'Updated FoodEntry',
          info: 'This is the updated foodEntry!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFoodEntry = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFoodEntry = {};
    });

    it('should respond with the original foodEntry', function() {
      expect(updatedFoodEntry.name).to.equal('New FoodEntry');
      expect(updatedFoodEntry.info).to.equal('This is the brand new foodEntry!!!');
    });

    it('should respond with the updated foodEntry on a subsequent GET', function(done) {
      request(app)
        .get(`/api/food-entries/${newFoodEntry._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let foodEntry = res.body;

          expect(foodEntry.name).to.equal('Updated FoodEntry');
          expect(foodEntry.info).to.equal('This is the updated foodEntry!!!');

          done();
        });
    });
  });

  describe('PATCH /api/food-entries/:id', function() {
    var patchedFoodEntry;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/food-entries/${newFoodEntry._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched FoodEntry' },
          { op: 'replace', path: '/info', value: 'This is the patched foodEntry!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFoodEntry = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFoodEntry = {};
    });

    it('should respond with the patched foodEntry', function() {
      expect(patchedFoodEntry.name).to.equal('Patched FoodEntry');
      expect(patchedFoodEntry.info).to.equal('This is the patched foodEntry!!!');
    });
  });

  describe('DELETE /api/food-entries/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/food-entries/${newFoodEntry._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when foodEntry does not exist', function(done) {
      request(app)
        .delete(`/api/food-entries/${newFoodEntry._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
