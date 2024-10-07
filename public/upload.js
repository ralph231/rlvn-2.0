// Dark Mode Toggle Functionality
const toggleDarkMode = () => {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    localStorage.setItem('darkModePreference', isDarkMode ? 'enabled' : 'disabled');
};

// Apply saved dark mode preference
window.onload = () => {
    const darkModePreference = localStorage.getItem('darkModePreference');
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
    }
};

// Preview multiple files function
function previewFile() {
    const input = document.getElementById('mediaInput');
    const preview = document.getElementById('file-preview');

    // Clear previous content
    preview.innerHTML = '';

    if (input.files && input.files.length > 0) {
        for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];
            const reader = new FileReader();

            reader.onload = function (e) {
                const mediaType = file.type.split('/')[0];
                const mediaElement = document.createElement(mediaType === 'image' ? 'img' : 'video');
                mediaElement.src = e.target.result;
                mediaElement.controls = true;
                preview.appendChild(mediaElement);
            };

            reader.readAsDataURL(file);
        }
        preview.style.display = 'flex';
    } else {
        preview.style.display = 'none';
    }
}

// Live preview for title and date
const titleInput = document.getElementById('titleInput');
const dateInput = document.getElementById('dateInput');
const previewTitle = document.getElementById('previewTitle');
const previewDate = document.getElementById('previewDate');

titleInput.addEventListener('input', () => {
    previewTitle.textContent = `Title: ${titleInput.value}`;
});

dateInput.addEventListener('input', () => {
    previewDate.textContent = `Date: ${dateInput.value}`;
});