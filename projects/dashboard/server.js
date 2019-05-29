"use strict";
exports.__esModule = true;
require("es6-shim");
require("reflect-metadata");
var path = require("path");
var bodyParser = require("body-parser");
var moment = require("moment");
var httpProxy = require("http-proxy");
var express = require('express');
var apiForwardingUrl = 'http://localhost:5100';
// Forwarding from http to https
var proxyOptions = {
    changeOrigin: true
};
var apiProxy = httpProxy.createProxyServer(proxyOptions);
var Server = /** @class */ (function () {
    function Server() {
        var _this = this;
        this.port = 9090;
        // Create expressjs application
        this.app = express();
        // Api proxy
        this.app.all('/api/*', function (req, res) {
            httpProxy.prototype.onError = function (err) {
                console.log('API response error: ' + err);
            };
            apiProxy.web(req, res, { target: apiForwardingUrl });
            console.log('API redirect requests to: ' + apiForwardingUrl);
        });
        // Redirect all the other resquests
        this.app.get('*', function (req, res) {
            var projectName = __dirname.split('/').pop().trim();
            if (/\.[^\/]+$/.test(req.originalUrl)) {
                console.log('serving-assets: ', 'dist' + req.originalUrl);
                res.sendFile(path.resolve("../../dist/" + projectName + "/" + req.originalUrl));
            }
            else {
                console.log('servindg-routes: ', 'dist' + req.originalUrl + 'index.html');
                res.sendFile(path.resolve("../../dist/" + projectName + "/index.html"));
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
        this.app.listen(this.port, function () { return console.log("LISTEN ON: http://localhost:" + _this.port); });
        // Catch errors
        this.app.on('error', function (error) {
            console.error(moment().format(), 'ERROR', error);
        });
        process.on('uncaughtException', function (error) {
            console.log(moment().format(), error);
        });
    }
    Server.bootstrap = function () {
        return new Server();
    };
    return Server;
}());
// Bootstrap the server
var server = Server.bootstrap();
exports["default"] = server.app;
