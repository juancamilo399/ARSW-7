
apimock = (function () {

    var seats = [[true, true, true, true, true, true, true, false, true, true, true, true], [true, true, true, true, true, true, false, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];
    var seats1 = [[false, true, true, true, true, true, true, false, true, true, true, true], [true, true, true, true, true, true, false, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];
    var mockdata = [];
    var function1Y = {"movie": {"name": "SuperHeroes Movie", "genre": "Action"}, "seats": seats, "date": "2018-12-19 17:00"};
    var function2Y = {"movie": {"name": "The Night", "genre": "Horror"}, "seats": seats, "date": "2018-12-19 19:40"};
    var function3Y = {"movie": {"name": "SuperHeroes Movie", "genre": "Action"}, "seats": seats, "date": "2018-12-19 14:30"};
    var function4Y = {"movie": {"name": "The Enigma", "genre": "Drama"}, "seats": seats, "date": "2018-12-20 17:00"};

    mockdata["cinemaX"] = {"name": "cinemaX", "functions": [{"movie": {"name": "The Enigma", "genre": "Drama"}, "seats": seats1, "date": "2018-12-18 15:30"}, {"movie": {"name": "The Enigma 2", "genre": "Drama"}, "seats": seats, "date": "2018-12-18 15:30"}]};
    mockdata["cinemaY"] = {"name": "cinemaY", "functions": [function1Y, function2Y, function3Y, function4Y]};
    mockdata["cinemaA"] = {"name": "cinemaA", "functions": [function1Y, function2Y]};
    mockdata["cinemaB"] = {"name": "cinemaB", "functions": [function3Y, function2Y , function1Y]};
    mockdata["cinemaC"] = {"name": "cinemaC", "functions": [function1Y, function2Y , function4Y]};
    mockdata["cinemaD"] = {"name": "cinemaD", "functions": [function1Y]};


    return {
        getFunctionsByCinema: function (cinema_name, callback) {
            callback(mockdata[cinema_name]);
        },

        getFunctionsByCinemaAndDate: function (cinema_name, fdate, callback) {
            callback(
                mockdata[cinema_name].functions.filter(
                    funct => funct.date.includes(fdate))
            );
        },

        getFunctionByNameAndDate: function (cinema_name, fdate, movie_name, callback) {
            var data = mockdata[cinema_name].functions.filter(
                funct => funct.date.includes(fdate));
            var funcion = data.find(f => f.movie.name == movie_name);
            callback(funcion);
        }
    }

})();







/*
 Example of use:
 var fun=function(list){
 console.log(list);
 }
 apimock.getFunctionsByCinema("cinemaX",fun);
 apimock.getFunctionsByCinemaAndDate("cinemaX","2018-12-18",fun);*/
