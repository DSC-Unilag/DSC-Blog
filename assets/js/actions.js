import {requestData, getDateDiff} from "./helpers.js";

const API_URL = "http://localhost:5000/dsc-blog-c97d3/us-central1/app";
const PROD_API_URL =
	"https://us-central1-dsc-blog-c97d3.cloudfunctions.net/app";

// API Actions
export const getArticles = async () => {
	try {
		const result = await requestData(`${API_URL}/articles`, "get");
		return result;
	} catch (error) {
		console.log("Error Msg: " + error.message);
		console.log(error.stack);
	}
};

export const getCategories = async () => {
	try {
		const result = await requestData(`${API_URL}/categories`, "get");
		return result;
	} catch (error) {
		console.log("Error Msg: " + error.message);
		console.log(error.stack);
	}
};

// DOM Actions
export const onLoadArticles = articlesSection => {
	articlesSection.innerHTML = `<div class="loader">Loading...</div>`;
	return articles => {
		articlesSection.innerHTML = "";
		if (articles.length > 0) {
			articles.forEach(article => {
				articlesSection.innerHTML += `<article class="article">
                <div class="article__img-wrapper">
                    <span class="article__img-tag article__img-tag--black">${
											article.category.name
										}</span>
                    <img src="${
											article.imageUrl
										}" alt="article" class="article__img">
                </div>
                <p class="article__title">
                    <a href="#">${article.title}</a>
                </p>
                <p class="article__details">
                    ${getDateDiff(article.created)} / by ${article.user
					.firstname +
					" " +
					article.user.lastname}
                </p>
                <p class="article__synopsis">
                    ${article.content}
                </p>
                <!-- <div class="article__metrics">
                    <div class="article__views">
                        <img src="./assets/images/options.svg" alt="options">
                        <div class="article__viewers">
                            <img src="./assets/images/viewer-1.png" alt="viewer">
                            <img src="./assets/images/viewer-2.png" alt="viewer" class="img-1">
                            <img src="./assets/images/viewer-3.png" alt="viewer" class="img-2">
                            <img src="./assets/images/viewer-4.png" alt="viewer" class="img-3">
                            <span>+20 more</span>
                        </div>
                    </div>
                    <div class="article__stats">
                        <div class="article__stat">
                            <img src="./assets/images/heart.svg" alt="heart">
                            <span>10</span>
                        </div>
                        <div class="article__stat">
                            <img src="./assets/images/chat.svg" alt="heart">
                            <span>10</span>
                        </div>
                    </div>
                </div> -->
            </article>`;
			});
			articlesSection.innerHTML += `<div class="article__page-links">
            <span class="article__page-link article__page-link--active">1</span>
            <span class="article__page-link">2</span>
            <span class="article__page-link">3</span>
            <span class="article__page-link">...</span>
            <a class="article__page-next-link">Next</a>
        </div>`;
		} else {
			articlesSection.innerHTML += `<p>No Articles Found</p>`;
		}
	};
};

export const onLoadCategories = (categoriesList, categories) => {
	if (categories.length > 0) {
		categories.forEach(category => {
			categoriesList.innerHTML += `<li class="categories__category">
            <span></span>
            ${category.name}
        </li>`;
		});
	}
};
