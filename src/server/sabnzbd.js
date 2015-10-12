import request from 'request';
import _ from 'lodash';

let get = (url) => {
  return new Promise ( (resolve, reject) => {

    request.get({url:url, json:true}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      reject(error);
    });
  });

}

export default class Sabnzbd {

    constructor(apikey,host,port,https) {
      let http = (https) ? 'https' : 'http';

      this.url = `${http}://${host}:${port}/api?output=json&apikey=${apikey}`;
    }

    async queue(start, limit) {
      let queue = await get(this.url + '&mode=queue');
      return queue.queue;
    }

    async findByName(name) {
      let queue = await this.queue();

      let item = _.findWhere(queue.slots, { filename: name});

      if (item) return item;

      let history = await this.history();

      return _.findWhere(history.slots, { name: name}) || null;
    }

    async history(start, limit) {
      let q = await get(this.url + '&mode=history');

      return q.history;
    }

    async deleteFromHistory(value) {
      let q = await get(this.url + '&mode=history&name=delete&value=' + value);

      return q;
    }

    async warnings(start, limit) {
      let q = await get(this.url + '&mode=warnings');

      return q;
    }

    async addURL(url, name, cat) {
      url = escape(url);
      let q = await get(this.url + `&mode=addurl&name=${url}&nzbname=${name}&cat=${cat}`);
      return q;
    }

}

// async function test() {
//   let sab = new Sabnzbd("164606e8a6a8dd901045555666e2cc9c",'tower','8080');
//   await sab.addURL("http://www.nzbs.org/getnzb/614b648af045150d429eeb2b6981a3f6.nzb%26i=2151%26r=4695d9b4ef7a0018bab9499995669476","Quantico s01e02", 'tv')
//   let q = await sab.queue();
//   console.log(q.queue.slots);
// }
//
// test();
