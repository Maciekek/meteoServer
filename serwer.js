'use strict';

var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);
var Q = require('q');
var fs = require('fs');
var names = [];
var data = {'names':[]};
var allTemperaturesOne = [[],[],[],[]];

var time;

app.use(express.static(__dirname + '/app'));


var getNamesConfing = function() {
	
	var config = fs.readFileSync('./confing.json', "UTF-8");

	config = JSON.parse(config);
	names = config.names;
	time = config.time*1000;
	console.log(time);
}();

httpServer.listen(3000, function() {
	console.log('Express server listening on port ' + 3000);
	
});



var extractTemperature = function(temps) {
	var temperatures = temps.split("      ");
	temperatures = temperatures.slice(1, temperatures.length);
	return temperatures;

}

var getLastRecord = function(array) {
	return array[array.length - 1];
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

	var temp = actualtemperatureRecord[0].match(/\d*/g)[0];
	console.log(parseInt(temp).constructor);
	allTemperaturesOne.push(parseInt(temp));


	for (var i = 0; i < 4; i++) {
		data['names'][i] = names[i];
		var temp = actualtemperatureRecord[i].match(/\d*/g)[0];
			allTemperaturesOne[i]
		allTemperaturesOne[i].push(parseInt(temp));

	}



}


setInterval(function() {
	console.log(time);
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

app.get('/getTemperatureData', function(req,res){
	var temperature = getTemperature();
	
	res.send(temperature);

})