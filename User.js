const welcomeMessage = document.getElementById('welcomeMessage');

window.onload = async function () {
    await loadCurrentUser();
};

async function loadCurrentUser() {
    if (!welcomeMessage) {
        return;
    }

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

// This function gets the signed-in user's profile information.
async function getJSON() {
    const profileDiv = document.getElementById('myOnlyDiv');

    try {
        const response = await fetch('/api/me', { cache: 'no-store' });
        const payload = await response.json();

        if (!response.ok) {
            profileDiv.innerHTML = payload.message || 'Unable to load profile information right now.';
            return;
        }

        profileDiv.innerHTML = profileDiv.innerHTML ? '' : payload.info;
    } catch (error) {
        console.error(error);
        profileDiv.innerHTML = 'Unable to load profile information right now.';
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
