// Função para descriptografar dados em Base64
function decryptData(encryptedData) {
    try {
        return atob(encryptedData);
    } catch (e) {
        console.error('Erro ao descriptografar dados:', e);
        return null;
    }
}

// Função para processar e aplicar acentuação nos títulos
function correctAccentuation(text) {
    const accentMap = {
        "acao": "Ação", "acoes": "Ações",
        "coracao": "Coração", "coracoes": "Corações",
        "licao": "Lição", "licoes": "Lições",
        "bencao": "Bênção", "bencoes": "Bênçãos",
        "traicao": "Traição", "traicoes": "Traições",
        "heroi": "Herói", "herois": "Heróis",
        "memorias": "Memórias",
        "historia": "História", "historias": "Histórias",
        "paixao": "Paixão", "paixoes": "Paixões",
        "ilusorio": "Ilusório", "ilusorios": "Ilusórios",
        "misterio": "Mistério", "misterios": "Mistérios",
        "diario": "Diário", "diarios": "Diários",
        "bilionario": "Bilionário", "bilionarios": "Bilionários",
        "bilionaria": "Bilionária", "bilionarias": "Bilionárias",
        "estagiaria": "Estagiária", "estagiarias": "Estagiárias",
        "genia": "Gênia", "genias": "Gênias",
        "conspiracao": "Conspiração", "conspiracoes": "Conspirações",
        "danca": "Dança", "dancas": "Danças",
        "docura": "Doçura",
        "esperanca": "Esperança", "esperancas": "Esperanças",
        "vinganca": "Vingança", "vingancas": "Vinganças",
        "ciencia": "Ciência", "ciencias": "Ciências",
        "seculo": "Século", "seculos": "Séculos",
        "splendida": "Esplêndida",
        "renaescenca": "Renascença",
        "tentacao": "Tentação", "tentacoes": "Tentações",
        "ultima": "Última", "ultimas": "Últimas",
        "familia": "Família", "familias": "Famílias",
        "patrao": "Patrão", "patroes": "Patrões",
        "bebe": "Bebê", "bebes": "Bebês",
        "irmao": "Irmão", "irmaos": "Irmãos",
        "irma": "Irmã", "irmas": "Irmãs",
        "apos": "Após",
        "odio": "Ódio",
        "laco": "Laço", "lacos": "Laços",
        "aniversario": "Aniversário",
        "mudanca": "Mudança",
        "maos": "Mãos",
        "atencao": "Atenção",
        "bisavo": "Bisavó", "bisavos": "Bisavós",
        "atracao": "Atração", "atracoes": "Atrações",
        "atraida": "Atraída", "atraidos": "Atraídos",
        "baba": "Babá", "babas": "Babás",
        "valentao": "Valentão", "valentoes": "Valentões",
        "episodio": "Episódio", "episodios": "Episódios",
        "campeao": "Campeão", "campeoes": "Campeões",
        "caido": "Caído", "caidos": "Caídos",
        "entao": "Então",
        "relampago": "Relâmpago", "relampagos": "Relâmpagos",
        "garotao": "Garotão", "garotoes": "Garotões",
        "divorcio": "Divórcio",
        "implacavel": "Implacável", "implacaveis": "Implacáveis",
        "escritorio": "Escritório", "escritorios": "Escritórios",
        "vicio": "Vício", "vicios": "Vícios",
        "voce": "Você",
        "alem": "Além",
        "nao": "Não",
        "preco": "Preço",
        "ate": "Até",
        "maximo": "Máximo",
        "nevoas": "Névoas",
        "correra": "Correrá",
        "atras": "Atrás",
        "genio": "Gênio",
        "renascida": "Renascida"
    };

    const words = text.split(' ');
    const correctedWords = [];
    
    for (let word of words) {
        const lowerWord = word.toLowerCase();
        if (accentMap[lowerWord]) {
            correctedWords.push(accentMap[lowerWord]);
        } else {
            correctedWords.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        }
    }
    
    return correctedWords.join(' ');
}

// Variáveis globais
let allMovies = [];
const grid = document.getElementById('grid');
const search = document.getElementById('search');
const stats = document.getElementById('stats');
const videoModal = document.getElementById('videoModal');
const closeButton = document.querySelector('.close-button');
const videoPlayer = document.getElementById('videoPlayer');
const modalTitle = document.getElementById('modalTitle');

// Função para carregar e descriptografar dados de filmes
async function loadMovies() {
    try {
        const response = await fetch('encrypted_movies.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar arquivo de filmes');
        }
        const encryptedMovies = await response.json();
        
        allMovies = encryptedMovies.map(movie => {
            const playerUrl = decryptData(movie.player_url_enc);
            const originalUrl = decryptData(movie.original_url_enc);
            const title = correctAccentuation(movie.title_raw);
            const imageUrl = movie.image_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop';
            
            return {
                title: title,
                url: originalUrl,
                player_url: playerUrl,
                image_url: imageUrl
            };
        });
        
        // Ordenar alfabeticamente
        allMovies.sort((a, b) => a.title.localeCompare(b.title));
        
        render(allMovies);
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        stats.innerText = 'Erro ao carregar filmes. Tente novamente.';
    }
}

// Função para renderizar filmes
function render(items) {
    grid.innerHTML = items.map(m => `
        <div class="card" onclick="openVideoModal('${m.player_url.replace(/'/g, "\\'")}', '${m.title.replace(/'/g, "\\'")}')">
            <div class="poster">
                <img src="${m.image_url}" alt="${m.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="info">
                <div class="title">${m.title}</div>
                <button class="btn" onclick="openVideoModal('${m.player_url.replace(/'/g, "\\'")}', '${m.title.replace(/'/g, "\\'")}'); event.stopPropagation();">Assistir</button>
            </div>
        </div>
    `).join('');
    stats.innerText = items.length + ' filmes encontrados';
}

// Função para abrir modal com vídeo
function openVideoModal(playerUrl, title) {
    modalTitle.innerText = title;
    videoPlayer.src = playerUrl;
    videoModal.style.display = 'flex';
}

// Event listeners
search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allMovies.filter(m => m.title.toLowerCase().includes(term));
    render(filtered);
});

closeButton.onclick = function() {
    videoPlayer.src = '';
    videoModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == videoModal) {
        videoPlayer.src = '';
        videoModal.style.display = 'none';
    }
}

// Carregar filmes ao inicializar
document.addEventListener('DOMContentLoaded', loadMovies);
