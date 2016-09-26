/**
 * Food model events
 */

'use strict';

import {EventEmitter} from 'events';
import Food from './food.model';
var FoodEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FoodEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Food.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FoodEvents.emit(event + ':' + doc._id, doc);
    FoodEvents.emit(event, doc);
  };
}

export default FoodEvents;
