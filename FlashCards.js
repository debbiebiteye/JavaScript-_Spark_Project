const flashCards = document.getElementById('flashCards');
const nextButton = document.getElementById('nextButton');
const welcomeMessage = document.getElementById('welcomeMessage');

let recipes = [];
let index = 0;
let showingRecipe = false;

window.onload = async function () {
    flashCards.innerHTML = 'Click to Start';
    nextButton.addEventListener('click', showNextCard);
    await Promise.all([loadCurrentUser(), loadRecipes()]);
};

async function loadCurrentUser() {
    try {
        const response = await fetch('/api/me', { cache: 'no-store' });
        const payload = await response.json();

        if (!response.ok) {
            welcomeMessage.textContent = 'Welcome!';
            return;
        }

        welcomeMessage.textContent = `Welcome, ${payload.username}!`;
    } catch (error) {
        console.error(error);
        welcomeMessage.textContent = 'Welcome!';
    }
}

async function loadRecipes() {
    try {
        const response = await fetch('/api/recipes', { cache: 'no-store' });
        const payload = await response.json();

        if (!response.ok) {
            flashCards.innerHTML = payload.message || 'Unable to load recipes right now.';
            nextButton.disabled = true;
            return;
        }

        recipes = payload;

        if (!recipes.length) {
            flashCards.innerHTML = 'No recipes found.';
            nextButton.disabled = true;
        }
    } catch (error) {
        console.error(error);
        flashCards.innerHTML = 'Unable to load recipes right now.';
        nextButton.disabled = true;
    }
}

function showNextCard() {
    if (!recipes.length) {
        return;
    }

    if (index >= recipes.length) {
        flashCards.innerHTML = 'Done!';
        nextButton.disabled = true;
        return;
    }

    const currentRecipe = recipes[index];

    if (!showingRecipe) {
        flashCards.innerHTML = currentRecipe.name;
        showingRecipe = true;
    } else {
        flashCards.innerHTML = currentRecipe.recipe;
        showingRecipe = false;
        index++;
    }
}

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
        console.error(error);
    }

    window.location.href = 'Spark_Login.html';
}
