import 'es6-shim';
import 'reflect-metadata';
import { Request, Response } from 'express-serve-static-core';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as moment from 'moment';
import * as httpProxy from 'http-proxy';

const express = require('express');
const apiForwardingUrl = 'http://localhost:5100';
// Forwarding from http to https
const proxyOptions = {
  changeOrigin: true
};
const apiProxy = httpProxy.createProxyServer(proxyOptions);

class Server {
  public app: any;
  private port = 9090;

  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    // Create expressjs application
    this.app = express();
    // Api proxy
    this.app.all('/api/*', (req, res) => {
      httpProxy.prototype.onError = (err) => {
        console.log('API response error: ' + err);
      };
      apiProxy.web(req, res, {target: apiForwardingUrl});
      console.log('API redirect requests to: ' + apiForwardingUrl);
    });

    // Redirect all the other resquests
    this.app.get('*', (req: Request, res: Response) => {
      const projectName = __dirname.split('/').pop().trim();
      if (/\.[^\/]+$/.test(req.originalUrl)) {
        console.log('serving-assets: ', 'dist' + req.originalUrl);
        res.sendFile(path.resolve(`../../dist/${projectName}/${req.originalUrl}`));
      } else {
        console.log('servindg-routes: ', 'dist' + req.originalUrl + 'index.html');
        res.sendFile(path.resolve(`../../dist/${projectName}/index.html`));
      }
    });

    // BodyParser limits
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.raw({ limit: '50mb' }));
    this.app.use(bodyParser.text({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({
      limit: '50mb',
      extended: true
    }));

    // Start the server on the provided port
    this.app.listen(this.port, () => console.log(`LISTEN ON: http://localhost:${this.port}`));

    // Catch errors
    this.app.on('error', (error: any) => {
      console.error(moment().format(), 'ERROR', error);
    });

    process.on('uncaughtException', (error: any) => {
      console.log(moment().format(), error);
    });
  }
}

// Bootstrap the server
const server = Server.bootstrap();
export default server.app;
