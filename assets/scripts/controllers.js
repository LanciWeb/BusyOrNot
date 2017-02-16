app.controller('mainCtrl', function($scope, $location){
	$scope.active_class = function(path){
		return ($location.path() == path) ? 'active' : '';
	};	
});

app.controller('calendarCtrl', function($scope, calendario){
	$scope.date = new Date();
	$scope.month = $scope.date.getMonth(); 
	$scope.year = $scope.date.getFullYear();
	$scope.view = 'calendar';
	$scope.calendar_v = true;
	$scope.viewToggle = function(){
		$scope.calendar_v = !$scope.calendar_v;
		$scope.view = ($scope.view === "list") ? 'calendar' : 'list';
		calendario.show($scope.month, $scope.year, $scope.view);
	}

	
	$scope.browse_calendar = function(direction){
		if(direction == 'back'){
			if($scope.month == 0){
				$scope.year--;
				$scope.month = 11;
				calendario.show($scope.month, $scope.year, $scope.view);
			}else{
			$scope.month--;
			calendario.show($scope.month, $scope.year, $scope.view);
			}
		}
		else{
			if($scope.month == 11){
				$scope.year++;
				console.log('new year: '+$scope.year);
				$scope.month = 0;
				calendario.show($scope.month, $scope.year, $scope.view);
			}else{
				$scope.month++;
				calendario.show($scope.month, $scope.year, $scope.view);
			}
		}
	};
		
	$scope.calendar = calendario.show($scope.month, $scope.year, $scope.view);
	
});

app.controller('addCtrl', function($scope, $alert, $http){
	
	var alerts = {
	error: $alert({
		title: 'ATTENZIONE',
		content: 'Sono presenti errori di compilazione nel form!',
		type: 'danger',
		container: '#alerts',
		show: false
	}),
	pswMatchError: $alert({
		title: 'ATTENZIONE',
		content: 'I campi password non coincidono!',
		type: 'danger',
		container: '#alerts',
		show: false
	}),
	dateFormatError: $alert({
		title: 'ATTENZIONE',
		content: 'La data deve essere inserita secondo il modello "gg-mm-aaaa"',
		type: 'danger',
		container: '#alerts',
		show: false
	}),
	pswFormatError: $alert({
		title: 'ATTENZIONE',
		content: 'La password deve contenere da 5 a 8 caratteri. Non deve contenere caratteri speciali',
		type: 'danger',
		container: '#alerts',
		show: false
	}),
	constraintError: $alert({
		title: 'ATTENZIONE',
		content: 'La data indicata è già contrassegnata come non disponibile.',
		type: 'warning',
		container: '#alerts',
		show: false
	}),
	dberror: $alert({
		title: 'ATTENZIONE',
		content: 'Impossibile connettersi al database',
		type: 'danger',
		container: '#alerts',
		show: false
	}),
	success : $alert({
		title: 'OK',
		content: 'Indisponibilità aggiunta con successo!',
		type: 'success',
		container: '#alerts',
		show: false
	})
};
	
	
	
	$scope.aggiungi = function(){
		alerts.error.hide();
		alerts.pswMatchError.hide();
		alerts.dateFormatError.hide();
		alerts.pswFormatError.hide();
		alerts.constraintError.hide();
		alerts.dberror.hide();
		alerts.success.hide();
				
		if(!$scope.addForm.$valid){ 
			if(!$scope.addForm.data.$modelValue){
				return alerts.dateFormatError.show();
			};

			if(!$scope.addForm.psw.$modelValue || !$scope.addForm.psw.$modelValue){
				return alerts.pswFormatError.show();
			};

			return alerts.error.show();
		}

		if($scope.addForm.psw.$modelValue != $scope.addForm.pswrep.$modelValue){
			return alerts.pswMatchError.show();
		};
	
		if($scope.addForm.data.$valid){
			
			var inserted_date = $scope.addForm.data.$modelValue;
			if(inserted_date.length !== 10) return alerts.dateFormatError.show();
			else{
				/*sono stato costretto a farmi passare la data sottoforma di stringa
				per colpa della  differenza di validazione che Chrome e Firefox hanno nel gestire l'input di tipo date: 
				Chrome accettava il formato gg-mm-aaaa, Firefox invece accettava solo aaaa-mm-gg, 
				quindi ho preferito far passare una stringa e validarla con una RegEx. E si, lo ammetto, la regex l'ho copiata da un thread di StackOverflow!!
				*/
				$http.post('http://www.marcolanci.it/esercizi/angularcalendar/assets/scripts/add.php', {
					ind_date: inserted_date,
					password: $scope.addForm.psw.$modelValue
				})
				.then(function(response){
					console.log(response.status);
					console.log(response.data);
					if (!response.data) return alerts.constraintError.show();
					else return alerts.success.show();
				},function(data){
					console.log(data);
					console.log('errore: '+ data.status)
					return alerts.dberror.show();
				});	
			}
		 }
			
	}
	
	$scope.dateTooltip = {
		title: 'Indica la data in cui non sei disponibile	'
	}
	
	$scope.pswTooltip = {
		title: "Minimo 5 caratteri, massimo 8. Sono ammessi soltanto lettere e numeri."
	}
	
	$scope.pswrepTooltip = {
		title: "Ripeti la password e non dimenticarla!"
	}
	
});

app.controller('removeCtrl', function($scope, $alert, dates_service, $timeout){
	var alertMessages = {
		success : $alert({
		title: 'OK',
		content: 'La data non è più contrassegnata come indisponibile',
		type: 'success',
		container: '#container',
		show: false
	}),
		error : $alert({
		title: 'ATTENZIONE',
		content: 'La password inserita non è corretta',
		type: 'danger',
		container: '#container',
		show: false
	}),
		formatError : $alert({
		title: 'ATTENZIONE',
		content: 'La lunghezza della password deve essere compresa tra i 5 e gli 8 caratteri',
		type: 'danger',
		container: '#container',
		show: false
	}),
		noPassword : $alert({
		title: 'ATTENZIONE',
		content: 'Devi inserire la password!',
		type: 'warning',
		container: '#container',
		show: false
	})
	};
	
	
	
	/* si, lo so. La roba qui sotto fa schifo ma non riuscivo ad aggirare il problema: il controller era più veloce
	a gestire la view rispetto al servizio quindi la risposta della chiamata asincrona arrivava dopo 
	rispetto alla resa della view e la mia variabile dates sembrava undefined. Non ho trovato altro escamotage. 
	Nella visualizzazione del calendario, invece, ho risolto la cosa chiamando la funzione di generazione 
	del calendario stesso nella funzione di callback della chiamata al db. */
	
	$timeout(function(){
	$scope.dates = dates_service.get();
	// console.log($scope.dates);
	},1000);
	
	$scope.psw_ins=[];
	
	$scope.elimina = function(index){	
		alertMessages.error.hide();
		alertMessages.success.hide();
		alertMessages.formatError.hide();
		alertMessages.noPassword.hide();
	
	
		if(!$scope.psw_ins[index]) {
			// console.log($scope.psw_ins[index]);
			return alertMessages.noPassword.show();
		}
			
		var id = $scope.dates[index].id;
		var password = $scope.dates[index].password;
		var password_immessa = $scope.psw_ins[index];
		
		
		if( password_immessa === password){
			dates_service.remove(id);
			$scope.dates.splice(index, 1);
			alertMessages.success.show();
		}

		else{
			(password_immessa.length < 5 || password_immessa.length > 8) ? alertMessages.formatError.show() :  alertMessages.error.show();
		}
			
	}

});
