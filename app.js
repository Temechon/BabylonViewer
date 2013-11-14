var express = require("express");
// Zip 
var AdmZip = require('adm-zip');
var path = require('path');

// Include the file module
var fs = require('fs');

var app = express();

// The tmp folder name where the user zip file will be unzipped
var folderName = "";


// Include the express body parser
// And the Jade template engine
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
});

// Everything in public will be accessible from '/'
app.use(express.static(path.join(__dirname, 'public')));
// Everything in tmp should be accessible as well.
app.use('/tmp', express.static(__dirname + '/tmp'));

// Index page
app.get('/', function (req, res){
	res.render('index',{});
});

// Error page
app.get('/error', function (req, res){
	res.render('error',{});
});

// Upload form action
app.post('/upload', function(req, res) {

	fs.readFile(req.files.image.path, function (err, data) {

		var fileName = req.files.image.name;

		// If there's an error, redirect to error page
		if(!fileName){
			console.log("There was an error : filename empty");
			res.render('index',{error:"Cannot create folder"});

		} else {
			// Create a directory in tmp folder
			folderName = new Date().getTime();
			fs.mkdir("./tmp/"+folderName, function (err) {
				if (err){
					// If cannot create tmp folder, log error and redirect to error page
					console.log(err);
					res.render('index',{error:"Cannot create tmp folder"});
				} else {
					// The folder path in the tmp folder
					var folderPath = "./tmp/"+folderName;
					// The output path of the uploaded zip file
					var newPath = folderPath+"/"+ fileName;

					// Write file to output folder
					fs.writeFile(newPath, data, function (err) {
						if (err){
							// If cannot write in tmp folder, log error and redirect to error page
							console.log(err);
							res.render('index',{error:"Cannot write zip file in tmp folder"});
						} else {
							// Unzip the file in the tmp folder
							unzipFile(newPath);
							// Get the model name
							var modelName = findBabylonFile(folderPath);
							if (modelName) {						
								// let's see it;
								res.render('display',{model:modelName, folder:folderName});
							} else {
								res.render('index',{error:"The babylon file cannot be found"});
							}
						}
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
