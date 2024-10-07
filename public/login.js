// Login notification functionality
function showLoginNotification(message, type) {
    const notification = document.getElementById('loginNotification');
    notification.textContent = message;
    notification.classList.remove('error', 'success');

    if (type === 'success') {
        notification.classList.add('success');
        notification.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        notification.classList.add('error');
        notification.style.backgroundColor = '#f44336';
    }

    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Check for login status in URL parameters and show relevant notification
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('login')) {
    const status = urlParams.get('login');

    switch (status) {
        case 'success':
            showLoginNotification("Login successful!", 'success');
            break;
        case 'password_error':
            showLoginNotification("Incorrect password. Please try again.", 'error');
            break;
        case 'username_error':
            showLoginNotification("Username not found. Please try again.", 'error');
            break;
        case 'both_error':
            showLoginNotification("Incorrect username and password. Please try again.", 'error');
            break;
    }
}

// Display flash messages if they exist
<% if (success_msg) { %>
    showLoginNotification("<%= success_msg %>", 'success');
<% } %>
<% if (error_msg) { %>
    showLoginNotification("<%= error_msg %>", 'error');
<% } %>