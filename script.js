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


// Função para atualizar a imagem dentro do círculo com base no horário
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

// Chama a função para atualizar a imagem do ícone no início
updateWeatherIconBasedOnTime();

// Configura o intervalo para atualizar a imagem a cada 60 segundos
setInterval(updateWeatherIconBasedOnTime, 60000);


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
    updateWeatherHeaderImage(condition); // Atualizar imagem do cabeçalho
    updateFloodedMarkers(condition); // Atualizar marcadores de locais alagados
    const iconCode = data.weather[0].icon; // Código do ícone
    const weatherIcon = document.getElementById("weather-icon"); // Selecionar o elemento <img>
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL do ícone
    weatherIcon.alt = `Ícone representando ${weather}`; // Texto alternativo
    updateCurrentDate(); //Atualizar data
    updateCurrentTime(); // Atualizar hora
  } catch (error) {
    console.error("Erro ao buscar previsão do tempo:", error);
    document.getElementById("condition").innerText = "Erro ao buscar previsão.";
  }
}
document.getElementById("update-weather").addEventListener("click", fetchWeather);
fetchWeather();

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

// fetchWeather();
//Alerta de tempestade
function showStormAlert() {
  const alertElement = document.getElementById("storm-alert");
  alertElement.classList.remove("hidden");
  alertElement.classList.add("visible");
}




