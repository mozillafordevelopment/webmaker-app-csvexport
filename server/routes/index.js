var fs = require('fs');
var path = require('path');

module.exports = function(app)
{
    var routeFileList = fs.readdirSync(__dirname);
    for (var i in routeFileList)
    {
        var routeFile = routeFileList[i];
        routeFile = path.normalize(path.basename(routeFile, path.extname(routeFile)));
        if (routeFile && routeFile !== 'index')
        {
            require('.' + path.sep + routeFile)(app);
        }
    }
};
