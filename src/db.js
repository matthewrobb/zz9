import LinvoDB from 'linvodb3';

// Initialize
LinvoDB.defaults.store = { db: require('medeadown')}
LinvoDB.dbPath = 'data/';

export default LinvoDB;
