/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/logs              ->  index
 * POST    /api/logs              ->  create
 * GET     /api/logs/:id          ->  show
 * PUT     /api/logs/:id          ->  upsert
 * PATCH   /api/logs/:id          ->  patch
 * DELETE  /api/logs/:id          ->  destroy
 */

'use strict';

import mongoose from 'mongoose';

import jsonpatch from 'fast-json-patch';
import Log from './log.model';

import Meal from '../meal/meal.model';
import Food from '../food/food.model';
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

// Gets a list of Logs
export function index(req, res) {
  return Log.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Log from the DB
export function show(req, res) {

  return Meal.aggregate([
    { $match : { _user: req.user._id } },
    {
      $lookup: {
        from: "foodentries",
        localField: "_id",
        foreignField: "_meal",
        as: "foodEntry"
      }
    },
    {
      $unwind: {
        path: "$foodEntry",
        preserveNullAndEmptyArrays: true
      }
    },
    { 
      $project : { 
        _id: 1, 
        index: 1,
        name: 1,
        foodEntry: {
          $cond: { if: { $eq: [ "$foodEntry._log", req.params.id ] }, then: "$foodEntry", else: null }
        }
      }
    },
    {
      $lookup:
        {
          from: "foods",
          localField: "foodEntry._food",
          foreignField: "_id",
          as: "food"
        }
    },
    {
      $unwind: {
        path: "$food",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group : {
        _id : { 
          _id: "$_id", 
          name: "$name", 
          index: "$index"
        },
        // totalCalories: { $sum: { $multiply: [ "$food.calories", "$foodEntry.servings" ] } },
        // totalCarbs: { $sum: { $multiply: [ "$food.totalCarbs", "$foodEntry.servings" ] } },
        // totalFat: { $sum: { $multiply: [ "$food.totalFat", "$foodEntry.servings" ] } },
        // totalProtein: { $sum: { $multiply: [ "$food.protein", "$foodEntry.servings" ] } },
        foodEntries: { 
          $push: { 
            _id: "$foodEntry._id", 
            servings: "$foodEntry.servings", 
            food: "$food" 
          } 
        }
      }
    },
    { 
      $project : { 
        _id: 1, 
        // totalCalories:1,
        // totalCarbs:1,
        // totalFat:1,
        // totalProtein:1,
        foodEntries: {
          $filter: {
             input: "$foodEntries",
             as: "foodEntry",
             cond: { $gt: [ "$$foodEntry.servings", 0 ] } // Fix Later w/ more appropriate comparison
          }
        }
      }
    },
    { $sort : { "_id.index" : 1 } }
  ])
  .exec()
  .then(respondWithResult(res))
  .catch(handleError(res));

  // return Log.findById(req.params.id).exec()
  //   .then(handleEntityNotFound(res))
  //   .then(respondWithResult(res))
  //   .catch(handleError(res));
}

// Creates a new Log in the DB
export function create(req, res) {
  return Log.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Log in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Log.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Log in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Log.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Log from the DB
export function destroy(req, res) {
  return Log.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
