import db from '../db.js';

let Episode = new db('episode', {
  show: String, // show
  name: String,
  season: Number,
  number: Number,
  airdate: Date,
  status: String,
  blacklist: [String],
  download: {
    name: String,
    percentComplete: Number,
    id: String,
    status: String,
    eta: String,
    startedAt: Date,
    finishedAt: Date
  },
  show_id: String, // show
  rage_id: Number, // show
  tvmaze_id: Number, // show
  tvdb_id: Number, // show
  summary: String,
  path: String
}, {});

export default Episode;
