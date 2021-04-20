const apiKey = "2b4cff14a2f13e4747b050497e046058"
$citySearch = document.getElementById("cityLookupTextField")
$searchSubmit = document.getElementById("searchSubmit");
$currentTile = document.getElementById("current-weather")
$weatherBox = document.getElementById("weather-data")

$searchSubmit.addEventListener('click',getApiRequest);

const maxCities = 5;
const maxDaysFuture = 5;

const weatherString = "XX" //do a template literature here for the weather string

var futureWeather = {
    avgTemp: 0,  //average temperature
    minTemp: 0,  //min expected temp
    maxTemp: 0,  //max expected temp
    sunRise: 0,  // sunrise time - need to Parse from day.js in HHMM format
    sunSet: 0,   // sunset time - need to Parse from day.js in HHMM format
    weather: "", //simple description of the weather, e.g. "clear"
    UVI: 0, //UV index - fill from UV call.
}

window.onload = onStart();

const getCityName = () => $citySearch.value;
const getCitiesList = () => localStorage.getItem("citiesList")

function onStart(){
    renderSearched() //render searched items
}

function renderSearched(){
    //first clear element of old tiles
    document.getElementById("cities-box").innerHTML = ""

    var citiesList = JSON.parse(localStorage.getItem("citiesList"))
    if(citiesList != null){
        for(i=0; i<citiesList.length; i++){
            //render tiles
            city = citiesList[i];
            renderSearchTile(city,i);
        }
    }
}

function renderSearchTile(city,index){
    //list the city searched in a tile
    var cityTile = `
            <div class="city-tile" id=tile${index} onclick="resetWeather(id)">
                <p>${city}</p>
            </div>`
    citiesDiv = document.getElementById("cities-box");
    
    if(index == 0){
        citiesDiv.insertAdjacentHTML('afterbegin', cityTile)
    } else {
        citiesDiv.insertAdjacentHTML('beforeend', cityTile)
    }
    
}



function getApiRequest(){
    var cityName = getCityName();
    var citiesList = JSON.parse(getCitiesList())

    fetchCurrentWeather(cityName);
    fetchFutureWeather(cityName);

}

function fetchCurrentWeather(cityName){
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    return fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        var UV = fetchUVI(data)
        saveCurrent(cityName)
        renderCurrentWeather(data,UV)
    })
}

function fetchFutureWeather(cityName){
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    return fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        renderFutureWeather(data)
        $weatherBox.style.display = "flex"
    })
}

var UVI = ""
function fetchUVI(data){
    var lat = data.coord.lat
    var lon = data.coord.lon
    var requesturl = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&cnt=${maxCities-1}&appid=${apiKey}`;
    return fetch(requesturl)
    .then(response => response.json())
    .then(data => {
        UVI = data[0].value;
        renderUVI(UVI)
    })
}

function saveCurrent(cityName){
    //save current city search term
    if(getCitiesList() != null){
        var citiesList = JSON.parse(getCitiesList())
        citiesList.unshift(cityName);  //add new city to the start of the cities array
        citiesList = citiesList.slice(0,(maxCities-1)); //remove older values if length greater than maxCities length
        localStorage.setItem("citiesList",JSON.stringify(citiesList))
        renderSearched()
    } else {
        var citiesList = [cityName]
        localStorage.setItem("citiesList",JSON.stringify(citiesList))
        renderSearched()
    }
}

function renderCurrentWeather(data){
    //render the current weather fields
    var avgTemp = data.main.temp
    var minTemp = data.main.temp_min
    var maxTemp = data.main.temp_max
    var sunRise = dayjs.unix(data.sys.sunrise).format("hh:mm a")
    var sunSet =  dayjs.unix(data.sys.sunset).format("hh:mm a")
    var weather = data.weather[0].main
    var iconCode = data.weather[0].icon

    const tileText = `
    <div id="iconDiv"><img id="icon" src=http://openweathermap.org/img/wn/${iconCode}@2x.png>
        <table id="current-weather-tile">
            <tr>
                <th>Average Temperature:</th>
                <th>Minimum Temperature: </th>
                <th>Maximum Temperature: </th>
                <th>Sunrise: </th>
                <th>Sunset: </th>
                <th>Weather: </th>
            </tr>
            <tr>
                <td> ${avgTemp} Celcius</td>
                <td> ${minTemp}</td>
                <td> ${maxTemp}</td>
                <td> ${sunRise}</td>
                <td> ${sunSet}</td>
                <td> ${weather}</td>
            </tr>
        </table>
    <p id="uvi"> </p>
    </div>
    ` 
    $currentTile.insertAdjacentHTML('afterbegin',tileText)
}

function renderUVI(UVI){
    document.getElementById("uvi").innerHTML = `<strong>UV Index: ${UVI}</strong>`
}

function renderFutureWeather(data){
    //get days ahead - the future weather array is every 3 hours...
    var dataArray = [
        data.list[7],
        data.list[14],
        data.list[22],
        data.list[30],
        data.list[39]
    ]

    for(i=0; i<dataArray.length; i++){
        renderFutureTile(dataArray[i],i)
    }
}

function renderFutureTile(arrayItem,index){
    var day = dayjs.unix(arrayItem.dt).format("dddd")
    var avgTemp = arrayItem.main.temp
    var weather = arrayItem.weather[0].main
    var iconCode = arrayItem.weather[0].icon

    const tileText = `
    <div id="future-weather-tile${i}" class="future-weather-tile">
        <img id="iconFuture${i}" class="iconFuture" src=http://openweathermap.org/img/wn/${iconCode}.png><br>
         <strong>${day}</strong><br>
         ${avgTemp} C<br>
         ${weather}<br>
    </div>
    `     
    $futureTile = document.getElementById(`futureTile${index+1}`)
    $futureTile.insertAdjacentHTML('afterbegin',tileText)
}

function resetWeather(id){
    //get city value
    city = document.getElementById(id).innerText
    fetchCurrentWeather(city)
    fetchFutureWeather(city)
}



