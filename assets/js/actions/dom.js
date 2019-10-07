import {getDateDiff, generateDate} from "../helpers.js";
import {
	getArticlesByCategory,
	getSingleArticle,
	getNewToken,
	getArticles,
	getUnpublishedArticles
} from "./api.js";

//DOM Objects
const archives = {
	articleHtml: article => {
		return `<article class="archive__card" data-aid=${article.aid}>
		<div class="archive__card-img">
			<img src="${article.imageUrl}" alt="Article Image" />
		</div>
		<div class="archive__card-details">
			<p>${article.title}</p>
			<p>Author: ${article.user.firstname + " " + article.user.lastname}</p>
		</div>
		<div class="archive__card-actions">
			<buttton class="btn actions__btn">
				<i class="far fa-eye"></i> &nbsp; View
			</buttton>
			<buttton class="btn actions__btn">
				<i class="far fa-edit"></i> &nbsp; Edit
			</buttton>
			<buttton class="btn actions__btn">
				<i class="far fa-trash-alt"></i> &nbsp; Delete
			</buttton>
		</div>
	</article>`;
	},
	unpublishedArticleHtml: article => {
		return `<article class="archive__card" data-aid=${article.aid}>
		<div class="archive__card-img">
			<img src="${article.imageUrl}" alt="Article Image" />
		</div>
		<div class="archive__card-details">
			<p>${article.title}</p>
			<p>Author: ${article.user.firstname + " " + article.user.lastname}</p>
		</div>
		<div class="archive__card-actions">
			<buttton class="btn actions__btn">
				<i class="far fa-eye"></i> &nbsp; View
			</buttton>
			<buttton class="btn actions__btn">
				<i class="far fa-file-alt"></i> &nbsp; Publish
			</buttton>
		</div>
	</article>`;
	},
	contributorHtml: contributor => {
		return `<article class="archive__card" data-uid=${contributor.cid}>
		<div class="archive__card-details contributor__details">
			<p>Name: Timilehin Olumofin</p>
			<p>Email: timilehin.olumofin@gmail.com</p>
			<p>No of Articles: 1</p>
		</div>
		<div class="archive__card-actions">
			<buttton class="btn actions__btn">
				<i class="far fa-trash-alt"></i> &nbsp; Delete
			</buttton>
		</div>
	</article>`;
	},
	applicationHtml: application => {
		return `<article class="archive__card" data-aid="${application.id}">
		<div class="archive__card-details contributor__details">
			<p>Name: ${application.firstname} ${application.lastname}</p>
			<p>Email: ${application.email}</p>
			<p>
				Reason for Applying: ${application.reason}
			</p>
		</div>
		<div class="archive__card-actions">
			<buttton class="btn actions__btn">
				<i class="far fa-thumbs-up"></i> &nbsp; Approve
			</buttton>
			<buttton class="btn actions__btn">
				<i class="far fa-trash-alt"></i> &nbsp; Delete
			</buttton>
		</div>
	</article>`;
	}
};

// DOM Actions
export const onLoadArticles = articlesSection => {
	articlesSection.innerHTML = `<div class="loader">Loading...</div>`;
	return (articles, topPosts) => {
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
                <p class="article__title tool" data-aid=${
									article.aid
								} data-tip="Read Full Article">
                    <a href="javascript:;">${article.title}</a>
                </p>
                <p class="article__details">
                    ${getDateDiff(article.created)} / by ${article.user
					.firstname +
					" " +
					article.user.lastname}
                </p>
                <p class="article__synopsis">
                    ${article.content.substring(0, 100) + "..."}
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
			topPosts.innerHTML = `<div class="top-post">
            <div class="overlay"></div>
            <img src="./assets/images/camp-2-min.png" alt="Post Image" class="top-post__img">
            <p class="top-post__tag">
                <img src="./assets/images/play.svg" alt="play">
                Latest Post
            </p>
            <p class="top-post__title">
                ${articles[0].title}
            </p>
            <p class="top-post__content">
                ${articles[0].content.substring(0, 100) + "..."}
            </p>
            <div class="top-post__row">
                <a href="#" class="top-post__link" data-aid=${articles[0].aid}>
                    KEEP READING
                </a>
                <div class="top-post__author-details">
                    <p class="top-post__author">
                    ${articles[0].user.firstname +
											" " +
											articles[0].user.lastname}
                    </p>
                    <p class="top-post__author-role">
                        ${articles[0].user.role[0].toUpperCase() +
													articles[0].user.role.slice(1)}
                    </p>
                </div>
            </div>
        </div>`;
		} else {
			articlesSection.innerHTML += `<p>No Articles Found</p>`;
		}
	};
};

