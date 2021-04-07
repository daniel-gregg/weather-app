const apiKey = "2b4cff14a2f13e4747b050497e046058"
$citySearch = document.getElementById("cityLookupTextField")
$searchSubmit = document.getElementById("searchSubmit");
$searchSubmit.addEventListener('click',getApiRequest);

var currentData = "";
var futureData = "";
const maxCities = 5;

var citiesList = Array(maxCities);
var currentDataList = Array(maxCities);
var futureDataList = Array(maxCities);

function getApiRequest(){
    cityName = $citySearch.value;
    fetchCurrentWeather();
    
    fetchFutureWeather();
}

function fetchCurrentWeather(){
    var requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
    currentData = data;
    saveCurrent();  //save correct city to storage
    renderCurrentWeather();  //render current and future weather
    })
    /* .catch(() => {
        msg.textContent = "Please search for a valid city 😩";
    }); */
}

function fetchFutureWeather(){
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
    futureData = data;
    saveFuture();  //save correct city to storage
    renderFutureWeather();  //render current and future weather
    })
}

function saveCurrent(){
    //save current weather data AND city search term
    var city = $citySearch.value
    citiesList.unshift(city);  //add new city to the start of the cities array
    citiesList.slice(0,maxCities); //remove older values if length greater than maxCities length
    localStorage.setItem("citiesList",JSON.stringify(citiesList))
    renderSearchTile()  //list the city searched in a tile
}

function saveFuture(){
    //save future weather data only (local storage)
}

function renderCurrentWeather(){
    //render the current weather fields
}

function renderFutureWeather(){
    //render the predicted weather tiles (5 of)
}

function renderSearchTile(){
    //list the city searched in a tile
    city = $citySearch.value
    var cityTile = `
            <div class="city-tile">
                <p>${city}</p>
            </div>`
    citiesDiv = document.getElementById("cities-box");
    citiesDiv.insertAdjacentHTML('afterbegin', cityTile)
}



