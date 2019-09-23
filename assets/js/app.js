import {
	getArticles,
	onLoadArticles,
	getCategories,
	onLoadCategories,
	setupPostClickEventListeners,
	setupCategoryClickEventListeners,
	showHomepage,
	postSignIn,
	checkAuthState
} from "./actions.js";

//DOM Elements
const articlesSection = document.querySelector(".articles");
const categoryList = document.querySelector(".categories__list");
const loadingDiv = document.querySelector(".loading");
const topPost = document.querySelector(".top-posts");
const mainEl = document.querySelector("main");
const singleArticleSection = document.querySelector(".single__article-page");
const singleArticleMain = document.querySelector(".single__article-main");
const backBtn = document.querySelector(".single__article-main > .btn");
const signInForm = document.getElementById("signInForm");

//Event Callbacks
const loadHomepageElements = () => {
	Promise.all([getCategories(), getArticles()]).then(result => {
		const [categoryResult, articlesResult] = result;
		onLoadCategories(categoryList, categoryResult.data);
		const loadArticles = onLoadArticles(articlesSection);
		if (categoryList.childElementCount > 1) {
			const categoriesList = Array.from(categoryList.childNodes).filter(
				childNode => {
					return childNode.className === "categories__category";
				}
			);
			setupCategoryClickEventListeners(
				categoriesList,
				loadArticles,
				topPost,
				loadingDiv
			);
		}
		loadArticles(articlesResult.data, topPost);
		loadingDiv.classList.add("hide");
		const postTitles = document.querySelectorAll("p.article__title.tool > a");
		if (postTitles !== null) {
			setupPostClickEventListeners(
				mainEl,
				loadingDiv,
				singleArticleSection,
				singleArticleMain,
				postTitles
			);
		}
	});
};

const loadDashboard = () => {};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
	if (
		window.location.pathname.includes("index") ||
		window.location.pathname === "/"
	) {
		loadHomepageElements();
	}

	if (
		window.location.pathname.includes("dashboard") ||
		window.location.pathname.includes("create_account")
	) {
		checkAuthState();
	}
});

if (backBtn !== null) {
	backBtn.addEventListener("click", () => {
		showHomepage(mainEl, loadingDiv, singleArticleSection, singleArticleMain);
	});
}

if (signInForm !== null) {
	signInForm.addEventListener("submit", postSignIn);
}
