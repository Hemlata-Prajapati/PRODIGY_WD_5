const apiKey = "efd24486554de84619d291e0ab6db8c7";

document.getElementById("search-btn").addEventListener("click", fetchWeather);
document.getElementById("location-btn").addEventListener("click", fetchWeatherByLocation);
document.getElementById("city-input").addEventListener("keypress", (event) => {
  if (event.key === "Enter") fetchWeather();
});

// Theme toggle functionality
document.getElementById("theme-toggle").addEventListener("change", function () {
  document.body.classList.toggle("dark", this.checked);
});

async function fetchWeather() {
  const city = document.getElementById("city-input").value.trim();
  if (!city) return alert("Please enter a city name!");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
    if (response.ok) {
      displayWeather(data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Error fetching weather data. Please try again.");
  }
}

async function fetchWeatherByLocation() {
  if (!navigator.geolocation) return alert("Geolocation is not supported by your browser.");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        if (response.ok) {
          displayWeather(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error fetching weather data. Please try again.");
      }
    },
    () => {
      alert("Unable to retrieve your location.");
    }
  );
}

function displayWeather(data) {
  document.getElementById("weather-info").classList.remove("hidden");

  document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("description").textContent = `Condition: ${capitalizeFirstLetter(data.weather[0].description)}`;
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C (Feels like: ${data.main.feels_like}°C)`;

  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
  document.getElementById("cloudiness").textContent = `${data.clouds.all}%`;
  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  document.getElementById("sunrise").textContent = sunrise;
  document.getElementById("sunset").textContent = sunset;

  // Update main weather icon using weather-icons classes
  const weatherId = data.weather[0].id;
  const iconClass = mapWeatherIdToIcon(weatherId);
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.className = "wi " + iconClass;
  weatherIcon.style.fontSize = "64px";

  document.querySelector(".weather-card").classList.add("visible");

  // Rainy message
  const rainyMessage = document.getElementById("rainy-message");
  if (data.weather[0].main.toLowerCase().includes("rain")) {
    rainyMessage.textContent = "It's rainy today! Don't forget your umbrella ☔️";
  } else {
    rainyMessage.textContent = "It's not rainy today!";
  }
  rainyMessage.classList.remove("hidden");
}

// Capitalize first letter helper
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Map OpenWeather weather ID to weather-icons classes
function mapWeatherIdToIcon(id) {
  if (id >= 200 && id < 300) return "wi-thunderstorm";
  else if (id >= 300 && id < 500) return "wi-sprinkle";
  else if (id >= 500 && id < 600) return "wi-rain";
  else if (id >= 600 && id < 700) return "wi-snow";
  else if (id >= 700 && id < 800) return "wi-fog";
  else if (id === 800) return "wi-day-sunny";
  else if (id === 801) return "wi-day-cloudy";
  else if (id === 802) return "wi-cloud";
  else if (id === 803 || id === 804) return "wi-cloudy";
  else return "wi-na";
}
