$(document).ready(function() {
    var DARKSKY_API_URL = 'https://api.darksky.net/forecast/'
    var DARKSKY_API_KEY = '48b6b6b75151fc7513664e14a802c6d1'
    var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

    var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
    var GOOGLE_MAPS_API_KEY = 'AIzaSyB6XhW-M9iWrTb5y_i6aAI9CaNJeILw718'

    function getCoordinatesForCity(cityName) {
        var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`
        
        return (
            $.getJSON(url)
            .then(data => data.results[0].geometry.location)
        )
    }

    function getCurrentWeather(coords) {
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat}, ${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`
        
        return (
            $.getJSON(url)
            .then(data => data.currently)
        )
    }

    
    var app = $('#app')
    var cityForm = app.find('.city-form:first')
    var cityInput = cityForm.find('.city-input:first')
    var cityWeather = app.find('.city-weather:first')

    cityForm.submit(function() {
        event.preventDefault()
        
        var city = cityInput.val()
        cityWeather.text(`Loading weather for ${city.toUpperCase()}...`)

        getCoordinatesForCity(city)
        .then(getCurrentWeather)
        .then(function(weather) {
            cityWeather.text(`Current temperature: ${weather.temperature}`)
            
            var weatherIcon = $('<canvas/>', {
                id: "city-weather-icon",
                'Width': '128',
                'Height': '128'
            })
            cityWeather.append($('<div/>'))
            cityWeather.find('div').append(weatherIcon)
            
            var skycons = new Skycons({"color": "skyblue"});
            skycons.add('city-weather-icon', weather.icon);
            skycons.play();      
        })
    })
})()