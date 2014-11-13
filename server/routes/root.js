var fs = require('fs');
var path = require('path');

module.exports = function(app)
{
    app.all('/', function(req, res)
    {
        fs.readFile(path.join(root, 'README.md'), function(err, file)
        {
            if (err || !file)
            {
                res.status(404);
                res.end('Not found');
            }
            else
            {
                res.end(file);
            }
        });
    });
};
