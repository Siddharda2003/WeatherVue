let cityInput = document.querySelector(".city");
let searchBtn = document.querySelector(".search");
let locationBtn = document.querySelector(".location");
let content = document.querySelector(".content");
let forecast = document.querySelector(".forecast"); 
//let APIKey = `ffbc8640da362ef23b347ac43f2ab196`;

searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click",getUserCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates);
async function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    if (cityName === "" || cityName.length === 0) {
        alert("Enter a valid city name");
        return; 
    }
    let gURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=ffbc8640da362ef23b347ac43f2ab196`;
    try{
        let response = await fetch(gURL);
        let gData = await response.json();
        let name=gData[0]['name'];
        let lon=gData[0]['lon'];
        let lat=gData[0]['lat'];
        getWeatherDetails(name,lat,lon);
    }catch(error){
        alert("An error occured while fetching the Coordinates of the city,make sure you entered a valid city name");
    }
}
async function getWeatherDetails(name,lat,lon){
    let wURL=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=ffbc8640da362ef23b347ac43f2ab196`;
    try{
        let response=await fetch(wURL);
        let data=await response.json();
        let uniqueDates=[]
        fiveDayForeCast=data.list.filter(item=>{
            let date=new Date(item.dt_txt).getDate();
            if(!uniqueDates.includes(date)){
                return uniqueDates.push(date);
            }
        });
        cityInput.innerHTML="";
        content.innerHTML="";
        forecast.innerHTML="";
        fiveDayForeCast.forEach((weatherItem,index)=>{
            let html=getWeatherCard(weatherItem,index,name);
            if(index===0){
                content.insertAdjacentHTML("beforeend",html);
            }else{
                forecast.insertAdjacentHTML("beforeend",html);
            }
        })
    }
    catch(error){
        alert("Error in fetching the weather information,please try after some time");
    }
}
function getWeatherCard(weatherItem,index,name) {
    
    let day=new Date(weatherItem.dt_txt).getDate();
    let month=new Date(weatherItem.dt_txt).getMonth()+1;
    if(month<10){
        month=`0${month}`;
    }
    let year=new Date(weatherItem.dt_txt).getFullYear();
    let date=`${day}-${month}-${year}`;
    if(index===0){
        return `<div class="text">
        <h2>${name}(${date}) </h2>
        <h6>Temperature:${(weatherItem.main.temp-273.15).toFixed(2)} °C</h6>
        <h6>Wind:${weatherItem.wind.speed} M/S</h6>
        <h6>Humidity:${weatherItem.main.humidity} %</h6>
    </div>
    <div class="icon">
        <img class="td-weather-img" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png">
        <h6 class="td-weather-txt">${weatherItem.weather[0].description}</h6>
    </div>`
    }else{
        return ` <div class="card">
        <h3>(${date})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png">
        <h6>Temp:${(weatherItem.main.temp-273.15).toFixed(2)}°C</h6>
        <h6>Wind:${weatherItem.wind.speed} M/S</h6>
        <h6>Humidity:${weatherItem.main.humidity}%</h6>
    </div>`
    }
}
async function getUserCoordinates(){
    try{
        const position=await navigator.geolocation.getCurrentPosition();
        const {lat,lon}=position.coords;
        const rURL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=ffbc8640da362ef23b347ac43f2ab196`
        const response=await fetch(rURL);
        const data=await response.json();
        const {name}=data[0];
        getWeatherDetails(name,lat,lon);
    }catch(error){
        if(error.code===error.PERMISSION_DENIED){
            alert("Geolocation request denied. Please reset location permission to grant access again.");
        } else {
            alert("An error occurred while fetching the city name!");
        }
    }
}
