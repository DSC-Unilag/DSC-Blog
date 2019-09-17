import "@babel/polyfill";
import {
	getArticles,
	onLoadArticles,
	getCategories,
	onLoadCategories
} from "./actions.js";

//DOM Elements
const articlesSection = document.querySelector(".articles");
const categoryList = document.querySelector(".categories__list");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
	getCategories().then(result => {
		onLoadCategories(categoryList, result.data);
	});
	const loadArticles = onLoadArticles(articlesSection);
	getArticles().then(result => {
		loadArticles(result.data);
	});
});
