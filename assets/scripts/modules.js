var app = angular.module('calendarApp', ['ngRoute','ngAnimate','mgcrea.ngStrap']);

app.factory('dates_service', function($http){
	var dates;
	$http.get('http://www.marcolanci.it/esercizi/angularcalendar/assets/scripts/get_dates.php')
	.then(function(result){
		dates = result.data.dates;
		// console.log(result.data.dates);
	},function(status){
		console.log('Errore: '+status);
	});
	
	
	return {
		get: function(){
			return dates;
		},	
		remove: function(id_sent){
			$http.post('http://www.marcolanci.it/esercizi/angularcalendar/assets/scripts/delete.php', {
				id : id_sent
			})
			.then(function(result){
				console.log('ok: ' + result.status);
				console.log(result);
			},function(result){
				console.log('Errore: ' + result.status)});
		}
	}
	
});

app.factory('calendario', function($http, dates_service){

	
	return {
		show(month, year, view){
				var month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				var month_name_ita = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
				var first_date = month_name[month] + " " + 1 + " " + year; 
				var tmp = new Date(first_date);
				var day_no = tmp.getDay();
				var days = new Date(year, month+1, 0).getDate();
				check_calendar(month, year);
				
				function check_calendar(month_to_check, year_to_check){
					$http.post('http://www.marcolanci.it/esercizi/angularcalendar/assets/scripts/check_availability.php', {
						month: month_to_check,
						year: year_to_check
					})
					.then(function(result){
						var calendar = get_calendar(day_no, days, month, year, result, view);
						var $calendarHeader = $("#calendar-month-year").html(" " + month_name_ita[month] + " " + year + "   ");
						$("#calendar-dates").html('').append(calendar);
					},function(result){
						console.log('Errore: '+result.status);
						console.log('Errore: '+result.statusText);
					})
				};
				
				function get_calendar(day_no, days, month, year, result, view){
					var unavailability = result.data.dates;
					var busy_days = [];
					var ids = []; // tentavo di portarmi gli ID perché inizialmente volevo far tutto dal calendario. non li ho rimossi perché continuerò a provarci anche dopo la consegna
					for (var i in unavailability) busy_days.push(unavailability[i].day);
					for (var i in unavailability) ids.push(unavailability[i].id);
					if(view === "list"){
						var day_names = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
						var $table = $('<table>').addClass('listCalendar');
						for (var i = 1; i <= days; i++){
							var $small = $('<small>').text(day_names[day_no]);
							var $h1 = $('<h1>').addClass('listh1').text(i+' ').append($small);
							var $a = $('<a>').attr('href', '#/add').append($h1);
							var $td = $('<td>').append($a);
							for(var x = 0; x<busy_days.length; x++){
								if (busy_days[x] == i){
									$a.attr('href', '#/remove');
									$td.addClass('busy');
								}
							}
							var $tr = $('<tr>').append($td);
							$table.append($tr);	
							day_no = (day_no === day_names.length-1) ? 0 : day_no+1;
						}
					}
					else {
						var $table = $('<table>');
						var $tr = $('<tr>');
						for (var i=0; i<=6; i++){
							var $th = $('<th>');
							$th.html("LMMGVSD"[i]);
							$tr.append($th);
						}
						$table.append($tr);
						$tr = $('<tr>');
						for (i =0; i<= 6; i++){
							if (i == day_no){
								break;
							}
							var $td = $('<td>').addClass('void');
							$td.html("");
							$tr.append($td);
						}
						var day_number = 1;
						for (; i<=6; i++){
							var $a = $('<a>').attr('href', '#/add').html(day_number);
							var $td = $('<td>').append($a);
							for(var x = 0; x<busy_days.length; x++){
								if (busy_days[x] == day_number){
									$td.addClass('busy');
									$a.attr('href','#/remove');
								}								
							}
							day_number++;
							$tr.append($td);
						}
						$table.append($tr);
						
						for (var i=3; i<=7; i++){
							$tr = $('<tr>');
							for (y =0; y<= 6; y++){
								if(day_number > days){
									$table.append($tr);
									return $table;
								}
								var $a = $('<a>').attr('href', '#/add').html(day_number);
								var $td = $('<td>').append($a);
								for(var x = 0; x<busy_days.length; x++){
									if (busy_days[x] == day_number){
											$td.addClass('busy');
											$a.attr('href','#/remove');
									} 
								
								}
								day_number++;
								$tr.append($td);
							}
							$table.append($tr);
						}

					}
					return $table;
				}}
				}
})