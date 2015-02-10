var fs = require('fs');

var configData;
var test = function  () {
	console.log("test");
}
exports.test= test;


var readFile = function() {
	console.log("reading config file...");
	configData = JSON.parse(fs.readFileSync("./config.json"));	
}();


var getIntervalTime = function  () {
	return configData.interval;
}
exports.getIntervalTime = getIntervalTime;

var getThermometers = function  () {
	return configData.thermometersInfo;
}
exports.getThermometers = getThermometers;