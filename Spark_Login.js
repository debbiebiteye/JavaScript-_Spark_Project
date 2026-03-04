async function getJSON() {
    const user = document.getElementById('username').value.trim();
    const psw = document.getElementById('password').value;

    if (!user || !psw) {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: psw }),
        });

        const payload = await response.json();

        if (!response.ok) {
            alert(payload.message || 'Wrong username or password.');
            return;
        }

        window.location.href = 'Spark_Index.html';
    } catch (error) {
        console.error(error);
        alert('Login service is currently unavailable. Please try again later.');
    }
}
