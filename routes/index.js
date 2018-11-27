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

    // adjust the command for each script
    if (obj.Script == 'cf') {
      console.log(req.body);
      command = obj.Script;
      if (req.body.numFiles != '') {
        command += " -n " + req.body.numFiles;
      } else {
        command += " -n 1";
      }

      if (req.body.location != '') {
        command += " -p " + req.body.location;
      } else {
        command += " -p .";
      }

      if (req.body.name != '') {
        command += " -f " + req.body.name;
      } else {
        command += " -f file";
      }

      if (req.body.extension != '') {
        command += " -e " + req.body.extension;
      } else {
        command += " -e txt";
      }

      if (req.body.tree == 'true') {
        command += " -t";
      }

      if (req.body.fill == 'true') {
        if (req.body.size != '') {
          command += " -s " + req.body.size;
        } else {
          command += " -s 1";
        }
      }
    } else if (obj.Script == 'notes') {
      command = obj.Script + " " + req.body.name + " " + req.body.location + " \"" + req.body.text + "\"";
    } else if (obj.Script == 'ls') { // ls
      command = obj.Script + " " + req.body.dir;
    } else if (obj.Script == 'cowsay') {
      if (req.body.cow == "") {
        command = "fortune | " + obj.Script;
      } else {
        command = obj.Script + " " + req.body.cow;
      }
    } else if (obj.Script == 'RWX777') {
      if (req.body.type == 'numbers') {
        command = obj.Script + " " + req.body.numberEntry1 + " " + req.body.numberEntry2 + " " + req.body.numberEntry3;
      } else if (req.body.type == 'letters') {
        command = obj.Script + " " + req.body.letterEntry1 + " " + req.body.letterEntry2 + " " + req.body.letterEntry3;
      } else if (req.body.type == 'letters') {
        command = obj.Script + " " + req.body.letterEntry1 + " " + req.body.letterEntry2 + " " + req.body.letterEntry3;
      }
    } else if (obj.Script == 'sysinf') {
      command = obj.Script + " " + req.body.CPU + " " + req.body.GPU + " " + req.body.MEM + " " + req.body.HDD + " " + req.body.NET + " " + req.body.SND;
    } else if (obj.Script == 'christmasTree') {
      command = obj.Script + " " + req.body.height;
    } else if (obj.Script == 'Vigenere_cipher') {
      if (req.body.type == 'encrypt') {
        command = obj.Script + " " + "-e" + " " + req.body.key + " " + req.body.string;
      } else if (req.body.type == 'decrypt') {
        command = obj.Script + " " + "-d" + " " + req.body.key + " " + req.body.string;
      }
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
