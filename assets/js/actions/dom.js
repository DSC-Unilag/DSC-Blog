import {
	getDateDiff,
	generateDate,
	sEnquire,
	chunkArray,
	sAlert
} from "../helpers.js";
import {
	getArticlesByCategory,
	getSingleArticle,
	getNewToken,
	reviewApplication,
	approveApplication,
	deleteApplication,
	deleteContributor,
	deleteArticle,
	publishArticle
} from "./api.js";

//DOM Objects
const archives = {
	articleHtml: article => {
		const loggedInUser = JSON.parse(localStorage.getItem("refresh")).uid;
		const ownedByUser = loggedInUser === article.user.uid;
		return `<article class="archive__card" data-aid=${article.aid}>
		<div class="archive__card-img">
			<img src="${article.imageUrl}" alt="Article Image" />
		</div>
		<div class="archive__card-details">
			<p>${article.title}</p>
			<p>Author: ${article.user.firstname + " " + article.user.lastname}</p>
		</div>
		<div class="archive__card-actions">
			<buttton class="btn actions__btn view_article">
				<i class="far fa-eye"></i> &nbsp; View
			</buttton>
			${
				ownedByUser
					? `<buttton class="btn actions__btn edit_article">
							<i class="far fa-edit"></i> &nbsp; Edit
					   </buttton>`
					: null
			}
			<buttton class="btn actions__btn delete_article">
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
			<buttton class="btn actions__btn publish_article">
				<i class="far fa-file-alt"></i> &nbsp; Publish
			</buttton>
			<buttton class="btn actions__btn view_article">
				<i class="far fa-eye"></i> &nbsp; View
			</buttton>
			<buttton class="btn actions__btn delete_article">
				<i class="far fa-trash-alt"></i> &nbsp; Delete
			</buttton>
		</div>
	</article>`;
	},
	contributorHtml: contributor => {
		return `<article class="archive__card" data-uid=${contributor.id}>
		<div class="archive__card-details contributor__details">
			<p>Name: ${contributor.firstname} ${contributor.lastname}</p>
			<p>Email: ${contributor.email}</p>
		</div>
		<div class="archive__card-actions">
			<buttton class="btn actions__btn delete_contributor">
				<i class="far fa-trash-alt"></i> &nbsp; Delete
			</buttton>
		</div>
	</article>`;
	},
	reveiwedApplicationHtml: application => {
		return `<article class="archive__card" data-aid="${application.id}">
		<div class="archive__card-details contributor__details">
			<p>Name: ${application.firstname} ${application.lastname}</p>
			<p>Email: ${application.email}</p>
			<p>
				Reason for Applying: ${application.reason}
			</p>
		</div>
		<div class="archive__card-actions">
			<buttton class="btn actions__btn approve_application">
				<i class="far fa-thumbs-up"></i> &nbsp; Approve
			</buttton>
			<buttton class="btn actions__btn delete_application">
				<i class="far fa-trash-alt"></i> &nbsp; Delete
			</buttton>
		</div>
	</article>`;
	},
	unreveiwedApplicationHtml: application => {
		return `<article class="archive__card" data-aid="${application.id}">
		<div class="archive__card-details contributor__details">
			<p>Name: ${application.firstname} ${application.lastname}</p>
			<p>Email: ${application.email}</p>
			<p>
				Reason for Applying: ${application.reason}
			</p>
		</div>
		<div class="archive__card-actions">
			<buttton class="btn actions__btn review_application">
				<i class="far fa-thumbs-up"></i> &nbsp; Review
			</buttton>
		</div>
	</article>`;
	}
};

