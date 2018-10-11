import './raven';
import * as Raven from 'raven';
import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import {Db, Collection, MongoClient} from 'mongodb';

const MONGO_URI = process.env.CUSTOMCONNSTR_MONGO_URI || process.env.MONGO_URI;
const PORT = process.env.PORT || 80;

let db: Db = null;
let redirects: Collection = null;

export interface Redirect {
  action: {
    destination: string
  };
  created: Date;
  creator: string;
  id: string;
  type: string;
  updated?: string;
  updater?: string;
}

async function sendFile(res: http.ServerResponse, filepath: string, status: number = 200) {
  const {size} = await util.promisify(fs.stat)(filepath);

  res.writeHead(status, {
    'Content-Length': size,
    'Content-Type': 'text/html'
  });
  fs.createReadStream(filepath).pipe(res);
}

async function redirector(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const reqUrl = url.parse(req.url);
  const id = reqUrl.path.substr(1);

  // Homepage
  if(!id) {
    return sendFile(res, path.resolve(__dirname, '../static/home.html'));
  }
  // Homepage background
  if(id === 'background.jpg') {
    return sendFile(res, path.resolve(__dirname, '../static/background.jpg'));
  }

  const redirect = await redirects.findOne({id}) as Redirect;
  console.log(`[${new Date()}] ${req.url} - ${redirect ? 'found' : 'not found'}`);
  // 404
  if (!redirect) {
    return sendFile(res, path.resolve(__dirname, '../static/404.html'), 404);
  }
  // 500
  if (redirect.type !== 'redirect') {
    const rid = Raven.captureException(new TypeError('Got a redirect with a non-redirect type'), {
      extra: {
        id: redirect.id,
        type: redirect.type
      }
    });
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      error: {
        code: 'InternalError',
        id: rid,
        message: 'The application encountered an internal error'
      },
      success: 'false'
    }));
    return;
  }
  // Redirect it
  res.writeHead(302, {'Location': redirect.action.destination});
  res.end();
}

MongoClient.connect(MONGO_URI, {useNewUrlParser: true}, (err, client: MongoClient) => {
  if(err) throw err;
  console.log('Connected to DB!');

  db = client.db('apis');
  redirects = db.collection('redirects');

  const server = http.createServer(redirector);

  server.listen(PORT);
  console.log('Server running and listening on HTTP port ' + PORT);
});

