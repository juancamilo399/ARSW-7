var Module = (function () {


	var _asientos;

	var _id;

	var url = 'js/apiclient.js';
	var cinemaFunction = {movie:{name: null , genre: null},seats:[],date:null}

	class Seat {
		constructor(row, col) {
			this.row = row;
			this.col = col;
		}
	}

	var stompClient = null;

	function _map(list){
		return mapList = list.map(function(cinemaFunction){
			return {
				name:cinemaFunction.movie.name,
				genero:cinemaFunction.movie.genre,
				hora:cinemaFunction.date.split(" ")[1]
			}
		})
	}

	function setAsientos(asientos){
		_asientos=asientos;
	}

	function setID(id){
		_id=id;
	}

	var getMousePosition = function (evt) {
		$('#canvasId').click(function (e) {
			canvas = document.getElementById("canvasId");
			var rect = canvas.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;
			findSeat(x,y);

		});
	}
	function findSeat(x, y) {
		var limiteXinf;
		var limiteXsup;
		var limiteYinf;
		var limiteYsup;
		var row = 5;
		var col = 0;
		for (var i = 0; i < _asientos.length; i++) {
			row++;
			col = 0;
			for (j = 0; j < _asientos[i].length; j++) {
				col++;
				if (_asientos[i][j]) {
					if (col == 0) {limiteXinf = 20;limiteXsup = 40;}
					else {limiteXinf = 20 * col;limiteXsup = (20 * col) + 20;}
					limiteYinf = (20 * row);
					limiteYsup = (20 * row) + 20;
					if (x >= limiteXinf && x <= limiteXsup && y >= limiteYinf && y <= limiteYsup) {
						verifyAvailability(i,j);
						break;
					}
					col++;
				}
			}
			row++;
		}
	};

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
		var id = document.getElementById("name_input").value+"."+cinemaFunction.date+"."+cinemaFunction.movie.name
		setID(id);
		connectAndSubscribe();
		setAsientos(data.seats);
		c = document.getElementById("canvasId");
		ctx = c.getContext("2d");
		ctx.fillStyle = "#001933";
		ctx.fillRect(100, 20, 300, 80);
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "40px Arial";
		ctx.fillText("Screen", 180, 70);
		var row = 5;
		var col = 0;
		for (var i = 0; i < _asientos.length; i++) {
			row++;
			col = 0;
			for (j = 0; j < _asientos[i].length; j++) {
				if (_asientos[i][j]) {
					ctx.fillStyle = "#009900";
				} else {
					ctx.fillStyle = "#FF0000";
				}
				col++;
				ctx.fillRect(20 * col, 20 * row, 20, 20);
				col++;
			}
			row++;
		}
	};

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

	function connectAndSubscribe () {
		console.info('Connecting to WS...');
		var socket = new SockJS('/stompendpoint');
		stompClient = Stomp.over(socket);


		stompClient.connect({}, function (frame) {
			console.log('Connected: ' + frame);
			stompClient.subscribe('/topic/buyticket.'+_id, function (eventbody) {
				console.log("hola"+eventbody);
				var theObject=JSON.parse(eventbody.body);
				getAvailability(cinemaFunction.movie.name,cinemaFunction.date)
			});
		});

	};

	function verifyAvailability (row,col) {
		var st = new Seat(row, col);
		var cinema = $("#name_input").val();
		var movie_name = cinemaFunction.movie.name;
		var date = cinemaFunction.date;
		stompClient.send("/app/buyticket."+_id, {}, JSON.stringify(st),cinema,date,movie_name);
		alert("ticket comprado");
	}

	function buyTickets(){
		getMousePosition();
	}

	function disconnect () {
		if (stompClient !== null) {
			stompClient.disconnect();
		}
		_id=null
		console.log("Disconnected");
	}

	function connectToAFunction(){
		var cinema = $("#cinema_input_suscribe").val()
		var movie_name = $("#movie_name_suscribe").val()
		var date = $("#date_input_suscribe").val()
		var cinemafunction = api.getFunctionByNameAndDate(cinema,date,movie_name,connect);
	}

	function connect(cFunction){
		var cFunction = cFunction;
		if (stompClient !== null) {
			stompClient.disconnect();
		}
		var id = document.getElementById("cinema_input_suscribe").value+"."+cFunction.date+"."+cFunction.movie.name
		setID(id);
		connectAndSubscribe();

	}


	return {
		getFunctionsByCinemaAndDate: getFunctionsByCinemaAndDate,
		updateFunction : updateFunction,
		createFunction : createFunction,
		deleteFunction : deleteFunction,
		disconnect:disconnect,
		connectToAFunction:connectToAFunction,
		buyTickets:buyTickets,
		getAvailability:getAvailability

	};
})();