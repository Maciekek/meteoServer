'use strict';

/* Controllers */

var app = angular.module('test', []);

app.controller('mainCtrl', ['$scope', '$http',
	function($scope, $http) {
		console.log("test");
		var test1;
		$http.get("/getTemperatureData").success(function(temps) {
			console.log(temps);
			$scope.temps = temps;
		});

		$http.get("/getTemperature").success(function(temps) {
			console.log(temps);
			// $scope.temps = temps;
			$('#container').highcharts({
				title: {
					text: 'Temperaturki',
					x: -20 //center
				},
				yAxis: {
					title: {
						text: test
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},
				tooltip: {
					valueSuffix: '°C'
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0
				},
				series: [{
					name: temps.names[0],
					data: temps.list[0]
				}, {
					name: temps.names[1],
					data: temps.list[1]
				}, {
					name: temps.names[2],
					data: temps.list[2]
				}, {
					name: temps.names[3],
					data: temps.list[3]
				}]
			});



		});
		var test = "test";



	}
]);