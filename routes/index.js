var express = require('express');
const exec = require('child_process').exec;

var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/scriptDb');
var Schema = mongoose.Schema;

var scriptSchema = new Schema({
  ID: String,
  Name: String,
  Script: String,
  OptionsHTML: String
});

var theScript = mongoose.model('script', scriptSchema);

var theScriptOutput = "";

router.get('/', function(req, res, next) {
  theScript.find().sort({ID: 1}) // order by ID
    .then(function(doc) {
      console.log("Array length is: " + doc.length);
      res.render('index', {title: "My Page", items: doc, scriptOutput: theScriptOutput});
    });
});

// run a script
router.post('/exec/*', function(req, res, next) {
  console.log(req.body);
  theScript.findOne({'ID': req.url.substring(6, req.url.length)}, function(err, obj) {
    var command = "";

    // adjust the command for each script
    console.log("ID " + obj.id);
    if (obj.Script == 'tf') {
      command += obj.Script + " " + req.body.numFiles + " " + req.body.location + " " + req.body.name + " " + req.body.extension;
    } else if (obj.Script == 'ls') { // ls
      command += obj.Script + " " + req.body.dir;
      console.log(command);
    } else if (obj.Name == 'Other Command') {
      command += req.body.command;
    } else {
      command = obj.Script;
    }

    // execute the script
    var yourscript = exec(command, (error, stdout, stderr) => {
      console.log(`${stdout}`);
		  theScriptOutput = `${stdout}`;
  		theScriptOutput += `${stderr}`;
    	console.log(`${stderr}`);
     	if (error !== null) {
        console.log(`exec error: ${error}`);
      }
      res.redirect('/');
  	});
  });
});

// delete a script
router.post('/delete/*', function(req, res, next) {
  var idVal = req.url.substring(8, req.url.length);

  console.log("IDVal " + idVal);

   theScript.findOneAndRemove({'ID':idVal}, function(err, obj) {
     theScriptOutput = "ID: " + obj.ID + " has been deleted";
     console.log(theScriptOutput);
     res.redirect('/');
   });
});

router.get('/manpages', function(req, res, next) {
  res.render('manpages', {title: "My Page"});
});
module.exports = router;
