/*
-list of allergies categories (fish, nuts)
	-sublist of specific allergy (squid, pecans)
	-image for each allergy group
		-sublist of languages for each specific language
		-image for each specific allergy
-button in corner to open menu to set:
	-user language
	-translated language
	-set allergies
		-covering div with bool switch for each category element

"languages": {
		"english": {
			"title": "English",
			"code": "english"
		},
		"spanish": {
			"title": "Español",
			"code": "spanish"
		},
		"chinese": {
			"title": "Zhōngwén",
			"code": "chinese"
		}
	}

1) milk (dairy)
-cow milk
-milk powder
-cheese
-butter
-margarine
-yogurt
-cream
-ice cream

2) eggs

3) tree nuts
-brazil nuts
-almonds
-cashews
-macadamia nuts
-pistachios
-pine nuts
-walnuts

4) peanuts

5) shellfish
-shrimp
-prawns
-crayfish
-lobster
-squid
-scallops

6) wheat

7) soy

8) fish

other potential categories:
https://www.healthline.com/nutrition/common-food-allergies#section10

test:
-category having no sub
-category has sub but it is empty
-category missing language name
-subitem missing language name
-no categories selected
*/

var main_greeting_element = document.getElementById("main_greeting_element");
var settings_button_element = document.getElementById("settings_button");
var settings_container_element = document.getElementById("settings_container");
var settings_greeting_element = document.getElementById("settings_greeting_element");
var user_language_dropdown_list_element = document.getElementById("user_language_dropdown_list");
var translated_language_dropdown_list_element = document.getElementById("translated_language_dropdown_list");
var user_language_image_element = document.getElementById("user_language_image");
var translated_language_image_element = document.getElementById("translated_language_image");
var available_allergies_element = document.getElementById("available_allergies_element");
var displayed_allergies_element = document.getElementById("displayed_allergies_element");

var all_settings_categories = [];

var user_language;
var translated_language;
var stored_categories = []; // only for cookies later

debugPrintStored = function() {
	console.log("---");
	for (let i=0; i < stored_categories.length; i++)
		console.log(stored_categories[i]);
	console.log("---");
}

// for checking if the category is in the stored list (cookies)
categoryIsStored = function(category_code) {
	var selected = false;
	for (let i=0; i < stored_categories.length; i++)
		if (stored_categories[i] == category_code) selected = true;
	return selected;
}

// true: now selected	| false: now deselected
// for toggling the stored list, more potential cookie stuff
toggleStoredCategory = function(category_code) {
	var index = -1;
	for (let i=0; i < stored_categories.length; i++)
		if (stored_categories[i] == category_code) index = i;;
	if (index != -1) {
		//console.log(category_code + " removed from list");
		stored_categories.splice(index, 1);
		debugPrintStored();
		return false;
	}
	else {
		//console.log(category_code + " added to list");
		stored_categories.push(category_code);
		debugPrintStored();
		return true;
	}
}

toggleSettingsScreen = function() {
	//console.log("before toggle:" + getComputedStyle(settings_container_element, null).visibility);
	if (getComputedStyle(settings_container_element, null).visibility == "hidden") {
		settings_container_element.style.visibility = "visible";
		//console.log("hidden->visible");
		//console.log(settings_container_element.style.visibility);
	}
	else {
		settings_container_element.style.visibility = "hidden";
		//console.log("visible->hidden");
		//console.log(settings_container_element.style.visibility);
	}
}

updateUserLanguage = function() {
	// update the instruction on the settings page
	let updated_lang = user_language_dropdown_list_element.value;
	settings_greeting_element.innerHTML = Text.settings_greeting[updated_lang];
	
	// update all categories title divs in settings page
	for (let i=0; i < all_settings_categories.length; i++)
		all_settings_categories[i].updateLanguage(updated_lang);
}

updateTranslatedLanguage = function() {
	// update the greeting on the translated page
	let updated_lang = translated_language_dropdown_list_element.value;
	main_greeting_element.innerHTML = Text.main_greeting[updated_lang];
	
	// update all categories title divs in the main page
	for (let i=0; i < all_settings_categories.length; i++)
		all_settings_categories[i].main_category.updateLanguage(updated_lang);
}

