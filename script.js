document.addEventListener('DOMContentLoaded', function() {
    attachEventHandlers();
});

function attachEventHandlers() {
    // Function lal Add City Form
    const addCityForm = document.getElementById('addCityForm');
    if (addCityForm) {
        addCityForm.addEventListener('submit', handleAddCity);
    }

    // Function lal Delete City Form
    const deleteCityForm = document.getElementById('deleteCityForm');
    const deleteCountrySelector = document.getElementById('deleteCountrySelector');
    if (deleteCityForm && deleteCountrySelector) {
        deleteCityForm.addEventListener('submit', handleDeleteCity);
        deleteCountrySelector.addEventListener('change', populateCityOptions);
    }

    // Function lal Update City Form
    const updateCityForm = document.getElementById('updateCityForm');
    const updateCountrySelector = document.getElementById('updateCountrySelector');
    if (updateCityForm && updateCountrySelector) {
        updateCityForm.addEventListener('submit', handleUpdateCity);
        updateCountrySelector.addEventListener('change', populateCityOptions);
    }
}

function toggleForms() {
    var loginForm = document.getElementById('loginForm');
    var signUpForm = document.getElementById('signUpForm');
    if (loginForm.style.display === 'none') {
        signUpForm.style.display = 'none';
        loginForm.style.display = 'block';
    } else {
        loginForm.style.display = 'none';
        signUpForm.style.display = 'block';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.querySelector('.login-form input[type="text"]').value;
    const password = document.querySelector('.login-form input[type="password"]').value;
    const userRole = document.getElementById('userRole').value;

    if (username === 'admin' && password === '70235369' && userRole === 'admin') {
        window.location.href = 'adminPage.html';
    } else {
        const userData = JSON.parse(localStorage.getItem(username));
        if (userData && userData.password === password && userRole === userData.role) {
            window.location.href = 'userPage.html';
        } else {
            alert('Invalid credentials or not authorized.');
        }
    }
}

function handleSignUp(event) {
    event.preventDefault();
    const fullName = document.querySelector('.sign-up-form input[type="text"]').value;
    const email = document.querySelector('.sign-up-form input[type="email"]').value;
    const password = document.querySelector('.sign-up-form input[type="password"]').value;
    const confirmPassword = document.querySelectorAll('.sign-up-form input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
    } else {
        const userData = { fullName, email, password, role: "user" };
        localStorage.setItem(fullName, JSON.stringify(userData));
        alert("Sign up successful. You can now log in.");
        toggleForms(); 
    }
}

function handleAddCity(event) {
    event.preventDefault();
    const countrySelector = document.getElementById('countrySelector');
    const cityNameInput = document.querySelector('#addCityForm input[type="text"]');
    const descriptionTextArea = document.querySelector('#addCityForm textarea');
    const imageUrlInput = document.querySelector('#addCityForm input[type="text"]:last-of-type');

    if (!countrySelector.value || !cityNameInput.value || !descriptionTextArea.value || !imageUrlInput.value) {
        alert('All fields must be filled out');
        return;
    }

    addCity(countrySelector.value, cityNameInput.value, imageUrlInput.value);
    alert('City added successfully!');
    clearFormFields();
    populateCityOptions();
}

function handleDeleteCity(event) {
    event.preventDefault();
    const selectedCountry = document.getElementById('deleteCountrySelector').value;
    const selectedCityName = document.getElementById('deleteCitySelect').value;

    if (!selectedCityName) {
        alert('Please select a city to delete.');
        return;
    }

    removeCity(selectedCountry, selectedCityName);
    alert('City deleted successfully!');
    populateCityOptions();
}

function handleUpdateCity(event) {
    event.preventDefault();
    const selectedCountry = document.getElementById('updateCountrySelector').value;
    const selectedCityName = document.getElementById('updateCitySelect').value;
    const newName = document.querySelector('#updateCityForm input[type="text"]').value;
    const newImageUrl = document.querySelector('#updateCityForm input[type="text"]:last-of-type').value;

    if (!selectedCityName) {
        alert('Please select a city to update.');
        return;
    }

    updateCity(selectedCountry, selectedCityName, newName, newImageUrl);
    alert('City updated successfully!');
    populateCityOptions();
}

function clearFormFields() {
    document.querySelectorAll('input[type="text"], textarea').forEach(input => input.value = '');
}

function populateCityOptions() {
    let selectedCountryDelete = document.getElementById('deleteCountrySelector').value;
    let selectedCountryUpdate = document.getElementById('updateCountrySelector').value;
    let cities = JSON.parse(localStorage.getItem('cities')) || {};
    let deleteSelect = document.getElementById('deleteCitySelect');
    let updateSelect = document.getElementById('updateCitySelect');

    deleteSelect.innerHTML = '';
    updateSelect.innerHTML = '';

    if (cities[selectedCountryDelete]) {
        cities[selectedCountryDelete].forEach(city => {
            let option = new Option(city.name, city.name);
            deleteSelect.add(option.cloneNode(true));
        });
    }
    
    if (cities[selectedCountryUpdate]) {
        cities[selectedCountryUpdate].forEach(city => {
            let option = new Option(city.name, city.name);
            updateSelect.add(option);
        });
    }
}

function addCity(country, cityName, imageUrl) {
    const cities = JSON.parse(localStorage.getItem('cities')) || {};
    if (!cities[country]) {
        cities[country] = [];
    }
    cities[country].push({ name: cityName, image: imageUrl });
    localStorage.setItem('cities', JSON.stringify(cities));
}

function removeCity(country, cityName) {
    const cities = JSON.parse(localStorage.getItem('cities')) || {};
    if (cities[country]) {
        cities[country] = cities[country].filter(city => city.name !== cityName);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

function updateCity(country, oldCityName, newCityName, newImageUrl) {
    const cities = JSON.parse(localStorage.getItem('cities')) || {};
    if (cities[country]) {
        const cityIndex = cities[country].findIndex(city => city.name === oldCityName);
        if (cityIndex !== -1) {
            cities[country][cityIndex] = { name: newCityName, image: newImageUrl };
            localStorage.setItem('cities', JSON.stringify(cities));
        }
    }
}


function displayCityDetails(cityName) {
    var cities = JSON.parse(localStorage.getItem('cities')) || {};
    var selectedCountry = document.getElementById('countrySelect').value;
    var city = cities[selectedCountry].find(c => c.name === cityName);
    
    if (!city) return; // If no city found, exit function

    var detailsContainer = document.getElementById('city-details');
    detailsContainer.innerHTML = ''; // Clear previous details

    var descDiv = document.createElement('div');
    descDiv.className = 'city-description';
    descDiv.innerHTML = `<h3>${city.name}</h3><p>${city.description}</p>`;

    var carouselDiv = document.createElement('div');
    carouselDiv.className = 'city-carousel';
    carouselDiv.innerHTML = `<img src="${city.image}" alt="${city.name} Image" class="img-fluid">`; // Basic carousel for demo

    detailsContainer.appendChild(descDiv);
    detailsContainer.appendChild(carouselDiv);
    detailsContainer.style.display = 'block'; // Make sure the container is visible
}

// Bind click event to city blocks
function bindCityClicks() {
    var cityBlocks = document.querySelectorAll('.city-block');
    cityBlocks.forEach(block => {
        block.addEventListener('click', function() {
            var cityName = this.querySelector('.city-info strong').innerText;
            displayCityDetails(cityName);
        });
    });
}
