/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/meals              ->  index
 * POST    /api/meals              ->  create
 * GET     /api/meals/:id          ->  show
 * PUT     /api/meals/:id          ->  upsert
 * PATCH   /api/meals/:id          ->  patch
 * DELETE  /api/meals/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Meal from './meal.model';
import FoodEntry from '../food-entry/food-entry.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Meals
export function index(req, res) {
  return Meal.find({ _user: req.user._id }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Meal from the DB
export function show(req, res) {
  return Meal.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Meal in the DB
export function create(req, res) {

  req.body._user = req.user._id;

  return Meal.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Meal in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Meal.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true, new: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Meal in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Meal.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Meal from the DB
export function destroy(req, res) {
  FoodEntry.find({_meal:req.params.id}).remove().then(()=>{
    return Meal.findById(req.params.id).exec()
      .then(handleEntityNotFound(res))
      .then(removeEntity(res))
      .catch(handleError(res));
  });
}
