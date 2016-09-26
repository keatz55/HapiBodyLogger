/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/food-entries              ->  index
 * POST    /api/food-entries              ->  create
 * GET     /api/food-entries/:id          ->  show
 * PUT     /api/food-entries/:id          ->  upsert
 * PATCH   /api/food-entries/:id          ->  patch
 * DELETE  /api/food-entries/:id          ->  destroy
 */

'use strict';

import mongoose from 'mongoose';

import jsonpatch from 'fast-json-patch';
import FoodEntry from './food-entry.model';

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

// Gets a list of FoodEntrys
export function index(req, res) {

  // console.log(req.query);  
  var d = new Date();
  d.setDate(d.getDate() - (req.query.days || 7) );
  // console.log(d.toString());

  return FoodEntry.aggregate([
    { 
      $match : { 
        $and: [
          { _user: req.user._id },
          {
            date: {
              $gte: d
            }
          }
        ]
      } 
    },
    {
      $lookup: {
        from: "foods",
        localField: "_food",
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
          date: { $dateToString: { format: "%m/%d", date: "$date" } },
          order: "$date"
        },
        foodEntries: { 
          $push: { 
            _id: "$_id", 
            servings: "$servings", 
            food: "$food" 
          } 
        }
      }
    },
    { $sort : { "_id.order" : -1 } }
  ])
  .exec()
  .then(respondWithResult(res))
  .catch(handleError(res));

  // return FoodEntry.find()
  //   .populate('_food _meal')
  //   .exec()
  //   .then(respondWithResult(res))
  //   .catch(handleError(res));


}

// Gets a single FoodEntry from the DB
export function show(req, res) {
  return FoodEntry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new FoodEntry in the DB
export function create(req, res) {

  req.body._user = req.user._id;
  
  return FoodEntry.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given FoodEntry in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return FoodEntry.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing FoodEntry in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return FoodEntry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a FoodEntry from the DB
export function destroy(req, res) {
  return FoodEntry.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
