var _ = require('underscore');
var csvStringify = require('csv-stringify');

this.dataSets2CSV = function (data, callback)
{
    var formatUnixTime = function(unix) {
        var date = new Date(unix);
        var options = {
            weekday: 'short',
            era: null,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: null
        };
        return date.toLocaleString('en-US', options);
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
            if (!block) return;
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
};

module.exports = this;
