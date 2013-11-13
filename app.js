var express = require("express");
var app = express();


var folderName = "";
var AdmZip = require('adm-zip');


/// Include the express body parser
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
});

var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='image'/>" +
"<input type='submit' /></form>" +
"</body></html>";

app.get('/', function (req, res){
	res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(form);	
	/*res.render('index',
    { title : 'Home' }
    );*/
	
});

/// Include the file module
var fs = require('fs');

/// Post files
app.post('/upload', function(req, res) {

	fs.readFile(req.files.image.path, function (err, data) {

		var fileName = req.files.image.name;

		/// If there's an error
		if(!fileName){

			console.log("There was an error")
			res.redirect("/");
			res.end();

		} else {
			// Create a directory
			folderName = process.pid;
			fs.mkdir("./tmp/"+folderName, function (err) {
				var newPath = "./tmp/"+folderName+"/"+ fileName;

				// write file to uploads/fullsize folder
				fs.writeFile(newPath, data, function (err) {
					// Unzip the file in the current folder
					//unzipFile(newPath);
					
					res.render('display',{modelName:"toto.babylon"});
					// let's see it;
			});

            });
		}
	});
});

// Unzip the given file in the current folder
var unzipFile = function (zipfile) {
	var zip = new AdmZip(zipfile);
	zip.extractAllTo("./tmp/"+folderName, true);
};

// Returns the name of the file with .babylon extension
var findBabylonFile = function (folderPath) {
    
};

app.listen(80);
console.log("Running on port "+80);
