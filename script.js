const apiKey = "73a9887ab637e8a8227beb9b3b52116d"; 
const city = "Juiz de Fora, BR"; // Cidade fixa para a previsão
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;



// Atualiza a data atual
function updateCurrentDate() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("pt-BR", {
    weekday:"long",
    day: "numeric",
    month: "long",
  });
  document.getElementById("current-date").innerText = formattedDate;
}

// Atualiza a hora atual
function updateCurrentTime() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("current-time").innerText = formattedTime;
}


// Atualiza a imagem de fundo do header com base na condição do tempo
function updateWeatherHeaderImage(condition) {
  const header = document.querySelector('header');
  const now = new Date();
  const currentHour = now.getHours();
  if (condition === "Clear" && currentHour >= 19 || condition === "Clear" && currentHour <= 6) {
    header.style.backgroundImage = "url('images/noite_estrelada.png')";
  } else {
    switch (condition) {
      case "Clear":
        header.style.backgroundImage = "url('images/ensolarado.png')";
        break;
      case "Clouds":
        header.style.backgroundImage = "url('images/nublado.png')";
        break;
      case "Rain":
        header.style.backgroundImage = "url('images/chuva.png')";
        break;
      case "Thunderstorm":
        header.style.backgroundImage = "url('images/tempestade.png')";
        break;
      case "Clear night":
        header.style.backgroundImage = "url('images/noite_estrelada.png')";
        break;
      default:
        header.style.backgroundImage = "url('images/default.png')";
        break;
    }
  }
  header.style.backgroundSize = "cover"; // Faz a imagem cobrir toda a área
  header.style.backgroundPosition = "center"; // Centraliza a imagem
  header.style.backgroundRepeat = "no-repeat"; // Garante que a imagem não se repita
}


// Atualiza a imagem dentro do círculo com base no horário
function updateWeatherIconBasedOnTime() {
  const now = new Date();
  const currentHour = now.getHours();
  const weatherIcon = document.getElementById("circle-icon");

  // Verifica o horário e troca a imagem
  if (currentHour >= 6 && currentHour <= 18) {
    weatherIcon.src = 'images/sol.png';  // Imagem do sol
    weatherIcon.alt = 'Sol';  // Texto alternativo
  } else {
    weatherIcon.src = 'images/lua.png';  // Imagem da lua
    weatherIcon.alt = 'Lua';  // Texto alternativo
  }
}

updateWeatherIconBasedOnTime();
setInterval(updateWeatherIconBasedOnTime, 60000); //tempo para atualização


function updateWeatherBackgroundBasedOnTimeAndCondition(weatherCondition) {
  const now = new Date();
  const currentHour = now.getHours();
  const bodyElement = document.getElementById('body');  
  let backgroundColor;

  // Define se é dia ou noite
  const isDaytime = currentHour >= 6 && currentHour <= 18;

  // Define a cor de fundo com base no horário e na condição climática
  if (isDaytime) {
    if (weatherCondition === "Clear") {
      backgroundColor = '#87CEEB'; 
    } else if (weatherCondition === "Clouds" || weatherCondition === "Rain") {
      backgroundColor = '#A9A9A9';  
    } else {
      backgroundColor = '#ADD8E6';  
    }
  } else {
    if (weatherCondition === "Clear") {
      backgroundColor = '#191970';  
    } else if (weatherCondition === "Clouds" || weatherCondition === "Rain") {
      backgroundColor = '#4F4F4F';  
    } else if (weatherCondition === "Thunderstorm") {
      backgroundColor = '#363636';  
    } else {
      backgroundColor = '#000080';  
    }
  }

  bodyElement.style.backgroundColor = backgroundColor;
}

// Atualiza o background com base na previsão do tempo ao carregar a página
async function fetchWeatherAndUpdateBackground() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      console.error("Erro ao buscar dados do clima:", data.message);
      return;
    }

    const weatherCondition = data.weather[0].main; 
    updateWeatherBackgroundBasedOnTimeAndCondition(weatherCondition);  
  } catch (error) {
    console.error("Erro ao buscar previsão do tempo:", error);
  }
}
fetchWeatherAndUpdateBackground();
setInterval(fetchWeatherAndUpdateBackground, 60000);

//Atualiza a data
function updateCurrentDate() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  document.getElementById("current-date").innerText = formattedDate;
}

