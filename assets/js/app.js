import {
	getArticles,
	onLoadArticles,
	getCategories,
	onLoadCategories,
	setupPostClickEventListeners,
	setupCategoryClickEventListeners,
	showHomepage
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

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
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
			console.log(categoriesList);
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
			setupPostClickEventListeners(postTitles);
		}
	});
});

if (backBtn !== null) {
	backBtn.addEventListener("click", () => {
		showHomepage(mainEl, loadingDiv, singleArticleSection, singleArticleMain);
	});
}
