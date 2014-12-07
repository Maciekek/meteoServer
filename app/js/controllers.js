var app = angular.module('test', []);


app.controller('mainCtrl', ['$scope', '$http',
	function($scope, $http) {
		console.log("test");
		$scope.test = "test";


	}
]);