export const onLoadCategories = (categoriesList, categories) => {
	if (categories.length > 0) {
		categories.forEach(category => {
			categoriesList.innerHTML += `<li class="categories__category" data-cid=${category.id}>
            <span></span>
            ${category.name}
        </li>`;
		});
	}
};

export const showSingleArticle = (
	e,
	mainEl,
	loadingDiv,
	singleArticleSection,
	singleArticleMain
) => {
	loadingDiv.classList.remove("hide");
	mainEl.classList.add("hidden");
	let {aid} = e.target.closest("[data-aid]").dataset;
	getSingleArticle(aid).then(result => {
		const {data} = result;
		singleArticleSection.innerHTML += `<article class="single__article">
        <p class="single__article-title">${data.title}</p>
        <p class="single__article-author">
            By ${data.user.firstname +
							" " +
							data.user.lastname} <span>${generateDate(data.created)}</span>
        </p>
        <div class="single__article-img">
            <img src="${data.imageUrl}" alt="Article Image" />
        </div>
        <br />
        <p class="single__article-content">
            ${data.content}
        </p>
    </article>`;
		loadingDiv.classList.add("hide");
		singleArticleMain.classList.add("visible");
	});
};

export const showHomepage = (
	mainEl,
	loadingDiv,
	singleArticleSection,
	singleArticleMain
) => {
	loadingDiv.classList.remove("hide");
	singleArticleSection.innerHTML = "";
	singleArticleMain.classList.remove("visible");
	loadingDiv.classList.add("hide");
	mainEl.classList.remove("hidden");
};

export const onLoadCategoryArticles = (
	e,
	loadArticles,
	loadingDiv,
	topPost
) => {
	let {cid} = e.target.closest("[data-cid]").dataset;
	getArticlesByCategory(cid).then(result => {
		loadArticles(result.data, topPost);
		loadingDiv.classList.add("hide");
	});
};

export const onLoadDashboardArticles = (
	publishedArticles,
	unpublishedArticles,
	dashboardMainEl
) => {
	dashboardMainEl.innerHTML = "";
	// Add Published Articles Section
	let publishedArchive = `<section class="archive">`;
	publishedArchive += '<h3>All published articles</h3>';
	if (publishedArticles.length > 0) {
		publishedArticles.forEach(article => {
			publishedArchive += archives.articleHtml(article);
		});
	} else {
		publishedArchive += `<p class="empty">No Published Article</p>`;
	}
	publishedArchive += `</section>`;
	dashboardMainEl.innerHTML += publishedArchive;
	// Add Unpublished Articles Section
	let unpublishedArchive = `<section class="archive">`;
	unpublishedArchive += '<h3>All unpublished articles</h3>';
	if (unpublishedArticles.length > 0) {
		unpublishedArticles.forEach(article => {
			unpublishedArchive += archives.unpublishedArticleHtml(article);
		});
	} else {
		unpublishedArchive += `<p class="empty">No Unpublished Article</p>`;
	}
	unpublishedArchive += `</section>`;
	dashboardMainEl.innerHTML += unpublishedArchive;
};

//Dynamic EventListeners Setups
export const setupCategoryClickEventListeners = (
	categoriesList,
	loadArticles,
	topPost,
	loadingDiv
) => {
	categoriesList.forEach(category => {
		category.addEventListener("click", e => {
			onLoadCategoryArticles(e, loadArticles, loadingDiv, topPost);
		});
	});
};

export const setupPostClickEventListeners = (
	mainEl,
	loadingDiv,
	singleArticleSection,
	singleArticleMain,
	postTitles
) => {
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
};

//Custom
export const checkAuthState = () => {
	if (
		localStorage.getItem("token") &&
		localStorage.getItem("exp") > new Date().getTime()
	) {
		return true;
	}
	const tokenData = localStorage.getItem("refresh");
	if (tokenData !== null) {
		getNewToken(tokenData).then(res => {
			if (res.token) {
				const expTime = new Date().getTime() + 86400 * 1000;
				localStorage.setItem("token", res.token);
				localStorage.setItem("exp", expTime);
				localStorage.setItem(
					"refresh",
					JSON.stringify({refreshToken: res.refreshToken, uid: res.uid})
				);
				return true;
			}
		});
	} else {
		window.location.href = "/sign_in.html";
	}
};
