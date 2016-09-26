'use strict';

import mongoose from 'mongoose';

var FoodEntrySchema = new mongoose.Schema({
  servings: Number,
  _food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  _meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
  _log: { type: String, ref: 'Log' },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
});

export default mongoose.model('FoodEntry', FoodEntrySchema);
