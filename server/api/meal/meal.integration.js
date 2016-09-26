'use strict';

var app = require('../..');
import request from 'supertest';

var newMeal;

describe('Meal API:', function() {
  describe('GET /api/meals', function() {
    var meals;

    beforeEach(function(done) {
      request(app)
        .get('/api/meals')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          meals = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(meals).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/meals', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/meals')
        .send({
          name: 'New Meal',
          info: 'This is the brand new meal!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newMeal = res.body;
          done();
        });
    });

    it('should respond with the newly created meal', function() {
      expect(newMeal.name).to.equal('New Meal');
      expect(newMeal.info).to.equal('This is the brand new meal!!!');
    });
  });

  describe('GET /api/meals/:id', function() {
    var meal;

    beforeEach(function(done) {
      request(app)
        .get(`/api/meals/${newMeal._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          meal = res.body;
          done();
        });
    });

    afterEach(function() {
      meal = {};
    });

    it('should respond with the requested meal', function() {
      expect(meal.name).to.equal('New Meal');
      expect(meal.info).to.equal('This is the brand new meal!!!');
    });
  });

  describe('PUT /api/meals/:id', function() {
    var updatedMeal;

    beforeEach(function(done) {
      request(app)
        .put(`/api/meals/${newMeal._id}`)
        .send({
          name: 'Updated Meal',
          info: 'This is the updated meal!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedMeal = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMeal = {};
    });

    it('should respond with the original meal', function() {
      expect(updatedMeal.name).to.equal('New Meal');
      expect(updatedMeal.info).to.equal('This is the brand new meal!!!');
    });

    it('should respond with the updated meal on a subsequent GET', function(done) {
      request(app)
        .get(`/api/meals/${newMeal._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let meal = res.body;

          expect(meal.name).to.equal('Updated Meal');
          expect(meal.info).to.equal('This is the updated meal!!!');

          done();
        });
    });
  });

  describe('PATCH /api/meals/:id', function() {
    var patchedMeal;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/meals/${newMeal._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Meal' },
          { op: 'replace', path: '/info', value: 'This is the patched meal!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedMeal = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedMeal = {};
    });

    it('should respond with the patched meal', function() {
      expect(patchedMeal.name).to.equal('Patched Meal');
      expect(patchedMeal.info).to.equal('This is the patched meal!!!');
    });
  });

  describe('DELETE /api/meals/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/meals/${newMeal._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when meal does not exist', function(done) {
      request(app)
        .delete(`/api/meals/${newMeal._id}`)
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
