

const apiKey = "2b4cff14a2f13e4747b050497e046058"
$citySearch = document.getElementById("cityLookupTextField")
$searchSubmit = document.getElementById("searchSubmit");
$searchSubmit.addEventListener('click',getApiRequest);

var globalData = ""

function getApiRequest(){
    cityName = $citySearch.value;
    var requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
    globalData = data;
    })
    .catch(() => {
        msg.textContent = "Please search for a valid city 😩";
    });
}