// Atualiza a hora  
function updateCurrentTime() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("current-time").innerText = formattedTime;
}

// Busca a previsão do tempo
async function fetchWeather() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      document.getElementById("weather-info").innerText = "Erro ao obter dados.";
      return;
    }
    const weather = data.weather[0].description;
    const condition = data.weather[0].main;
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    document.getElementById("temp-main").innerText = `${Math.round(temp)}°C`;
    document.getElementById("condition").innerText = weather;
    document.getElementById("humidity").innerText = `Umidade: ${humidity}%`;
    //Atualiza imagem e estilos de acordo com a condição climática
    updateWeatherHeaderImage(condition);  
    updateFloodedMarkers(condition);  
    const iconCode = data.weather[0].icon;  
    const weatherIcon = document.getElementById("weather-icon");  
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;  
    weatherIcon.alt = `Ícone representando ${weather}`;  
    // updateCurrentDate();  
    // updateCurrentTime();  
    // setInterval(updateCurrentTime, 30000); 
    // setInterval(fetchWeather, 30000);
  } catch (error) {
    console.error("Erro ao buscar previsão do tempo:", error);
    document.getElementById("condition").innerText = "Erro ao buscar previsão.";
  }
}
// Inicializa o tempo e o clima
function initialize() {
  updateCurrentDate();
  updateCurrentTime();
  fetchWeather();

  // Atualiza clima e hora a cada 30 segundos
  setInterval(fetchWeather, 30000);
  setInterval(updateCurrentTime, 30000);
}

document.getElementById("update-weather").addEventListener("click", fetchWeather);
initialize()

// Coordenadas centrais para Juiz de Fora
const juizDeForaCoords = [-21.761, -43.349];
// Inicializar o mapa
const map = L.map('map-container').setView(juizDeForaCoords, 13);
// Adicionar camada de mapa (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap'
}).addTo(map);
// Lista de locais alagados (coordenadas de exemplo)
const floodedAreas = [
  { name: "Bairro Santa Luzia", coords: [-21.768, -43.353] },
  { name: "Centro", coords: [-21.762, -43.344] },
  { name: "Bairro São Mateus", coords: [-21.753, -43.364] }
];

// Adicionar marcadores para locais alagados
floodedAreas.forEach(area => {
  L.marker(area.coords)
    .addTo(map)
    .bindPopup(`<strong>${area.name}</strong><br>Área alagada.`)
    .openPopup();
});

// Atualizar marcadores dinamicamente - simulação de atualização
function updateFloodedAreas(newFloodedAreas, condition) {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  newFloodedAreas.forEach(area => {
    L.marker(area.coords)
      .addTo(map)
      .bindPopup(`<strong>${area.name}</strong><br>Área alagada.`)
      .openPopup();
  });

  if (condition === "Rain" || condition === "Thunderstorm") {
    newFloodedAreas.forEach(area => {
      L.marker(area.coords)
        .addTo(map)
        .bindPopup(`<strong>${area.name}</strong><br>Área alagada.`);
    });
  }
}

function updateFloodedMarkers(condition) {
  // Remover marcadores existentes
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Adicionar marcadores apenas se a condição for de chuva
  if (condition === "Rain" || condition === "Thunderstorm") {
    floodedAreas.forEach(area => {
      L.marker(area.coords)
        .addTo(map)
        .bindPopup(`<strong>${area.name}</strong><br>Área alagada.`);
    });
  }
}

// Atualiza locais alagados após 10 segundos (com base na condição climática)
setTimeout(() => {
  const updatedFloodedAreas = [
    { name: "Bairro Granbery", coords: [-21.764, -43.343] },
    { name: "Bairro Mariano Procópio", coords: [-21.765, -43.335] }
  ];
  const currentCondition = document.getElementById("condition").innerText.toLowerCase();

  if (currentCondition.includes("chuva")) {
    floodedAreas.push(...updatedFloodedAreas); // Atualiza a lista de locais alagados
    updateFloodedMarkers("Rain");
  } else {
    updateFloodedMarkers("Clear");
  }
}, 10000);

 
//Alerta de tempestade
function showStormAlert() {
  const alertElement = document.getElementById("storm-alert");
  alertElement.classList.remove("hidden");
  alertElement.classList.add("visible");
}




