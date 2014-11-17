var fs = require('fs');

module.exports =
{
    host: 'localhost',
    port: 8081,
    protocoll:
    {
        type: 'http',
        crypto:
        {
            key: '',
            cert: ''
        }
    },
    firebase:
    {
        url: 'https://sizzling-inferno-3981.firebaseio.com'
    }
};
