/**
 * FoodEntry model events
 */

'use strict';

import {EventEmitter} from 'events';
import FoodEntry from './food-entry.model';
var FoodEntryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FoodEntryEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  FoodEntry.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FoodEntryEvents.emit(event + ':' + doc._id, doc);
    FoodEntryEvents.emit(event, doc);
  };
}

export default FoodEntryEvents;