SettingsCategory = function(code, container, title_div, image, selector) {
	this.category_code = code;
	this.container = container;
	this.title = title_div;
	this.image = image;
	this.selector = selector;
	this.selected = false;
	this.main_category;		// relies on being set on construction of main_category
	
	this.updateLanguage = function(language_code) {
		if (Allergy[this.category_code].hasOwnProperty(language_code))
			this.title.innerHTML = Allergy[this.category_code][language_code];
		else this.title.innerHTML = "Missing " + language_code + " translation for " + this.category_code;
	}
	
	this.updateSelector = function(bool) {
		if (this.selected)
			this.selector.src = Image.category_selected;
		else this.selector.src = Image.category_deselected;
		
	}
	
	this.container.addEventListener("click", function() {
		this.selected = toggleStoredCategory(this.category_code);
		this.updateSelector(this.selected);
	}.bind(this));
	
	this.container.appendChild(this.title)
	if (this.image != null) this.container.appendChild(this.image);
	this.container.appendChild(this.selector);
	
	return this;
}

MainCategory = function(container, title_div, image, settings_category) {
	this.container = container;
	this.title = title_div;
	this.image = image;
	this.settings_category = settings_category;
	
	this.settings_category.main_category = this;
	
	this.updateLanguage = function(language_code) {
		if (Allergy[this.settings_category.category_code].hasOwnProperty(language_code))
			this.title.innerHTML = Allergy[this.settings_category.category_code][language_code];
		else this.title.innerHTML = "Missing " + language_code + " translation for " + this.settings_category.category_code;
	}
	
	this.container.appendChild(this.title)
	if (this.image != null) this.container.appendChild(this.image);
	
	return this;
}

//main_greeting_element.innerHTML = Text.main_greeting.english;
//settings_greeting_element.innerHTML = Text.settings_greeting.english;

/*****************************/

// temp, testing for cookies
//stored_categories.push("dairy");

// set the images for the language selection section
user_language_image_element.src = Image.user_language;
translated_language_image_element.src = Image.translated_language;

// set the listeners for the language selection and settings menu toggle
settings_button_element.addEventListener("click", toggleSettingsScreen);
user_language_dropdown_list_element.addEventListener("change", updateUserLanguage);
translated_language_dropdown_list_element.addEventListener("change", updateTranslatedLanguage);

// set the supported languages in the two dropdown boxes
for (let property in Text.languages) {
	if (!Text.languages.hasOwnProperty(property))
		continue;
	
	let next_title = Text.languages[property];
	let next_code = property;
	let next_option = document.createElement("option");
	//next_option.setAttribute("value", next_code);
	next_option.value = next_code;
	next_option.innerHTML = next_title;
	user_language_dropdown_list_element.appendChild(next_option.cloneNode(true));
	translated_language_dropdown_list_element.appendChild(next_option);
}

// set the list of possible allergy categories for settings page
let updated_lang = user_language_dropdown_list_element.value;
for (let property in Allergy) {
	if (!Allergy.hasOwnProperty(property))
		continue;
	
	// create the container div where all the category elements will go
	let next_div = document.createElement("div");
	next_div.className = "settings_allergy_category";
	
	// set up the area for the category names to be displayed in the user's language
	let title_div = document.createElement("div");
	title_div.className = "settings_allergy_category_title";
	
	// if theres an image for the category, set it
	let next_image = null;
	if (Allergy[property].hasOwnProperty("image")) {
		next_image = document.createElement("img");
		next_image.src = Allergy[property].image;
		next_image.className = "settings_allergy_category_image";
	}
	
	// set up area to show if the category is selected
	let next_selector_image = document.createElement("img");
	next_selector_image.className = "settings_allergy_category_selector";
	
	// tie em together in an object to make referencing easier within it, add to list
	let category = new SettingsCategory(property, next_div, title_div, next_image, next_selector_image);
	all_settings_categories.push(category);
	
	// update selector based on selected list (empty until cookies supported)
	if (categoryIsStored(property)) {
		//next_selector_image.src = Image.category_selected;
		category.selected = true;
		category.updateSelector(true);
	}
	else {
		category.selected = false;
		category.updateSelector(false);
	}
	
	available_allergies_element.appendChild(category.container);
}

// set up all selected categories on main page
for (let i=0; i < all_settings_categories.length; i++) {
	// create the container div where all the category elements will go
	let next_div = document.createElement("div");
	next_div.className = "main_allergy_category";
	
	// set up the area for the category names to be displayed in the translated language
	let title_div = document.createElement("div");
	title_div.className = "main_allergy_category_title";
	
	// if theres an image for the category, get it from settings_category
	let next_image = null;
	if (all_settings_categories[i].image != null) {
		next_image = document.createElement("img");
		next_image.src = all_settings_categories[i].image.src;
		next_image.className = "main_allergy_category_image";
	}
	
	// make an object and link it to the corresponding settings one
	let category = new MainCategory(next_div, title_div, next_image, all_settings_categories[i]);
	
	displayed_allergies_element.appendChild(category.container);
}

updateUserLanguage();
updateTranslatedLanguage();

