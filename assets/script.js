const apiKey = "2b4cff14a2f13e4747b050497e046058"
$citySearch = document.getElementById("cityLookupTextField")
$searchSubmit = document.getElementById("searchSubmit");
$searchSubmit.addEventListener('click',getApiRequest);

const maxCities = 5;

var citiesList = Array(maxCities);
var currentDataList = Array(maxCities);
var futureDataList = Array(maxCities);

window.onload = onStart();

function onStart(){
    renderSearchedTiles()
}

function renderSearchedTiles(){
    //first clear element of old tiles
    document.getElementById("cities-box").innerHTML = ""

    if(currentDataList[0] != null){
        for(i=0; i<maxCities; i++){
            if(currentDataList[i]==null){return} //break if no more data
            //render tiles
            city = citiesList[i];
            renderSearchTile(city,i);
        }
    }
}


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
    currentDataList.unshift(data);
    currentDataList = currentDataList.slice(0,(maxCities));
    saveCurrent();  //save correct city to storage
    renderCurrentWeather($citySearch.value);  //render current and future weather
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
    futureDataList.unshift(data);
    futureDataList = futureDataList.slice(0,(maxCities));
    saveFuture();  //save correct city to storage
    renderFutureWeather($citySearch.value);  //render current and future weather
    })
}

function saveCurrent(){
    //save current weather data AND city search term
    var city = $citySearch.value
    citiesList.unshift(city);  //add new city to the start of the cities array
    citiesList.slice(0,(maxCities-1)); //remove older values if length greater than maxCities length
    localStorage.setItem("citiesList",JSON.stringify(citiesList))
    renderSearchedTiles()

    localStorage.setItem("currentDataList",currentDataList);
}

function saveFuture(){
    //save future weather data only (local storage)
    localStorage.setItem("futureDataList",futureDataList);
}

function renderCurrentWeather(city){
    //render the current weather fields
}

function renderFutureWeather(city){
    //render the predicted weather tiles (5 of)
}

function resetWeather(){
    //get city value
    city = clicked.value
    renderCurrentWeather(city)
    renderFutureWeather(city)
}

function renderSearchTile(city,index){
    //list the city searched in a tile
    var cityTile = `
            <div class="city-tile" id=${index} onclick="resetWeather()">
                <p>${city}</p>
            </div>`
    citiesDiv = document.getElementById("cities-box");
    if(index == 0){
        citiesDiv.insertAdjacentHTML('afterbegin', cityTile)
    } else {
        citiesDiv.insertAdjacentHTML('beforeend', cityTile)
    }
    
}



