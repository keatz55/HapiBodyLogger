'use strict';

import mongoose from 'mongoose';

var LogSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Log', LogSchema);
