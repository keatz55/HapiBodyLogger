'use strict';

import mongoose from 'mongoose';

var MealSchema = new mongoose.Schema({
  index: Number,
  name: String,
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Meal', MealSchema);
