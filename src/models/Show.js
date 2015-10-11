import db from '../db.js';

let Show = new db('show', {
  name: String,
  status: String,
  runtime: Number,
  rage_id: Number,
  tvmaze_id: Number,
  tvdb_id: Number,
  settings: {
    folder: String,
    seasonFolders: Boolean,
    quality: String, // any sd hd hd720 hd1080
    subscription: Boolean
  },
  wanted: Boolean
},{});

// Show.find({}, (err, docs) => {
//   if (!docs.length) populate();
// });

// Show.on('save', function(doc) {
//   console.log("saved");
// });

export default Show;