export const setupPagination = (articles, currentPage) => {
	let htmlSpans = "";
	let i = 0;
	while (i < articles.length) {
		if (i === 0) {
			htmlSpans += `<span class="article__page-link ${
				currentPage === 1 ? "article__page-link--active" : ""
			}">
			<a href="/">${i + 1}</a>
			</span>`;
			i += 1;
			continue;
		}
		htmlSpans += `<span class="article__page-link ${
			currentPage === i + 1 ? "article__page-link--active" : ""
		}">
			<a href="/index.html?page=${i + 1}">${i + 1}</a>
		</span>`;
		i += 1;
	}
	const urlParams = new URLSearchParams(window.location.search);
	return `<div class="article__page-links">
            ${htmlSpans}
            <a class="article__page-next-link" href="${
							urlParams.get("page") ? urlParams.get("page") + 1 : 2
						}">Next</a>
        </div>`;
};

// DOM Actions
export const onLoadArticles = articlesSection => {
	articlesSection.innerHTML = `<div class="loader">Loading...</div>`;
	return (articles, topPosts = null, recentPosts = null) => {
		const reveresedArticles = chunkArray(articles.reverse(), 4);
		articlesSection.innerHTML = "";
		if (reveresedArticles.length > 0) {
			reveresedArticles[0].forEach(article => {
				articlesSection.innerHTML += `<article class="article">
					<div class="article__img-wrapper">
						<span class="article__img-tag article__img-tag--black">${
							article.category.name
						}</span>
						<img src="${article.imageUrl}" alt="article" class="article__img">
					</div>
					<p class="article__title tool" data-aid=${
						article.aid
					} data-tip="Read Full Article">
						<a href="javascript:;">${article.title}</a>
					</p>
					<p class="article__details">
						${getDateDiff(article.created)} / by ${article.user.firstname +
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
				if (recentPosts) {
					recentPosts.innerHTML += `<div class="post" data-aid=${article.aid}>
					<img src="${article.imageUrl}" alt="article image" />
					<p class="post__time">${getDateDiff(article.created)}</p>
					<p class="post__title">${article.title}</p>
				</div>`;
				}
			});
			articlesSection.innerHTML += setupPagination(reveresedArticles, 1);
			if (topPosts) {
				topPosts.innerHTML = `<div class="top-post">
            <div class="overlay"></div>
            <img src="./assets/images/camp-2-min.png" alt="Post Image" class="top-post__img">
            <p class="top-post__tag">
                <img src="./assets/images/play.svg" alt="play">
                Latest Post
            </p>
            <p class="top-post__title">
                ${reveresedArticles[0][0].title}
            </p>
            <p class="top-post__content">
                ${reveresedArticles[0][0].content.substring(0, 100) + "..."}
            </p>
            <div class="top-post__row">
                <a href="#" class="top-post__link" data-aid=${
									reveresedArticles[0][0].aid
								}>
                    KEEP READING
                </a>
                <div class="top-post__author-details">
                    <p class="top-post__author">
                    ${reveresedArticles[0][0].user.firstname +
											" " +
											reveresedArticles[0][0].user.lastname}
                    </p>
                    <p class="top-post__author-role">
                        ${reveresedArticles[0][0].user.role[0].toUpperCase() +
													reveresedArticles[0][0].user.role.slice(1)}
                    </p>
                </div>
            </div>
		</div>`;
			}
			return reveresedArticles;
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

export const handleReviewApplication = (e, loadingDiv, onSuccess) => {
	loadingDiv.classList.remove("hide");
	let {aid} = e.target.closest("[data-aid]").dataset;
	reviewApplication(aid)
		.then(success => {
			if (success) {
				onSuccess();
			}
		})
		.finally(() => {
			loadingDiv.classList.add("hide");
		});
};

export const handleApproveApplication = (e, loadingDiv) => {
	loadingDiv.classList.remove("hide");
	let {aid} = e.target.closest("[data-aid]").dataset;
	approveApplication(aid)
		.then(success => {
			if (success) {
				e.target.closest(".archive__card").remove();
			}
		})
		.finally(() => {
			loadingDiv.classList.add("hide");
		});
};

export const handleDeleteApplication = (e, loadingDiv) => {
	loadingDiv.classList.remove("hide");
	let {aid} = e.target.closest("[data-aid]").dataset;
	deleteApplication(aid)
		.then(success => {
			if (success) {
				e.target.closest(".archive__card").remove();
			}
		})
		.finally(() => {
			loadingDiv.classList.add("hide");
		});
};

export const handleDeleteContributor = (e, loadingDiv) => {
	loadingDiv.classList.remove("hide");
	let {uid} = e.target.closest("[data-uid]").dataset;
	deleteContributor(uid)
		.then(success => {
			if (success) {
				e.target.closest(".archive__card").remove();
			}
		})
		.finally(() => {
			loadingDiv.classList.add("hide");
		});
};

export const handlePublishArticle = (e, loadingDiv, onSuccess) => {
	loadingDiv.classList.remove("hide");
	let {aid} = e.target.closest("[data-aid]").dataset;
	publishArticle(aid)
		.then(success => {
			if (success) {
				onSuccess();
			}
		})
		.finally(() => {
			loadingDiv.classList.add("hide");
		});
};

export const handleDeleteArticle = (e, loadingDiv) => {
	loadingDiv.classList.remove("hide");
	let {aid} = e.target.closest("[data-aid]").dataset;
	deleteArticle(aid)
		.then(success => {
			if (success) {
				e.target.closest(".archive__card").remove();
			}
		})
		.finally(() => {
			loadingDiv.classList.add("hide");
		});
};

export const onLoadCategoryArticles = (e, loadArticles, loadingDiv) => {
	let {cid} = e.target.closest("[data-cid]").dataset;
	sAlert({
		title: "Loading Articles",
		message: "Please Wait",
		type: "info"
	});
	getArticlesByCategory(cid).then(result => {
		document
			.querySelector(".categories__category--active")
			.classList.remove("categories__category--active");
		e.target.classList.add("categories__category--active");
		loadArticles(result.data);
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
	publishedArchive += "<h3>All published articles</h3>";
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
	unpublishedArchive += "<h3>All unpublished articles</h3>";
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

export const onLoadDashboardContributors = (contributors, dashboardMainEl) => {
	dashboardMainEl.innerHTML = "";
	// Add Published Articles Section
	let contributorArchive = `<section class="archive">`;
	contributorArchive += "<h3>All Contributors</h3>";
	if (contributors.length > 0) {
		contributors.forEach(contributor => {
			contributorArchive += archives.contributorHtml(contributor);
		});
	} else {
		contributorArchive += `<p class="empty">No Contributor</p>`;
	}
	contributorArchive += `</section>`;
	dashboardMainEl.innerHTML += contributorArchive;
};

export const onLoadDashboardApplications = (
	reviewedApplications,
	unreviewedApplications,
	dashboardMainEl
) => {
	dashboardMainEl.innerHTML = "";
	// Add Reviewed Application Section
	let reviewedArchive = `<section class="archive">`;
	reviewedArchive += "<h3>All reviewed applications</h3>";
	if (reviewedApplications.length > 0) {
		reviewedApplications.forEach(application => {
			reviewedArchive += archives.reveiwedApplicationHtml(application);
		});
	} else {
		reviewedArchive += `<p class="empty">No Reviewed Application</p>`;
	}
	reviewedArchive += `</section>`;
	dashboardMainEl.innerHTML += reviewedArchive;
	// Add Unreviewed Application Section
	let unreviewedArchive = `<section class="archive">`;
	unreviewedArchive += "<h3>All unreviewed applications</h3>";
	if (unreviewedApplications.length > 0) {
		unreviewedApplications.forEach(application => {
			unreviewedArchive += archives.unreveiwedApplicationHtml(application);
		});
	} else {
		unreviewedArchive += `<p class="empty">No Unreviewed Application</p>`;
	}
	unreviewedArchive += `</section>`;
	dashboardMainEl.innerHTML += unreviewedArchive;
};

//Dynamic EventListeners Setups
export const setupCategoryClickEventListeners = (
	categoriesList,
	loadArticles,
	loadingDiv
) => {
	categoriesList.forEach(category => {
		category.addEventListener("click", e => {
			onLoadCategoryArticles(e, loadArticles, loadingDiv);
		});
	});
};

export const setupPostClickEventListeners = (
	mainEl,
	loadingDiv,
	singleArticleSection,
	singleArticleMain,
	postTitles,
	recentPostsTitles
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
	recentPostsTitles.forEach(recentPostTitle => {
		recentPostTitle.addEventListener("click", e => {
			showSingleArticle(
				e,
				mainEl,
				loadingDiv,
				singleArticleSection,
				singleArticleMain
			);
		});
	});
};

export const setupApplicationActions = (
	loadingDiv,
	reviewBtns,
	approveBtns,
	deleteBtns,
	applicationLink
) => {
	if (reviewBtns.length > 0) {
		reviewBtns.forEach(reviewBtn => {
			reviewBtn.addEventListener("click", e => {
				sEnquire("Are you sure you want to review application?", () =>
					handleReviewApplication(e, loadingDiv, () => {
						applicationLink.click();
					})
				);
			});
		});
	}
	if (approveBtns.length > 0) {
		approveBtns.forEach(approveBtn => {
			approveBtn.addEventListener("click", e => {
				sEnquire("Are you sure you want to approve application?", () =>
					handleApproveApplication(e, loadingDiv)
				);
			});
		});
	}
	if (deleteBtns.length > 0) {
		deleteBtns.forEach(deleteBtn => {
			deleteBtn.addEventListener("click", e => {
				sEnquire("Are you sure you want to delete the application?", () =>
					handleDeleteApplication(e, loadingDiv)
				);
			});
		});
	}
};

export const setupContributorActions = (loadingDiv, deleteConBtns) => {
	if (deleteConBtns.length > 0) {
		deleteConBtns.forEach(deleteBtn => {
			deleteBtn.addEventListener("click", e => {
				sEnquire("Are you sure you want to delete the contributor?", () =>
					handleDeleteContributor(e, loadingDiv)
				);
			});
		});
	}
};

export const setupArticlesActions = (
	loadingDiv,
	publishBtns,
	deleteBtns,
	viewBtns,
	editBtns,
	articlesLink,
	{dashboardMainEl, singleArticleMain, singleArticleSection}
) => {
	if (publishBtns.length > 0) {
		publishBtns.forEach(publishBtn => {
			publishBtn.addEventListener("click", e => {
				sEnquire("Are you sure you want to publish article?", () =>
					handlePublishArticle(e, loadingDiv, () => {
						articlesLink.click();
					})
				);
			});
		});
	}
	if (deleteBtns.length > 0) {
		deleteBtns.forEach(deleteBtn => {
			deleteBtn.addEventListener("click", e => {
				sEnquire("Are you sure you want to delete the article?", () =>
					handleDeleteArticle(e, loadingDiv)
				);
			});
		});
	}
	if (viewBtns.length > 0) {
		viewBtns.forEach(viewBtn => {
			viewBtn.addEventListener("click", e => {
				showSingleArticle(
					e,
					dashboardMainEl,
					loadingDiv,
					singleArticleSection,
					singleArticleMain
				);
			});
		});
	}
	if (editBtns.length > 0) {
		editBtns.forEach(editBtn => {
			editBtn.addEventListener("click", e => {
				let {aid} = e.target.closest("[data-aid]").dataset;
				window.location.href = `/post_article.html?edit=${aid}`;
			});
		});
	}
};

//Custom
export const isLoggedIn = () => {
	return (
		localStorage.getItem("token") &&
		localStorage.getItem("exp") > new Date().getTime()
	);
};

export const refreshAuthState = () => {
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
		return false;
	}
};

export const logout = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("refresh");
	localStorage.removeItem("exp");
	window.location.href = "/";
};
