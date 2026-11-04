// 1. Selección de elementos del DOM
const language = document.getElementById("language");
const stateContainer = document.getElementById("state-container");
const refresh = document.getElementById("btn-refresh");

// 2. Estado Vacío (Empty State)
function showEmptyState() {
    stateContainer.innerHTML = "<p>Select Language</p>";
    refresh.style.display = "none";
}

// 3. Estado de Carga (Loading State)
function showLoadingState() {
    stateContainer.innerHTML = "<p>Loading, please wait...</p>";
    refresh.style.display = "none";
}

// 4. Estado de Éxito (Success State) -> Muestra el repositorio
function showSuccessState(repo) {
    stateContainer.innerHTML = `
        <div class="repo-card">
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description || "Sin descripción disponible"}</p>
            <div class="repo-stats">
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
                <span>🐞 ${repo.open_issues_count}</span>
            </div>
        </div>
    `;
    refresh.style.display = "block"; // Volvemos a mostrar el botón Refresh
}

// 5. Estado de Error (Error State)
function showErrorState() {
    stateContainer.innerHTML = "<p>Ocurrió un error al cargar el repositorio. Intenta de nuevo.</p>";
    refresh.style.display = "block";
}

// 6. Función asíncrona para consultar la API
async function getRandomRepo(selectedLanguage) {
    showLoadingState();

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=language:${selectedLanguage}`);
        const data = await response.json();

        // Elegimos un repositorio al azar del arreglo
        const random = Math.floor(Math.random() * data.items.length);
        const repo = data.items[random];

        // Lo mostramos en pantalla
        showSuccessState(repo);

    } catch (error) {
        console.log("Ocurrió un error al consultar la API:", error);
        showErrorState();
    }
}

// --- EVENTOS DE LA PÁGINA ---

// Evento al cambiar la opción del selector
language.addEventListener("change", () => {
    let selec = language.value;
    
    if (selec === "") {
        showEmptyState();
    } else {
        getRandomRepo(selec);
    }
});

// Evento al hacer clic en el botón Refresh
refresh.addEventListener("click", () => {
    let selec = language.value;
    if (selec !== "") {
        getRandomRepo(selec);
    }
});

// Inicializamos la app en estado vacío
showEmptyState();