var express = require("express");
var app = express();


var folderName = "";
var AdmZip = require('adm-zip');
var path = require('path');


/// Include the express body parser
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
});

// Everything in public will be accessible from '/'
app.use(express.static(path.join(__dirname, 'public')));
app.use('/tmp', express.static(__dirname + '/tmp'));


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
			folderName = new Date().getTime();
			fs.mkdir("./tmp/"+folderName, function (err) {
			if (err){
				console.log(err);
			} else {
				var folderPath = "./tmp/"+folderName;
				var newPath = folderPath+"/"+ fileName;

				// write file to uploads/fullsize folder
				fs.writeFile(newPath, data, function (err) {
					// Unzip the file in the current folder
					unzipFile(newPath);
					var modelName = findBabylonFile(folderPath);
					//if (modelName) {						
						// let's see it;
						res.render('display',{model:modelName, folder:folderName});
					//} else {
					//	res.render('nothingFound');
					//}
				});
			}

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
	var file = "";
    fs.readdirSync(folderPath).forEach(function(f) {
		var ext = f.split('.').pop();
		if (ext == "babylon") {
			file = f;
		}
	});
	return file;
};


var port = process.env.PORT || 80;
app.listen(port);
console.log("Running on port "+port);
