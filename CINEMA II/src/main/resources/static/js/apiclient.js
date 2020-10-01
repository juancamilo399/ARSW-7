api = (function () {
    function getFunctionsByCinema(cinemaName, callback) {
        $.getJSON("http://localhost:8080/cinemas/" + cinemaName, function (data) {
            callback(data);
        });
    }

    function getFunctionsByCinemaAndDate(cinema_name, fdate, callback) {
        console.log("get client");
        $.getJSON("http://localhost:8080/cinemas/" + cinema_name + "/" + fdate, function (data) {
            callback(data);
        });
    }

    function getFunctionByNameAndDate(cinemaName, fDate, movieName, callback) {
        $.getJSON("http://localhost:8080/cinemas/"+cinemaName+"/"+ fDate+"/"+movieName, function (data) {
            callback(data);
        });
    }

    function updateFunction(cinemaName,cinemaFunction){
        var data = $.ajax({
            url: "http://localhost:8080/cinemas/"+cinemaName,
            type: 'PUT',
            data: JSON.stringify(cinemaFunction),
            contentType: "application/json"
        });
        return data;
    }

    function deleteFunction(cinemaName,cinemaFunction){
        var data = $.ajax({
            url: "http://localhost:8080/cinemas/"+cinemaName,
            type: 'DELETE',
            data: JSON.stringify(cinemaFunction),
            contentType: "application/json"
        });
        return data;
    }

    return {
        deleteFunction : deleteFunction,
        getFunctionsByCinema: getFunctionsByCinema,
        getFunctionsByCinemaAndDate: getFunctionsByCinemaAndDate,
        getFunctionByNameAndDate : getFunctionByNameAndDate,
        updateFunction : updateFunction,
    }
})();