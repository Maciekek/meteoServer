'use strict';
var express = require('express');
var app = express();
var httpServer = require("http").createServer(app);
var fs = require('fs');
var config = require('./serwerApp/configData.js');

app.use(express.static(__dirname + '/app'));

var temperatures = [
	[],
	[],
	[],
	[],
	[]
];

var getIntervalTime = function() {
	var intervalTime = config.getIntervalTime();
	console.log("Interval Value: " + intervalTime);
	return intervalTime;
};

var getThermometers = function() {
	var thermometers = config.getThermometers();
	return thermometers;
};

var extractTemp = function(tempData) {
	var reg = /t=\d*/
	var temp = reg.exec(tempData)[0];
	var temp;

	temp = temp.slice(2, 7);
	var actualTemp = temp.slice(0, 2) + "." + temp.slice(2, 6);

	console.log("actualTemp: " + actualTemp);
	return actualTemp;

}

var readNewTemp = function(tempPath) {
	var actualTemp;
	console.log(tempPath);
	var tempData = fs.readFileSync(tempPath, "UTF-8");

	return extractTemp(tempData);

}

var ThermometersMain = function() {
	var actualTemp;
	var thermometers = getThermometers()

	setInterval(function() {
		for (var i = 0; i < thermometers.length; i++) {
			console.log("actual Termomether: ");
			console.log(thermometers[i]);
			actualTemp = readNewTemp(thermometers[i].path);
			console.log(temperatures);

			temperatures[i].push(parseInt(actualTemp));
			console.log(temperatures[i]);
		}

	}, getIntervalTime())

}();



httpServer.listen(3000, function() {
	console.log('Express server listening on port ' + 3000);

});

app.get('/', function(req, res) {
	var temperature = getTemperature();

	res.sendfile('./app/index.html');
});

app.get('/getTemperature', function(req, res) {
	res.send(temperatures);
})
app.get('/getActualTemperature', function(req, res) {
	var thermometers = getThermometers()
	var actualTemp = [];
	for (var i = 0; i < thermometers.length; i++) {

		actualTemp[i] = readNewTemp(thermometers[i].path);
		actualTemp[i] = thermometers[i].name + ": " + actualTemp[i];
	}

	res.send(actualTemp);

})