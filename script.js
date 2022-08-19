const api = {
    key:"3bc8216eeaabfbc25e5932bfe351a090",
    base:"https://api.openweathermap.org/data/2.5/",
    lang:"pt-br",
    units:"metric"
}

const city = document.querySelector('.city');
const date = document.querySelector('.date');
const containerImg = document.querySelector('.container-img');
const containerTemp = document.querySelector('.container-temp');
const tempNumero = document.querySelector('.container-temp div');
const tempUnidade = document.querySelector('.container-temp span');
const weatherT = document.querySelector('.weather');
const searchInput = document.querySelector('.form-control');
const searchButton = document.querySelector('.btn');
const lowHigh = document.querySelector('.hi-low');

window.addEventListener('load', () => {
    //if ("geolocation" in navigator)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else {
        alert('navegador não suporta geolozalicação');
    }
    function setPosition(position) {
        console.log(position)
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }
    function showError(error) {
        alert(`erro: ${error.message}`);
    }
})

function coordResults(lat, long) {
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}

searchButton.addEventListener('click', function() {
    searchResults(searchInput.value)
})

searchInput.addEventListener('keypress', enter)
function enter(event) {
    key = event.keyCode
    if (key === 13) {
        searchResults(searchInput.value)
    }
}

function searchResults(city) {
    fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}

function displayResults(weather) {
    console.log(weather)

    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    date.innerText = dateBuilder(now);

    let iconName = weather.weather[0].icon;
    containerImg.innerHTML = `<img src="./icons/${iconName}.png">`;

    let temperature = `${Math.round(weather.main.temp)}`
    tempNumero.innerHTML = temperature;
    tempUnidade.innerHTML = `°c`;

    weather_tempo = weather.weather[0].description;
    weatherT.innerText = capitalizeFirstLetter(weather_tempo)

    lowHigh.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder(d) {
    let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julio", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let day = days[d.getDay()]; //getDay: 0-6
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
}

containerTemp.addEventListener('click', changeTemp)
function changeTemp() {
    temp_number_now = tempNumero.innerHTML

    if (tempUnidade.innerHTML === "°c") {
        let f = (temp_number_now * 1.8) + 32
        tempUnidade.innerHTML = "°f"
        tempNumero.innerHTML = Math.round(f)
    }
    else {
        let c = (temp_number_now - 32) / 1.8
        tempUnidade.innerHTML = "°c"
        tempNumero.innerHTML = Math.round(c)
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}