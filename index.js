var path = require('path');

global.root = path.normalize(__dirname);
global.aRequire = function(p)
{
    return require(path.join(global.root, path.normalize(p)));
};
global.rRequire = function(p)
{
    return require('.' + path.sep + path.normalize(p));
};

var server = rRequire('server');
