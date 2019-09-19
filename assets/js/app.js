import {
	getArticles,
	onLoadArticles,
	getCategories,
	onLoadCategories,
	showSingleArticle
} from "./actions.js";

//DOM Elements
const articlesSection = document.querySelector(".articles");
const categoryList = document.querySelector(".categories__list");
const loadingDiv = document.querySelector(".loading");
const topPost = document.querySelector(".top-posts");
const mainEl = document.querySelector("main");
const singleArticleSection = document.querySelector(".single__article-page");
const singleArticleMain = document.querySelector(".single__article-main");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
	Promise.all([getCategories(), getArticles()]).then(result => {
		const [categoryResult, articlesResult] = result;
		onLoadCategories(categoryList, categoryResult.data);
		const loadArticles = onLoadArticles(articlesSection);
		loadArticles(articlesResult.data, topPost);
		loadingDiv.classList.add("hide");
		const postTitles = document.querySelectorAll("p.article__title.tool > a");
		if (postTitles !== null) {
			postTitles.forEach(postTitle => {
				postTitle.addEventListener("click", e =>
					showSingleArticle(
						e,
						mainEl,
						loadingDiv,
						singleArticleSection,
						singleArticleMain
					)
				);
			});
		}
	});
});
