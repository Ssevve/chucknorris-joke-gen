import 'regenerator-runtime/runtime';

const domElements = {
	categoriesList: '.categories',
	categoriesToggleBtn: '.btn-toggle',
	btnRandom: '.btn--random',
	btnCategory: '.btn--category',
	searchForm: '.search',
	searchField: '.search__field',
	jokeList: '.jokes__list',
};

const jokeContainer = document.querySelector(domElements.jokeList);
const categoriesContainer = document.querySelector(domElements.categoriesList);
const searchField = document.querySelector(domElements.searchField);

async function getRandomJoke() {
	try {
		const res = await fetch('https://api.chucknorris.io/jokes/random');
		const jokeData = await res.json();
		return jokeData;
	} catch (error) {
		alert(
			'Something went wrong while getting a random joke. Please try again or come back later.'
		);
	}
}

async function getJokesWith(keyword) {
	try {
		const res = await fetch(
			`https://api.chucknorris.io/jokes/search?query=${keyword}`
		);
		const jokesData = await res.json();
		return jokesData.result;
	} catch (error) {
		alert(
			'Something went wrong while getting jokes. Please try again or come back later.'
		);
	}
}

async function getCategories() {
	try {
		const res = await fetch('https://api.chucknorris.io/jokes/categories');
		const categories = res.json();
		return categories;
	} catch (error) {
		console.log('There was a problem getting categories.');
	}
}

async function createCategoryButtons() {
	// Get list of categories
	const categories = await getCategories().then((arr) => arr);

	// Create a button for each category
	categories.forEach((category) => {
		const button = `
      <li>
        <button class="btn btn--category" data-category="${category}">${category}</button>
      </li>
    `;

		// Add button to the categories container
		categoriesContainer.insertAdjacentHTML('beforeend', button);
	});
}

async function getRandomFrom(category) {
	try {
		const res = await fetch(
			`https://api.chucknorris.io/jokes/random?category=${category}`
		);
		const joke = res.json();
		return joke;
	} catch (error) {
		alert(
			'Something went wrong while getting joke from the given category. Please try again or come back later.'
		);
	}
}

function renderJoke(jokeData) {
	const markup = `
    <li class="jokes__item">
      <p class="jokes__joke">
        ${formatText(jokeData.value)}
      </p>
    </li>
  `;

	jokeContainer.insertAdjacentHTML('beforeend', markup);
}

function renderLoader(parent) {
	const loader = `<div class="loader"></div>`;
	parent.insertAdjacentHTML('afterbegin', loader);
}

function clearLoader() {
	const loader = document.querySelector('.loader');
	loader.remove();
}

function clearJokes() {
	jokeContainer.innerHTML = '';
}

function clearSearchField() {
	searchField.value = '';
}

function formatText(text) {
	const letters = text.trim().split('');

	// Uppercase the first letter
	letters[0] = letters[0].toUpperCase();

	// Add a comma at the end if it is missing
	if (letters[letters.length - 1] !== '.') {
		letters.push('.');
	}

	return letters.join('');
}

// Setup event listeners

// Create category buttons and add them to the categories container
window.addEventListener('load', () => {
	clearSearchField();
	createCategoryButtons();
});

// Toggle categories
document
	.querySelector(domElements.categoriesToggleBtn)
	.addEventListener('click', () => {
		categoriesContainer.classList.toggle('hide');
	});

// Get random jokes from category
categoriesContainer.addEventListener('click', async (e) => {
	// Get clicked button
	const btn = e.target.closest(domElements.btnCategory);

	if (btn) {
		clearJokes();
		renderLoader(jokeContainer);

		// Get chosen category
		const category = btn.dataset.category;

		const joke = await getRandomFrom(category);
		clearLoader();
		renderJoke(joke);
	}
});

// Get jokes based on user's input
document
	.querySelector(domElements.searchForm)
	.addEventListener('submit', async (e) => {
		e.preventDefault();

		// Set focus to the search field if it was empty or no jokes were found
		searchField.focus();

		const input = searchField.value;

		if (input) {
			clearJokes();
			renderLoader(jokeContainer);

			// Get jokes
			const jokes = await getJokesWith(input);

			clearLoader();

			// Render jokes to the screen
			if (jokes && jokes.length > 0) {
				jokes.forEach((joke) => renderJoke(joke));
			} else {
				// No jokes found that match the given string
				renderJoke({ value: 'No jokes found.<br /> Try something different.' });
			}

			clearSearchField();
		}
	});

// Get a random joke
document
	.querySelector(domElements.btnRandom)
	.addEventListener('click', async () => {
		clearJokes();
		renderLoader(jokeContainer);

		const joke = await getRandomJoke();
		clearLoader();
		renderJoke(joke);
	});
