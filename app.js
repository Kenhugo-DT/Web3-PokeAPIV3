
const apiKey = 'a7c55c3f-1ca4-471c-940b-7749b8e29a99'; 




let pokedex = []; // Array med pokémon-objekter (1-251)
let currentPokedexIndex = 0; // Gjeldende index i pokedex-arrayen
let visitedPokemon = {}; // Objektet for å huske hvilke Pokémon vi har besøkt

// Når dokumentet er lastet
document.addEventListener('DOMContentLoaded', function() {
    console.log('Pokédex Viewer er lastet');
    
    document.getElementById('prev-btn').addEventListener('click', showPreviousPokemon);
    document.getElementById('next-btn').addEventListener('click', showNextPokemon);
    document.getElementById('random-btn').addEventListener('click', showRandomPokemon);
    document.getElementById('search-btn').addEventListener('click', searchPokemon);
    
    // Søk når man trykker Enter
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchPokemon();
        }
    });
    
    
    const factsBtn = document.getElementById('facts-btn');
    const factsPanel = document.getElementById('facts-panel');
    
    factsBtn.addEventListener('mouseenter', function() {
        if (pokedex[currentPokedexIndex]?.card) {
            updateFactsPanel();
            factsPanel.style.display = 'block';
        }
    });
    
    factsBtn.addEventListener('mouseleave', function() {
        factsPanel.style.display = 'none';
    });
    
    
    buildPokedex();
});

// Funksjon for å bygge opp Pokédex (1-251)
async function buildPokedex() {
    
    document.getElementById('pokemon-card').src = 'loading.gif'; // Erstatt med faktisk lasteanimering
    
    console.log('Bygger Pokédex...');
    
    // Initialiser pokedex-arrayen med 251 tomme objekter
    pokedex = Array(251).fill().map((_, i) => ({
        dexNum: i + 1,
        name: `Pokemon #${i + 1}`,
        card: null,
        cards: [] // Vil holde alle kort for denne Pokémon
    }));
    
    try {
        // Hent alle kort fra API (dette kan ta litt tid)
        // Vi må gjøre flere kall for å få alle kortene
        const pageSize = 250;
        let page = 1;
        let hasMoreCards = true;
        
        while (hasMoreCards) {
            console.log(`Henter kort (side ${page})...`);
            
            const response = await fetch(`https://api.pokemontcg.io/v2/cards?pageSize=${pageSize}&page=${page}`, {
                headers: {
                    'X-Api-Key': apiKey
                }
            });
            
            const data = await response.json();
            const cards = data.data || [];
            
            if (cards.length === 0) {
                hasMoreCards = false;
                continue;
            }
            
            // Gå gjennom kortene og mapper dem til riktig Pokémon i pokedex
            cards.forEach(card => {
                // Sjekk om kortet har nationalPokedexNumbers (noen kort mangler dette)
                if (card.nationalPokedexNumbers && card.nationalPokedexNumbers.length > 0) {
                    const dexNum = card.nationalPokedexNumbers[0];
                    
                    // Sjekk om Pokémon er innenfor vårt ønskede intervall (1-251)
                    if (dexNum >= 1 && dexNum <= 251) {
                        // Finn Pokémon i pokedex
                        const pokemon = pokedex[dexNum - 1];
                        
                        if (pokemon) {
                            // Legg til kortet i Pokémon-kortlisten
                            pokemon.cards.push(card);
                            
                            // Oppdater navn (siden vi starter med midlertidige navn)
                            pokemon.name = card.name.split('-')[0].trim(); // Fjern eventuelle suffiks
                        }
                    }
                }
            });
            
            page++;
        }
        
        // Når alle kort er hentet, vis første Pokémon
        console.log('Pokédex bygget!');
        
        // Sjekk om vi har Pokémon med kort
        const hasValidPokemon = pokedex.some(pokemon => pokemon.cards.length > 0);
        
        if (hasValidPokemon) {
            // Finn første gyldige Pokémon
            for (let i = 0; i < pokedex.length; i++) {
                if (pokedex[i].cards.length > 0) {
                    currentPokedexIndex = i;
                    break;
                }
            }
            
            // Vis første Pokémon
            selectRandomCardForCurrentPokemon();
            displayCurrentPokemon();
        } else {
            console.error('Ingen gyldige Pokémon-kort funnet');
            document.getElementById('pokemon-card').src = 'error.jpg'; // Erstatt med faktisk feilbilde
        }
    } catch (error) {
        console.error('Feil ved oppbygging av Pokédex:', error);
        document.getElementById('pokemon-card').src = 'error.jpg'; // Erstatt med faktisk feilbilde
    }
}

