var express = require('express');
var app = express();
var config = aRequire('config');

require('./routes')(app);

var server;
if (config.protocoll.type === 'https')
{
    server = require('https').createServer(config.protocoll.crypto, app);
}
else
{
    server = require('http').createServer(app);
}

server.listen(config.port, config.host, function()
{
    console.log('[webmaker-app-csvexport] listening at %s://%s:%s', config.protocoll.type, config.host, config.port);
});
