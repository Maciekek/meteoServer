'use strict';

var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);

var fs = require('fs');
var names = [];
var data = {
	'names': []
};
var allTemperaturesOne = [
	[],
	[],
	[],
	[]
];

var time;

app.use(express.static(__dirname + '/app'));


var getNamesConfing = function() {

	var config = fs.readFileSync('./confing.json', "UTF-8");

	config = JSON.parse(config);
	names = config.names;
	time = config.time * 1000;
	console.log("Interwał: " + time);
}();

httpServer.listen(3000, function() {
	console.log('Express server listening on port ' + 3000);

});



var extractTemperature = function(temps) {
	if(!temps){
		return;
	}
	var temperatures = temps.split("      ");
	temperatures = temperatures.slice(1, temperatures.length);
	return temperatures;

}

var getLastRecord = function(array) {
	
	if(array[array.length - 1].length==0)
	{
		return array[array.length - 2];	
	}
	else {
		return array[array.length - 1];		
	}
}

var getTemperature = function() {
	var array = fs.readFileSync('./temp.txt').toString().split("\n");
	var actualtemperatureRecord = getLastRecord(array);

	actualtemperatureRecord = extractTemperature(actualtemperatureRecord);

	var temperatureWithNames = {};

	for (var i = 0; i < actualtemperatureRecord.length; i++) {
		temperatureWithNames[i] = {
			"name": names[i],
			"temperature": actualtemperatureRecord[i]
		}
	};


	return temperatureWithNames;

}

var getNewTemperatureToList = function() {
	var array = fs.readFileSync('./temp.txt').toString().split("\n");
	var actualtemperatureRecord = getLastRecord(array);

	actualtemperatureRecord = extractTemperature(actualtemperatureRecord);
	

	for (var i = 0; i < 4; i++) {
		data['names'][i] = names[i];
		try {
			var temp = actualtemperatureRecord[i].match(/\d*/g)[0];
			allTemperaturesOne[i]
			allTemperaturesOne[i].push(parseInt(temp));
			console.log("OK")
		}catch(ex){
			console.log("Program nie może odczytać danych z pliku! Być może plik jest pusty, lub zmieniło się formatowanie tekstu");
		}

	}
}


setInterval(function() {
	getNewTemperatureToList()
}, time);

app.get('/', function(req, res) {
	var temperature = getTemperature();
	//res.send(temperature);
	res.sendfile('./app/index.html');
});

app.get('/getTemperature', function(req, res) {
	var temperature = getTemperature();
	data.list = allTemperaturesOne;
	res.send(data);
})

app.get('/getTemperatureData', function(req, res) {
	var temperature = getTemperature();

	res.send(temperature);

})