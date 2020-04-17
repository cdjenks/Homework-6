//Event handler for pulling the weather data for a searched-for city
$("#search-button").on("click", function(event){
    event.preventDefault();
    var inputCity = $("#city-input").val().trim();
    var newCity = $("<button>").text(inputCity).addClass("list-group-item").attr("style", "text-align: left; font-size: 20px;");
    $("#searched-cities").removeClass("hide").prepend(newCity);
    displayWeatherToday(inputCity);
    forecastWeather(inputCity)

});

// For reloading weather data for a city from list of searched cities
$("#searched-cities").on("click", function(event){
    event.preventDefault();
    inputCity = $(event.target).val().trim();
    displayWeatherToday(inputCity);
    forecastWeather(inputCity);
});

// Function for gathering and displaying today's weather for the selected city
function displayWeatherToday(inputCity){
    var m = moment();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&appid=e049298ddd73342a74fe9ed55436d61b";
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        
        $("#city-name").text(inputCity + " " + "(" + (m.format("L")) + ")");
        var todayIconId = response.weather[0].icon;
        var todayIconURL = "http://openweathermap.org/img/wn/" + todayIconId + "@2x.png";
        $("#same-day-icon").attr("src", todayIconURL).attr("style", "max-height: 60px; max-width: 60px;");
        
        kelvinTemp = response.main.temp;
        kelvinTemp = parseFloat(kelvinTemp);
        fahrenheitTemp = (kelvinTemp - 273.15) * 9/5 + 32;
        $("#city-temp").text("Temperature: " + fahrenheitTemp.toFixed(1) + " °F");
        
        $("#city-humidity").text("Humidity: " + response.main.humidity + "%");
        $("#city-wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#city-UV-index").text("UV Index:");
        var lon = response.coord.lon
        var lat = response.coord.lat
        uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=e049298ddd73342a74fe9ed55436d61b&lat=" + lat + "&lon=" + lon;
        
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(uvResponse){
            uvIndex = uvResponse.value;
            console.log(uvIndex);

            //Setting uv index severity color
            if (uvIndex < 3) {
                $("#uvindex-value").addClass("uv-low")
            } 
            else if (uvIndex > 2 && uvIndex < 6) {
                $("#uvindex-value").addClass("uv-mod")
            }
            else if (uvIndex > 5 && uvIndex < 8) {
                $("#uvindex-value").addClass("uv-high")
            }
            else if (uvIndex > 7 && uvIndex < 11) {
                $("#uvindex-value").addClass("uv-veryhigh")
            }
            else {
                $("#uvindex-value").addClass("uv-extreme")
            }
            // Setting the uv index text/value
            $("#uvindex-value").text(uvIndex);
        }) 
    })
}

function forecastWeather(inputCity) {
    $("#forecast-boxes").empty();
    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCity + "&appid=e049298ddd73342a74fe9ed55436d61b";

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(response){
        var x = 0
        for (var i = 1; i < 6; i++){
            var m = moment();

            $("#forecast-boxes").removeClass("hide");
            var forecastDate = $("<h4>").text(m.add(i,"d").format("L")).attr("style", "color: white;");

            var iconId = response.list[x].weather[0].icon;
           
            var iconURL = "http://openweathermap.org/img/wn/" + iconId + "@2x.png";
            var forecastIcon = $("<img>").attr("src", iconURL);
            forecastIcon.attr("style", "background-color: rgb(45, 147, 243); max-height: 60px; max-width: 60px;")
            
            var longTemp = (((response.list[x].main.temp) - 273.15) * 9/5 + 32);
            var shortTemp = (longTemp.toFixed(1));
            var forecastTemp = $("<p>").text("Temp: " + shortTemp + " °F");
            
            var forecastWind = $("<p>").text("Wind: " + response.list[x].wind.speed + " MPH");

            (forecastDate, forecastTemp, forecastWind).addClass("card-text");
            
            var forecastDiv = $("<div>").addClass("card my-forecast-boxes card-body");
            forecastDiv.attr("style", "float: left;");
            forecastDiv.append(forecastDate, forecastIcon, forecastTemp, forecastWind);
            $("#forecast-boxes").append(forecastDiv);

            var x = x + 8;      
        }        
    })
}

