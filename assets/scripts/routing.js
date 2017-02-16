app.config(function($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('');
	$routeProvider
	.when('/',{
		controller: 'calendarCtrl',
		templateUrl: 'assets/partials/calendar.html'
	})
	.when('/add', {
		controller: 'addCtrl',
		templateUrl: 'assets/partials/add.html'
	})
	.when('/remove', {
		controller: 'removeCtrl',
		templateUrl: 'assets/partials/remove.html'
	})
	.otherwise({
		redirectTo:'/'
	});
	
});