$(function () {
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        maxDate: new Date,
        yearRange: 65,
    });

    $("#search").on("keypress", function (event) {
        if (event.key == "Enter") {
            let searchInput = $("#search").val();
            window.open(`https://www.google.com/search?q=${searchInput}`);
        }
    });

    if (localStorage.dob !== undefined) {
        displayAge()
    }

    $('#liveAge>button').on("click", saveAge)
});

function saveAge() {
    let value = $("#dateOfBirth").val()
    if(value){
        let dateOfBirth = Date.parse(value)
        localStorage.dob = dateOfBirth
        displayAge()
    }
}

function displayAge() {
    setInterval(function () {
        if(localStorage.dob){
            let now = new Date
            let years = (now - localStorage.dob) / 31556900000
            let age = years.toFixed(9).toString().split('.')
            document.getElementById("liveAge").innerHTML = `<h1>${age[0]}</h1><span>.${age[1]}</span>`
        }
    }, 100)
}

// location for weather
function result(position) {
    let thisCoords = position.coords;
    let lat = thisCoords.latitude;
    let lon = thisCoords.longitude;
    loadWeatherData(lat, lon);
}

function error(err) {
    console.log(err);
}
let settings = {
    enableHighAccuracy: true,
};

navigator.geolocation.getCurrentPosition(result, error, settings);

function loadWeatherData(lat, lon) {
    let weatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather?";
    let weatherMapAPIKey = "cbeca5a38e56254c999ae453dbb0c6ca";
    $.getJSON(weatherAPI_URL, {
        lat: lat,
        lon: lon,
        appid: weatherMapAPIKey,
        units: "metric",
        lang: "zh_tw",
    })
        .done(function (data) {
            $("#weather").append(
                `
                <img src='https://openweathermap.org/img/wn/${data.weather[0].icon}.png'>
                <span>${data.main.feels_like.toFixed()}°C </span>
                <span>${data.weather[0].description}</span>
                `
            );
        })
        .fail(function () {
            console.log("Error");
        })
        .always(function () {
            console.log("Always");
        });
};


// for real-time news
let rss2json = " https://api.rss2json.com/v1/api.json?rss_url=";
$.getJSON(rss2json + "https://news.ltn.com.tw/rss/all.xml")
    .done(function (data) {
        for (let x = 0; x < data.items.length; x++) {
            let thisRow = `<tr>`;
            thisRow += `<td><a target='_blank' href='${data.items[x].link}'>${data.items[x].title}</a></td>`;
            thisRow += `<td>${data.items[x].pubDate}</td>`
            thisRow += `</tr>`
            $("#newsTable").append(thisRow);
        }
    })
    .fail(function () { console.log("Error") })
    .always(function () { console.log("Always") });

resetBday.onclick = function () {
    localStorage.clear()
    location.reload()
};