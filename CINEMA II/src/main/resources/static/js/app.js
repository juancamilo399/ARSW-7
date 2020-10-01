var Module = (function () {



	var url = 'js/apiclient.js';
	var cinemaFunction = {movie:{name: null , genre: null},seats:[],date:null}

	function _map(list){
		return mapList = list.map(function(cinemaFunction){
			return {
				name:cinemaFunction.movie.name,
				genero:cinemaFunction.movie.genre,
				hora:cinemaFunction.date.split(" ")[1]
			}
		})
	}

	function _table(cinemaFunctions){
		functions = _map(cinemaFunctions);
		$("#table_cinema > tbody").empty();
		functions.map(function(f){
			date = $("#date_input").val();
			var onclick = "Module.getAvailability(\""+f.name+"\",\""+date+"\")";
			var stri="'"+onclick+"'";
			var boton = "<input type='button' class='btn btn-primary' value='Open Seats' onclick=" + stri + "></input>";
			$("#table_cinema > tbody").append(
				"<tr>" +
					"<td>" + f.name + "</td>"+
					"<td>" + f.genero + "</td>"+
					"<td>" + f.hora + "</td>"+
					"<td>" + boton + "</td>"+

				"</tr>"
			);
		});
	}

	function getAvailability(movieName,date) {
		cine = $("#name_input").val();
		date = date
		$("#movie_name").text("Availability of: "+movieName);
		$.getScript(url,function(){
			api.getFunctionByNameAndDate(cine,date,movieName,drawCanvas);
		});
	}
	function setCinemaFunction(cinema_function){
		cinemaFunction = cinema_function;
	}

	function drawCanvas(data) {
		clearCanvas();
		setCinemaFunction(data);
		var asientos = data.seats;
		var c = document.getElementById("canvasId");
		var ctx = c.getContext("2d");

		ctx.fillStyle = "#0531ae";
		ctx.fillRect(60, 20 , 380, 40);
		ctx.beginPath();
		var a = document.getElementById("canvasId");

		var atx = a.getContext("2d");
		for (var i = 0; i < asientos[0].length; i++) {
			for (var j = 0; j < asientos.length; j++) {
				atx.fillStyle = "#9d9a9a";
				if(asientos[j][i] == false){
					atx.fillStyle = "#b00303";
				}
				atx.fillRect(i*40 + 10, j*40 +105 , 20, 20);
			}
		}
	}

	function clearCanvas(){
		var canvas = document.getElementById("canvasId");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
	}


	function updateFunction(){
		cinemaName = $("#name_input").val();
		cinemaDate = $("#date_input").val();
		newHour = $("#new_hour").val();
		newDate = cinemaDate+" "+newHour;
		cinemaFunction.date = newDate;
		api.updateFunction(cinemaName, cinemaFunction).then(function() {
			getFunctionsByCinemaAndDate(newDate);
		});
	}

	function createFunction(){
		cinemaName = $("#name_input").val();
		cinemaDate = $("#date_input").val();
		functionHour = $("#new_function_hour").val();
		console.log(functionHour);
		newDate = $("#date_input").val()+" "+functionHour;
		movieName = $("#new_movie_name").val();
		genre = $("#new_genre").val();
		cinemaFunction.date = newDate;
		cinemaFunction.movie.name = movieName;
		cinemaFunction.movie.genre = genre;
		date = $("#date_input").val();
		api.updateFunction(cinemaName,cinemaFunction).then(function(){
			getFunctionsByCinemaAndDate(date);
		})
	}

	function deleteFunction(){
		cinemaName = $("#name_input").val();
		cinemaDate = $("#date_input").val();
		api.deleteFunction(cinemaName, cinemaFunction).then(function() {
			clearCanvas();
			getFunctionsByCinemaAndDate(cinemaDate);
		});
	}

	function getFunctionsByCinemaAndDate(date){
		cinemaName = $("#name_input").val();
		$("#cinema_name").text("Cinema name : "+ cinemaName);
		api.getFunctionsByCinemaAndDate(cinemaName,date,_table);
	}


	return {
		getFunctionsByCinemaAndDate: getFunctionsByCinemaAndDate,
		getAvailability: getAvailability,
		updateFunction : updateFunction,
		createFunction : createFunction,
		deleteFunction : deleteFunction
	};
})();