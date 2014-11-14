var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var config = aRequire('config');
var csvutil = aRequire('util/csv');
var Data = aRequire('util/data');

sendNotAcceptable = function(appId, res)
{
    res.status(406);
    res.end('406 Not Acceptable');
};

var sendServerError = function()
{
    res.status(500);
    res.end('500 Internal Server Error');
};

sendCSV = function(appId, res, err, data)
{
    if (err)
    {
        sendServerError();
    }
    else
    {
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', 'inline; filename="' + appId + '.csv' + '"');
        csvutil.dataSets2CSV(data, function(err, csvString)
        {
            res.send(csvString).end();
        });
    }
};

sendJSON = function(appId, res, err, data)
{
    if (err)
    {
        sendServerError();
    }
    else
    {
        res.send(JSON.stringify(data)).end();
    }
};

module.exports = function(app)
{
    app.all('/app/:appId', function(req, res)
    {
        var appId = req.params.appId;
        var myself = this;

        var sendMethod;
        var proceed = false;

        switch (req.accepts('text/csv', 'json'))
        {
            case 'text/csv':
                proceed = true;
                sendMethod = sendCSV.bind(undefined, appId, res);
            break;

            case 'json':
                proceed = true;
                sendMethod = sendJSON.bind(undefined, appId, res);
            break;

            default:
                proceed = false;
                sendMethod = sendNotAcceptable.bind(undefined, appId, res);
            break;
        }

        if (proceed)
        {
            data = new Data(appId);
            data.getAllDataSets(function(dataSets, err)
            {
                sendMethod(err || null, dataSets || null);
            });
        }
        else
        {
            sendMethod();
        }
    });
};
