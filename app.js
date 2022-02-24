const inputQuery = document.querySelector('#search-loc')
const form = document.querySelector('form')
const forecastCtn = document.querySelector('#display-forecast')



async function getWeather() {
   try {
      const units = document.querySelector('input[name="units"]:checked').value;
      const query = inputQuery.value;
      const geoResp = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=3e398fb373502081fc474681f340d786`);
      const geoJson = await geoResp.json();
      const lon = geoJson[0].lon;
      const lat = geoJson[0].lat;
      const resp = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=minutely,hourly,alerts&appid=3e398fb373502081fc474681f340d786`);
      const json = await resp.json();
      setBgd(query)
      return json;
   } catch (err) {
      console.log(err)
   }
}

async function getSevenDays(input) {
   try {
      let info = await input;
      let resArr = info.daily
      for (let i = 1; i < resArr.length; i++) {
         const date = new Date(resArr[i].dt * 1000)
         const weather = resArr[i].weather[0]
         const temp = resArr[i].temp
         seedUI(date, weather, temp)
      }
   } catch (err) {
      console.log(err)
   }
}




function setBgd(locationOne) {
   document.body.style.backgroundImage = `url('https://source.unsplash.com/random/?${locationOne},landscape')`
}


function seedUI(date, weatherObj, tempObj) {

   const icon = `http://openweathermap.org/img/wn/${weatherObj.icon}@2x.png`
   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

   const headDate = document.createElement('p')
   headDate.classList.add('headdate')
   headDate.innerText = `${days[date.getDay()]} ${date.getDate()}/${months[date.getMonth()]}`

   const headWeatherCtn = document.createElement('div');
   headWeatherCtn.classList.add('headweather')
   const headWeather = document.createElement('p');
   headWeather.innerText = weatherObj.main

   const img = new Image()
   img.src = icon

   headWeatherCtn.appendChild(img)
   headWeatherCtn.appendChild(headWeather)

   const maxTemp = Math.round(tempObj.max)
   const minTemp = Math.round(tempObj.min)

   const temp = document.createElement('p')
   temp.classList.add('temp')
   temp.innerText = `Temp: 
   Min ${minTemp} Max ${maxTemp}`



   const card = document.createElement('div')
   card.classList.add('card')

   card.appendChild(headDate)
   card.appendChild(headWeatherCtn)
   card.appendChild(temp)

   forecastCtn.appendChild(card)

}



form.addEventListener('submit', function (e) {
   e.preventDefault()
   forecastCtn.innerHTML = ''
   getSevenDays(getWeather())
})