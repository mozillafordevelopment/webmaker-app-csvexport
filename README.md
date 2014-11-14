webmaker-app-csvexport
======================

This little node package provides a basic service to export data
users submitted to a webmaker-app as csv or json (just be sure to send the correct `Accept` header).  
You can configure the service via the `config/index.js` file and start it with `node . `.  
The main logic is in the `server/routes/` directory, which contains an `index.js`
which will again load all other modules in this directory.  
There are utility functions in the `util/` directory,
with the `data.js` module beeing mostly a copy of the mozilla webmaker-app's one.
