const INTERVAL = 30000;

import ParseFeeds from './tasks/ParseFeeds.js';

const runTasks = () => {
  // parse feeds
  ParseFeeds.run();

  // backlog

  // monitor folder

  // watch downloads

};

export default class TaskWorker {

  start () {
    console.log('starting worker');
    this.stop();
    runTasks();
    this.interval = setInterval(runTasks, INTERVAL);
  }

  stop () {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
