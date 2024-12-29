
const changeTempRulerBtn = document.querySelector(".changeTempRulerBtn")
const dropTempRulerEl = document.querySelector(".dropTempRuler")
const scrollLeftBtn = document.querySelector(".scrollLeftBtn");
const scrollRightBtn = document.querySelector(".scrollRightBtn")
const scrollBar = document.querySelector(".scrollbar")
const rightBar = document.querySelector(".dashboardright__innerparts")
const rightTimeEl = document.querySelector(".rightTime")
const typeOfTempEl = document.querySelector(".typeOfTemp")
const searchBar = document.querySelector(".nav__search")
const locationName = document.querySelector(".loacationName")
let city = JSON.parse(localStorage.getItem("cityName")) || "Tashkent"

typeOfTempEl.textContent = JSON.parse(localStorage.getItem("typeOfTempEl")) || typeOfTempEl.textContent

let tempValue = JSON.parse(localStorage.getItem("tempValue")) || "f"

const dashboardLeftTwoLoading = document.querySelector(".dashboardleft-loading__two")
const dashboardLeftThreeLoading = document.querySelector(".dashboardleft-loading__three")
const  dashboardleftLoadingEl = document.querySelector(".dashboardleft-loading")
const dashboardrightLoadingEl = document.querySelector(".dashboardright-loading")
const dashboardleftEl = document.querySelector(".dashboardleft")
const dashboardrightEl = document.querySelector(".dashboardright")
let fetchError = JSON.parse(localStorage.getItem("fetchError")) || true

locationName.textContent = JSON.parse(localStorage.getItem("locationName")) || 'Tashkent. Uzbekistan'

changeTempRulerBtn.addEventListener("click",async (e) => {
    if(e.target.tagName === "P" || e.target.tagName === "SPAN"){
        dropTempRulerEl.classList.toggle("toggle")
    }
    if(e.target.tagName === "LI"){
        tempValue = e.target.dataset.value
        typeOfTempEl.textContent = e.target.textContent
        localStorage.setItem("tempValue", JSON.stringify(e.target.dataset.value))
        localStorage.setItem("typeOfTempEl", JSON.stringify(e.target.textContent))
        dropTempRulerEl.classList.remove("toggle")
        const weatherData = await fetchWeather(city);

        ccreateWeather(weatherData)
        getAdditionalPoints(weatherData)
        getNextHurs(weatherData)
        getForecastDays(weatherData)
    }
})

window.addEventListener("load", () => {
    createLoadingForTwo()
    createLoadingForThree()
    fetchWeather(city)
})
    scrollBar.addEventListener("scroll", engineScroll)

    function engineScroll(){
        const scrollLeft = scrollBar.scrollLeft
        const scrollWidth = scrollBar.scrollWidth
        const clientWidth = scrollBar.clientWidth
    
        scrollLeftBtn.style.display = scrollLeft <= 0  ?  "none" : "block";
        scrollRightBtn.style.display = scrollLeft + clientWidth >= scrollWidth - 1 ? "none" : "block"
}

scrollLeftBtn.addEventListener("click", ()=>  {
    scrollBar.scrollBy({
        left: -100, 
        behavior: "smooth",
    })
})

scrollRightBtn.addEventListener("click", ()=>{
    scrollBar.scrollBy({
        left:  100,
        behavior: "smooth",
    })
})

