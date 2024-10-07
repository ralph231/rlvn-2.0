// Function to refresh the page
function refreshPage() {
    location.reload();
}

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const toggleButton = document.querySelector('.dark-mode-toggle');

    body.classList.toggle('dark-mode');

    document.querySelectorAll('.gallery-container, .gallery-item, .upload-button, .delete-button').forEach(element => {
        element.classList.toggle('dark-mode');
    });

    toggleButton.textContent = body.classList.contains('dark-mode') ? '🌞' : '🌙';
    localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
}

// Check localStorage for dark mode preference on page load
window.onload = function() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        document.querySelector('.dark-mode-toggle').textContent = '🌞';
    }
};

// Function to format date and remove GMT+0000
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to filter the gallery based on search input
function filterGallery() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const items = document.querySelectorAll('.gallery-item');

    items.forEach(item => {
        const id = item.getAttribute('data-id').toLowerCase();
        const title = item.getAttribute('data-title').toLowerCase();
        const date = item.getAttribute('data-date').toLowerCase();

        if (id.includes(searchInput) || title.includes(searchInput) || date.includes(searchInput)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Show delete notification
function showDeleteNotification(title) {
    const notification = document.getElementById('delete-notification');
    notification.textContent = `${title} has been deleted!`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Open fullscreen image with formatted date
function openFullscreenImage(src, title, date) {
    const modal = document.getElementById('fullscreen-modal');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenTitle = document.getElementById('fullscreen-title');
    const downloadLink = document.getElementById('download-fullscreen');

    fullscreenImg.src = src;
    fullscreenImg.style.display = 'block';
    fullscreenTitle.textContent = `${title} - ${formatDate(date)}`;
    fullscreenTitle.style.display = 'block';
    downloadLink.href = src;
    downloadLink.style.display = 'block';

    modal.style.display = 'block';
}

// Open fullscreen video with formatted date
function openFullscreenVideo(src, type, title, date) {
    const modal = document.getElementById('fullscreen-modal');
    const fullscreenVideo = document.getElementById('fullscreen-video');
    const fullscreenTitle = document.getElementById('fullscreen-title');
    const downloadLink = document.getElementById('download-fullscreen');

    fullscreenVideo.src = src;
    fullscreenVideo.style.display = 'block';
    fullscreenTitle.textContent = `${title} - ${formatDate(date)}`;
    fullscreenTitle.style.display = 'block';
    downloadLink.href = src;
    downloadLink.style.display = 'none';

    modal.style.display = 'block';
}

// Close fullscreen
function closeFullscreen() {
    const modal = document.getElementById('fullscreen-modal');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenVideo = document.getElementById('fullscreen-video');

    modal.style.display = 'none';
    fullscreenImg.style.display = 'none';
    fullscreenVideo.style.display = 'none';
}

function showCreateFolderForm() {
    document.getElementById('folder-form').style.display = 'block';
}