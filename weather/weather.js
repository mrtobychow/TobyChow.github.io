$(document).ready(function() {
    var app_ID = 'c284f8c5508846be79e1cb10000e9335'; // key for api
    var lat;
    var lon;
    var city;
    var country;
    // tempType options: metric , imperial
    var tempType = 'metric';
    var tempUnit = '&#8451';
    var temperatureC;
    var temperatureF;
    var weatherDescription;
    var weatherIcon;


    function getWeatherInfo() {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?&units=" + tempType + "&lat=" + lat + "&" + "lon=" + lon + "&appid=" + app_ID,
            type: 'GET',
            dataType: 'json',
            success: function(json) {
                var temperature;
                //Sets temperature in metric or imperial format depending on tempType input, returns temperature to be displayed in desired units
                if (tempType === 'metric') {
                    temperatureC = json.main.temp;
                    temperature = temperatureC;
                }
                if (tempType === 'imperial') {
                    temperatureF = json.main.temp;
                    temperature = temperatureF;
                }
                weatherDescription = json.weather[0].description;
                weatherIcon = json.weather[0].icon;
                $("#location-text").append(city + ', ' + country);
                $("#weather-text").append('<span id="temp-display">' + temperature + '</span>' + '<span id="tempUnit">' + tempUnit + '</span>' + ' , ' + weatherDescription + "<img src='http://openweathermap.org/img/w/" + weatherIcon + ".png'>");
                changeBackground();

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Your browser does not support or allow geolocation! (Please turn off adblocks if applicable)");
            }
        });
    }

    // Switch between celsius and fahrenheit
    function switchTempUnit() {
        temperatureF = (temperatureC * 9 / 5 + 32).toFixed(2);
        var whatTemp = $("#tempUnit").html();
        var whatTempCode = whatTemp.charCodeAt(0);
        $("#temp-display").html(temperatureF);
        //If temperature is in celsius
        if (whatTempCode === 8451) {
            $("#temp-switch").html('Switch to Celsius');
            $("#tempUnit").html('&#8457');
            $("#temp-display").html(temperatureF);
            tempUnit = '&#8457';
            tempType = 'imperial';
        } else {
            $("#temp-switch").html('Switch to Farenheit');
            $("#tempUnit").html('&#8451');
            $("#temp-display").html(temperatureC);
            tempUnit = '&#8451';
            tempType = 'metric';
        }
    }
    $("#temp-switch").click(switchTempUnit);

    // Updates weather info and 'last update' check
    function updateTime() {
        getWeatherInfo();
        var currentTimeStamp = new Date();
        var currentMonth = getMonth();
        var currentDay = getDate();
        var currentDate = currentTimeStamp.getDate();
        var currentHour = currentTimeStamp.getHours();
        var currentMin = currentTimeStamp.getMinutes();
        $("#location-text").empty();
        $("#weather-text").empty();
        $("#update-time").empty();
        $(".date-display").empty();
        $("#update-time").append(currentHour + ':' + currentMin);
        $(".date-display").append(currentDay + ', ' + currentMonth +' ' + currentDate );
    }
    $("#weather-update").click(function() {
        updateTime();
    });

    // Convert numeric equivalent of months into text (Ex: 0 = January)
    function getMonth() {
        var monthNum = new Date().getMonth();
        if (monthNum === 0) {
            return 'January';
        } else if (monthNum === 1) {
            return 'February';
        } else if (monthNum === 2) {
            return 'March';
        } else if (monthNum === 3) {
            return 'April';
        } else if (monthNum === 4) {
            return 'May';
        } else if (monthNum === 5) {
            return 'June';
        } else if (monthNum === 6) {
            return 'July';
        } else if (monthNum === 7) {
            return 'August';
        } else if (monthNum === 8) {
            return 'September';
        } else if (monthNum === 9) {
            return 'October';
        } else if (monthNum === 10) {
            return 'November';
        } else {
            return 'December';
        }
    }

    // Convert numeric equivalent of day of the week into text (Ex: 0 = Sunday)
    function getDate() {
        var dateNum = new Date().getDay();
        if (dateNum === 0) {
            return 'Sunday';
        } else if (dateNum === 1) {
            return 'Monday';
        } else if (dateNum === 2) {
            return 'Tuesday';
        } else if (dateNum === 3) {
            return 'Wednesday';
        } else if (dateNum === 4) {
            return 'Thursday';
        } else if (dateNum === 5) {
            return 'Friday';
        } else {
            return 'Saturday';
        }

    }

    //Change background image depending on weather description code provided from JSON
    function changeBackground() {
        var clear = /(01)/;
        var cloud = /(02)|(03|(04))/;
        var rain = /(09)|(10)/;
        var thunder = /(11)/;
        var snow = /(13)/;
        var mist = /(50)/;
        if (clear.test(weatherIcon)) {
            $(".background-img").css("background-image", 'url("sunny-img.jpg")');
        } else if (cloud.test(weatherIcon)) {
            $(".background-img").css("background-image", 'url("cloud-img.jpg")');
        } else if (rain.test(weatherIcon)) {
            $(".background-img").css("background-image", 'url("rain-img.jpg")');
            $(".display").css("color", "white");
        } else if (thunder.test(weatherIcon)) {
            $(".background-img").css("background-image", 'url("thunder-img.jpeg")');
            $(".display").css("color", "white");
        } else if (snow.test(weatherIcon)) {
            $(".background-img").css("background-image", 'url("snow-img.jpg")');
        } else if (mist.test(weatherIcon)) {
            $(".background-img").css("background-image", 'url("mist-img.jpg")');
            $(".display").css("color", "white");
        }
    }

    // geolocation options
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    // Get IP data
    $.getJSON('http://ipinfo.io', function(data) {
        city = data.city;
        country = data.country;
        loc = data.loc.split(',');
        lat = loc[0];
        lon = loc[1];
        updateTime();
    });
});
