'use strict';

import mongoose from 'mongoose';

var FoodSchema = new mongoose.Schema({
  name: String,
  brand: String,

  servingSize: String,
  servingsPerContainer: String,
  calories: Number,
  caloriesFromFat: Number,
  totalFat: Number,
  saturatedFat: Number,
  polyunsaturatedFat: Number,
  monounsaturatedFat: Number,
  transFat: Number,
  cholesterol: Number,
  sodium: Number,
  potassium: Number,
  totalCarbs: Number,
  dietaryFiber: Number,
  sugars: Number,
  protein: Number,
  vitaminA: Number,
  vitaminC: Number,
  calcium: Number,
  iron: Number,

  public: Boolean,

  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Food', FoodSchema);
