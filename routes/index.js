var express = require('express');
const exec = require('child_process').exec;
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/scriptDb');
var Schema = mongoose.Schema;

var scriptSchema = new Schema({
  ID: Number,
  Name: String,
  Script: String,
  OptionsHTML: String
});

var theScript = mongoose.model('script', scriptSchema);

var theScriptOutput = "";

function fixScriptFormatForHTML() {
  theScriptOutput = theScriptOutput.replace(/ /g, "&ensp;")
  theScriptOutput = theScriptOutput.replace(/\n/g, "<br />");
}

router.get('/', function(req, res, next) {
  theScript.find().sort({
      ID: 1
    }) // order by ID
    .then(function(doc) {
      console.log("Array length is: " + doc.length);
      res.render('index', {
        title: "Scripts",
        items: doc,
        scriptOutput: theScriptOutput
      });
    });
});

// run a script
router.post('/exec/*', function(req, res, next) {
  console.log(req.body);
  theScript.findOne({
    'ID': req.url.substring(6, req.url.length)
  }, function(err, obj) {
    var command = "";

    console.log(req.body);
    // adjust the command for each script
    console.log("ID " + obj.id);
    if (obj.Script == 'tf') {
      command = obj.Script + " " + req.body.numFiles + " " + req.body.location + " " + req.body.name + " " + req.body.extension;
    } else if (obj.Script == 'notes') {
      command = obj.Script + " " + req.body.name + " " + req.body.location + " \"" + req.body.text + "\"";
    } else if (obj.Script == 'ls') { // ls
      command = obj.Script + " " + req.body.dir;
      console.log(command);
    } else if (obj.Script == 'cowsay') {
      console.log(req.body);
      if (req.body.cow == "") {
        command = "fortune | " + obj.Script;
      } else {
        command = obj.Script + " " + req.body.cow;
        console.log(command);
      }
    } else if (obj.Script == 'RWX777') {
      console.log("TYPE " + req.body.type);
      if (req.body.type == 'numbers') {
        command = obj.Script + " " + req.body.numberEntry1 + " " + req.body.numberEntry2 + " " + req.body.numberEntry3;
        console.log(command);
      } else if (req.body.type == 'letters') {
        command = obj.Script + " " + req.body.letterEntry1 + " " + req.body.letterEntry2 + " " + req.body.letterEntry3;
      }
    } else if (obj.Script == 'christmasTree') {
      command = obj.Script + " " + req.body.height;
    } else {
      command = obj.Script;
    }

    console.log(req.body);
    console.log("Command: " + command);
    // execute the script
    exec(command, function(error, stdout, stderr) {
      console.log(`${stdout}`);
      theScriptOutput = `${stdout}`;
      theScriptOutput += `${stderr}`;
      console.log(`${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }

      // fix the formatting so spaces and line breaks appear properly in html
      fixScriptFormatForHTML();

      // go back to index when execution is finished
      res.redirect('/');
    });
  });
});

// delete a script
router.post('/delete/*', function(req, res, next) {
  console.log(req.body);
  theScript.findOneAndRemove({
    'ID': req.url.substring(8, req.url.length)
  }, function(err, obj) {
    theScriptOutput = "ID: " + obj.ID + " has been deleted";
    console.log(theScriptOutput);
    res.redirect('/');
  });
});

// get man page from /
router.post('/man/*', function(req, res, next) {
  theScript.findOne({
    'ID': req.url.substring(5, req.url.length)
  }, function(err, obj) {
    var command = "man -P cat " + obj.Script;

    // execute the script
    exec(command, function(error, stdout, stderr) {
      console.log(`${stdout}`);
      theScriptOutput = `${stdout}`;
      theScriptOutput += `${stderr}`;
      console.log(`${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }

      fixScriptFormatForHTML();

      // go back to index when execution is finished
      res.redirect('/'); // redirect back to index when script finishes
    });
  });
});

// manpages page
router.get('/manpages', function(req, res, next) {
  res.render('manpages', {
    title: "Man Pages"
  });
});
module.exports = router;
