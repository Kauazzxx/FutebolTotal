const API_KEY = "986a8de9d8524868a4c464626adf9822"; 
const FOOTBALL_API_KEY = "dcacfef7d7mshdeab87d8e08f4f0p154a7bjsn8f488a2d43ad"; 
const newsContainer = document.getElementById("news-container");
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'dcacfef7d7mshdeab87d8e08f4f0p154a7bjsn8f488a2d43ad',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
};

fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all', options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));


let page = 1;
let currentQuery = "futebol";
let loading = false;

/* Alternar seções */
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelector(`[onclick="showSection('${id}')"]`).classList.add("active");
}

/* Buscar notícias */
async function fetchNews(query = "futebol", reset = true) {
  if (reset) {
    newsContainer.innerHTML = "<p>⏳ Carregando notícias...</p>";
    page = 1;
    currentQuery = query;
  }

  if (loading) return;
  loading = true;

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&language=pt&sortBy=publishedAt&pageSize=20&page=${page}&apiKey=${API_KEY}`
    );
    const data = await res.json();

    if (reset) newsContainer.innerHTML = "";

    data.articles
      .filter(a => a.urlToImage)
      .forEach(article => {
        const card = document.createElement("div");
        card.className = "news-card";
        card.innerHTML = `
          <img src="${article.urlToImage}" alt="imagem notícia">
          <h3>${article.title}</h3>
          <p>${article.description || "Clique para ler mais..."}</p>
          <small><b>${article.source.name}</b> • ${new Date(article.publishedAt).toLocaleDateString("pt-BR")}</small>
        `;
        card.onclick = () => openModal(article);
        newsContainer.appendChild(card);
      });

    page++;
    loading = false;
  } catch (err) {
    console.error(err);
    newsContainer.innerHTML = "<p style='color:red;'>⚠ Erro ao carregar notícias.</p>";
    loading = false;
  }
}

/* Modal */
function openModal(article) {
  const modal = document.getElementById("news-modal");
  const modalContent = document.getElementById("modal-content");
  modal.style.display = "flex";
  modalContent.innerHTML = `
    <h2>${article.title}</h2>
    <img src="${article.urlToImage}" style="width:100%; border-radius:10px; margin-bottom:10px;">
    <p>${article.content || article.description || "Leia mais no link abaixo."}</p>
    <a href="${article.url}" target="_blank">🌐 Ler notícia completa</a>
  `;
}
document.getElementById("close-modal").onclick = () => {
  document.getElementById("news-modal").style.display = "none";
};

/* Jogos ao vivo */
async function fetchLiveMatches() {
  const liveContainer = document.getElementById("live-matches");
  liveContainer.innerHTML = "<p>⏳ Carregando jogos...</p>";

  try {
    // Exemplo usando API-Football (RapidAPI)
    const res = await fetch("https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": FOOTBALL_API_KEY
      }
    });
    const data = await res.json();

    liveContainer.innerHTML = "";

    if (!data.response || data.response.length === 0) {
      liveContainer.innerHTML = "<p>Nenhum jogo ao vivo no momento.</p>";
      return;
    }

    data.response.forEach(match => {
      const home = match.teams.home.name;
      const away = match.teams.away.name;
      const score = `${match.goals.home} - ${match.goals.away}`;

      const card = document.createElement("div");
      card.className = "match-card";
      card.innerHTML = `
        <span>${home}</span>
        <span>${score}</span>
        <span>${away}</span>
      `;
      liveContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    liveContainer.innerHTML = "<p style='color:red;'>⚠ Erro ao carregar placares.</p>";
  }
}

/* Scroll infinito */
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    fetchNews(currentQuery, false);
  }
});

/* Inicialização */
fetchNews();
fetchLiveMatches();