async function fetchWeather(city) {
    try{
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c3a6dc4386cc49e7ba0155411242212&q=${city}&days=10&aqi=yes&alerts=yes`)

        if(!response.ok){
            throw new Error (`Error: ${response.status} - ${response.statusText}`)
        }
        const weatherData = await response.json()
        fetchError = true
        localStorage.setItem("fetchError", JSON.stringify(fetchError))
        ccreateWeather(weatherData)
        getAdditionalPoints(weatherData)
        getNextHurs(weatherData)
        getForecastDays(weatherData)
        return weatherData
    }catch(e){
        fetchError = false
        localStorage.setItem("fetchError", JSON.stringify(fetchError))
        alert(`Unable to fetch weather data. Please check your internet connection or the city name.`)
    }finally{
        
        if(!fetchError){
            dashboardleftEl.style.display = 'none'
            dashboardleftLoadingEl.style.display = 'flex'
            dashboardrightEl.style.display = 'none'
            dashboardrightLoadingEl.style.display = 'block'
            locationName.textContent = `Not found`
        }else{
            locationName.textContent = JSON.parse(localStorage.getItem("locationName"))
            dashboardleftLoadingEl.style.display = 'none'
            dashboardleftEl.style.display = 'flex'
            dashboardrightEl.style.display = 'flex'
            dashboardrightLoadingEl.style.display = 'none'
        }
    }
}

function createLoadingForTwo(){
    dashboardLeftTwoLoading.style.display = 'grid'
    dashboardLeftTwoLoading.innerHTML = null
    Array(6).fill().forEach(()=> {
        const dashboardInnerEl = document.createElement("div")
        dashboardInnerEl.className = "dashboardleft-loading__two__inner boardcard to-left"
        dashboardLeftTwoLoading.appendChild(dashboardInnerEl)
    })
}

function createLoadingForThree(){
    dashboardLeftThreeLoading.style.display = 'grid'
    dashboardLeftThreeLoading.innerHTML = null
    Array(2).fill().forEach(() =>  {
        const dashboardInnerEl = document.createElement("div")
        dashboardInnerEl.className = "dashboardleft-loading__three__inner boardcard to-left"
        dashboardLeftThreeLoading.appendChild(dashboardInnerEl)
    })
}

function getDate(){
    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let  isAmOrPm = hours >= 12 ? 'pm' : 'am'

    hours %= 12 
    hours = hours || 12
    minutes = minutes < 10 ?`0${minutes}` : minutes

    return `${hours}:${minutes} ${isAmOrPm}`
}

function ccreateWeather(data){
    const weatherMainIcon = document.querySelector(".weatherMainIcon")
    const weatherMainNum = document.querySelector(".weatherMainNum")
    const typeOfDay =  document.querySelector(".typeOfDay")
    const feelsLike = document.querySelector(".feelsLike")
    rightTimeEl.textContent = `${getDate()}`
    weatherMainIcon.src = data.current.condition.icon
    weatherMainNum.textContent = data.current["temp_" + tempValue] + "°"
    weatherMainNum.nextElementSibling.textContent = tempValue.toUpperCase()
    typeOfDay.textContent = data.current.condition.text
    feelsLike.textContent = `Feels like ${data.current["feelslike_" + tempValue] + "°"}`
}

function getAdditionalPoints(data){
    const airQulityEl =  document.querySelector(".airQuality")
    const windSpeedEl = document.querySelector(".windSpeed")
    const humidityRateEl = document.querySelector(".humidityRate")
    const visibilityEl = document.querySelector(".visibility")
    const rainChanceEl = document.querySelector(".rainChance")
    const realFeel = document.querySelector(".thermostat")
    const sunrisEl = document.querySelector(".sunrise")
    const sunsetEl = document.querySelector(".sunset")
    locationName.textContent = `${data.location.name}, ${data.location.country}`
    localStorage.setItem("locationName", JSON.stringify(locationName.textContent))
    airQulityEl.textContent = "NO2 " + data.current.air_quality.no2
    windSpeedEl.textContent = data.current.wind_mph
    humidityRateEl.textContent = data.current.humidity
    visibilityEl.textContent = data.current.vis_miles
    rainChanceEl.textContent = data.forecast.forecastday[0].day.daily_chance_of_rain
    realFeel.textContent = data.current["heatindex_" + tempValue]
    sunrisEl.textContent = data.forecast.forecastday[0].astro.sunrise
    sunsetEl.textContent = data.forecast.forecastday[0].astro.sunset
}

function getNextHurs(data){
    scrollBar.innerHTML = null
    data.forecast.forecastday[0].hour.forEach(item => {
        let epochTime = new Date(item.time_epoch * 1000)
        let now = new Date().getHours()
        if(epochTime.getHours() >= now){
            let hour = epochTime.getHours()
            let minutes = epochTime.getMinutes()
            let isAmOrPm = hour >= 12 ? "pm" : "am"

            hour %= 12
            hour = hour || 12
            minutes =  minutes < 10 ? `0${minutes}` : minutes

            let resultTime = `${hour}:${minutes} ${isAmOrPm}`
            const liEl = document.createElement("li")
            liEl.innerHTML = `
            <p>${resultTime}</p>
            <img src=${item.condition.icon}>
            <p class="large">${item["temp_" + tempValue]}°</p>
            `
            scrollBar.appendChild(liEl)
        }
    })
}

function getForecastDays(data){
    const weekdays = [
       "Sunday", "Monday", "Tuesday", "Wdnesday", "Thursday", "Friday", "Saturday"
    ]
    rightBar.innerHTML = null
    data.forecast.forecastday.forEach((item) => {
        const liEl = document.createElement("li")
        const date = new Date(item.date_epoch * 1000)
        liEl.innerHTML = `
        <div class="dashboardright__icon-text">
            <div class="dashboardright__icon">
                <img src=${item.day.condition.icon}>
            </div>
            <div class="dashboardright__text">
                <p class="sm">${new Date().getDay() === date.getDay() ? "Today" : weekdays[date.getDay()]}</p>
                <p>${item.day.condition.text}</p>
             </div>
        </div>
        <div class="dashboardright__info">
            <p class="large">${item.day["avgtemp_" + tempValue]}°</p>
        </div>
        `
        rightBar.appendChild(liEl)
    })
}

searchBar.addEventListener("submit", e => {
    e.preventDefault()
    const input = e.target.querySelector("input")
    city = input.value
    localStorage.setItem("cityName", JSON.stringify(city))
    fetchWeather(city)
    input.value = ''
})