// Funksjon for å velge et tilfeldig kort for gjeldende Pokémon
function selectRandomCardForCurrentPokemon() {
    const pokemon = pokedex[currentPokedexIndex];
    
    if (pokemon && pokemon.cards.length > 0) {
        // Velg et tilfeldig kort fra listen
        const randomIndex = Math.floor(Math.random() * pokemon.cards.length);
        pokemon.card = pokemon.cards[randomIndex];
    }
}

// Funksjon for å vise gjeldende Pokémon
function displayCurrentPokemon() {
    const pokemon = pokedex[currentPokedexIndex];
    
    if (pokemon && pokemon.card) {
        console.log(`Viser Pokémon #${pokemon.dexNum}: ${pokemon.name}`);
        
        // Oppdater bildet
        const cardElement = document.getElementById('pokemon-card');
        cardElement.src = pokemon.card.images.large;
        cardElement.alt = pokemon.name;
    } else {
        console.error(`Ingen gyldig Pokémon eller kort på indeks ${currentPokedexIndex}`);
    }
}

// Funksjon for å vise forrige Pokémon
function showPreviousPokemon() {
    let newIndex = currentPokedexIndex - 1;
    
    
    if (newIndex < 0) {
        newIndex = pokedex.length - 1;
    }
    
    // Finn forrige gyldige Pokémon (som har kort)
    while (newIndex !== currentPokedexIndex) {
        if (pokedex[newIndex].cards.length > 0) {
            currentPokedexIndex = newIndex;
            break;
        }
        
        newIndex--;
        if (newIndex < 0) {
            newIndex = pokedex.length - 1;
        }
    }
    
    // Sjekk om vi har besøkt denne Pokémon før
    const dexNum = pokedex[currentPokedexIndex].dexNum;
    if (visitedPokemon[dexNum]) {
        // Bruk samme kort som sist
        pokedex[currentPokedexIndex].card = visitedPokemon[dexNum];
    } else {
        // Velg et nytt tilfeldig kort
        selectRandomCardForCurrentPokemon();
        // Lagre kortet
        visitedPokemon[dexNum] = pokedex[currentPokedexIndex].card;
    }
    
    displayCurrentPokemon();
}

// Funksjon for å vise neste Pokémon
function showNextPokemon() {
    let newIndex = currentPokedexIndex + 1;
    
    // Wrap around til starten hvis vi er på siste element
    if (newIndex >= pokedex.length) {
        newIndex = 0;
    }
    
    // Finn neste gyldige Pokémon (som har kort)
    while (newIndex !== currentPokedexIndex) {
        if (pokedex[newIndex].cards.length > 0) {
            currentPokedexIndex = newIndex;
            break;
        }
        
        newIndex++;
        if (newIndex >= pokedex.length) {
            newIndex = 0;
        }
    }
    
    // Sjekk om vi har besøkt denne Pokémon før
    const dexNum = pokedex[currentPokedexIndex].dexNum;
    if (visitedPokemon[dexNum]) {
        // Bruk samme kort som sist
        pokedex[currentPokedexIndex].card = visitedPokemon[dexNum];
    } else {
        // Velg et nytt tilfeldig kort
        selectRandomCardForCurrentPokemon();
        // Lagre kortet
        visitedPokemon[dexNum] = pokedex[currentPokedexIndex].card;
    }
    
    displayCurrentPokemon();
}

