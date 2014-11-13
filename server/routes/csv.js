var fs = require('fs');
var path = require('path');
var Firebase = require('firebase');
var csvStringify = require('csv-stringify');
var _ = require('underscore');
var config = aRequire('config');

var getAllDataSets = function (fb, callback)
{
    if (!callback || typeof callback !== 'function')
    {
        return;
    }

    fb.on('value', function (dataSnapshot)
    {
        console.log('received data sets for current app');

        var dataSets = [];
        if (dataSnapshot !== null)
        {
            dataSnapshot = dataSnapshot.val();

            for (var i in dataSnapshot)
            {
                if (dataSnapshot.hasOwnProperty(i))
                {
                    dataSnapshot[i].firebaseId = i;
                    dataSets.push(dataSnapshot[i]);
                }
            }
        }

        if (callback && typeof callback === 'function')
        {
            callback(null, dataSets);
        }

    },
    function (err)
    {
        console.error('receiving data from firebase failed', error);
        callback(err, null);
    });
};

function toCSV(data, callback)
{
    _.each(data, function(dat)
    {
        console.log('DATA! : ', dat);
    });

    var formatUnixTime = function(unix) {
        var date = new Date(unix);
        var options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleTimeString('en-US', options);
    };

    var rows = [];
    var knownCols = ['Time submitted'];
    var knownColsIds = [0];

    _.each(data, function(set, key)
    {
        var row = [];
        row[0] = formatUnixTime(set.submitted);
        _.each(set.dataBlocks, function(block, key)
        {
            var colId = block.internalIndex;
            var colName = block.label + ' [#' + block.blockIndex + ']';
            var colIdIndex = knownColsIds.indexOf(colId);
            if (colIdIndex < 0)
            {
                colIdIndex = knownColsIds.push(colId) - 1;
                knownCols[colIdIndex] = colName;
            }
            else if (knownCols[colIdIndex] !== colName)
            {
                knownCols[colIdIndex] = colName;
            }
            row[colIdIndex] = block.value;
        });
        rows.push(row);
    });

    var finished = [];
    finished.push(knownCols);
    _.each(rows, function(row, rowIndex)
    {
        var r = [];
        _.each(knownColsIds, function(colId, colIdIndex)
        {
            if (row[colIdIndex])
            {
                r.push(row[colIdIndex]);
            }
            else
            {
                r.push('-');
            }
        });
        finished.push(r);
    });

    csvStringify(finished, function(err, csvString)
    {
        callback(err || null, csvString || null);
    });
}

module.exports = function(app)
{
    app.all('/app/:appId', function(req, res)
    {
        var sendMethod = res.send;
        var appId = req.params.appId;
        var fb = new Firebase(config.firebase.url + '/' + appId);
        if (fb.getAuth() === null && false)
        {
            fb.authAnonymously(function (error, authData)
            {
                if (error)
                {
                    console.error('auth with FireBase failed', error, authData);
                }
                else
                {
                    console.log('auth with FireBase');
                    getAllDataSets(fb, function(err, data)
                    {
                        sendMethod(data);
                    });
                }
            });
        }
        else
        {
            console.log('skipping auth with FireBase');
            getAllDataSets(fb, function(err, data)
            {
                sendMethod(data);
            });
        }

        switch (req.accepts('text/csv', 'json'))
        {
            case 'text/csv':
                sendMethod = function(data)
                {
                    res.set('Content-Type', 'text/csv');
                    res.set('Content-Disposition', 'inline; filename="' + appId + '.csv' + '"');
                    toCSV(data, function(err, csvString)
                    {
                        res.send(csvString).end();
                    });
                };
            break;

            case 'json':
                sendMethod = function(data)
                {
                    res.json(data).end();
                };
            break;

            default:
                console.log('false type');
                sendMethod = function(data)
                {
                    res.end('406 Not Acceptable');
                };
            break;
        }
    });
};