// Funksjon for å vise en tilfeldig Pokémon
function showRandomPokemon() {
    // Finn alle gyldige indekser (Pokémon som har kort)
    const validIndices = pokedex
        .map((pokemon, index) => ({ pokemon, index }))
        .filter(item => item.pokemon.cards.length > 0)
        .map(item => item.index);
    
    if (validIndices.length > 0) {
        // Velg en tilfeldig indeks
        const randomIndex = Math.floor(Math.random() * validIndices.length);
        currentPokedexIndex = validIndices[randomIndex];
        
        // Velg et tilfeldig kort for denne Pokémon
        selectRandomCardForCurrentPokemon();
        
        // Lagre kortet
        const dexNum = pokedex[currentPokedexIndex].dexNum;
        visitedPokemon[dexNum] = pokedex[currentPokedexIndex].card;
        
        displayCurrentPokemon();
    }
}

// Funksjon for å søke etter Pokémon
function searchPokemon() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) return;
    
    console.log(`Søker etter: ${searchTerm}`);
    
    // Søk etter navn eller Pokédex-nummer
    let foundIndex = -1;
    
    // Sjekk om søketermen er et tall (Pokédex-nummer)
    if (!isNaN(searchTerm)) {
        const dexNum = parseInt(searchTerm);
        if (dexNum >= 1 && dexNum <= 251) {
            // Finn Pokémon med dette Pokédex-nummeret
            foundIndex = pokedex.findIndex(pokemon => 
                pokemon.dexNum === dexNum && pokemon.cards.length > 0
            );
        }
    } else {
        // Søk etter navn (fuzzy match)
        foundIndex = pokedex.findIndex(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm) && pokemon.cards.length > 0
        );
    }
    
    if (foundIndex !== -1) {
        currentPokedexIndex = foundIndex;
        
        // Sjekk om vi har besøkt denne Pokémon før
        const dexNum = pokedex[currentPokedexIndex].dexNum;
        if (visitedPokemon[dexNum]) {
            // Bruk samme kort som sist
            pokedex[currentPokedexIndex].card = visitedPokemon[dexNum];
        } else {
            // Velg et nytt tilfeldig kort
            selectRandomCardForCurrentPokemon();
            // Lagre kortet
            visitedPokemon[dexNum] = pokedex[currentPokedexIndex].card;
        }
        
        displayCurrentPokemon();
    } else {
        console.log('Ingen treff');
        alert(`Ingen Pokémon funnet for "${searchTerm}"`);
    }
}

// Funksjon for å oppdatere facts-panelet
function updateFactsPanel() {
    const pokemon = pokedex[currentPokedexIndex];
    if (!pokemon || !pokemon.card) return;
    
    const factsPanel = document.getElementById('facts-panel');
    const card = pokemon.card;
    
    let content = `
        <h3>${pokemon.name} (#${pokemon.dexNum})</h3>
        <p><strong>Kort:</strong> ${card.name}</p>
        <p><strong>Set:</strong> ${card.set.name}</p>
        <p><strong>Nummer:</strong> ${card.number}/${card.set.printedTotal}</p>
        <p><strong>Sjeldenhetsgrad:</strong> ${card.rarity || 'Ukjent'}</p>
    `;
    
    // Legg til pokemon-spesifikk info
    if (card.supertype === 'Pokémon') {
        content += `<p><strong>HP:</strong> ${card.hp}</p>`;
        
        if (card.types && card.types.length > 0) {
            content += `<p><strong>Type:</strong> ${card.types.join(', ')}</p>`;
        }
        
        if (card.attacks && card.attacks.length > 0) {
            content += `<p><strong>Angrep:</strong></p>`;
            card.attacks.forEach(attack => {
                content += `<p style="padding-left: 15px; color: #ff9d9d;">
                    - ${attack.name}: ${attack.damage}
                </p>`;
            });
        }
        
        // Legg til svakheter
        if (card.weaknesses && card.weaknesses.length > 0) {
            const weaknessText = card.weaknesses.map(w => `${w.type} ${w.value}`).join(', ');
            content += `<p><strong>Svakheter:</strong> ${weaknessText}</p>`;
        }
    }
    
    factsPanel.innerHTML = content;
}