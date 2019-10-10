import {sAlert} from "./helpers.js";
import {
	getArticles,
	getUnpublishedArticles,
	getCategories,
	postSignIn,
	postApply,
	getContributors,
	getReviewedApplications,
	getUnreviewedApplications,
	postArticle,
	getSingleArticle,
	editArticle
} from "./actions/api.js";
import {
	onLoadDashboardArticles,
	onLoadDashboardContributors,
	onLoadDashboardApplications,
	onLoadArticles,
	onLoadCategories,
	setupPostClickEventListeners,
	setupCategoryClickEventListeners,
	setupApplicationActions,
	showHomepage,
	checkAuthState,
	setupContributorActions,
	setupArticlesActions
} from "./actions/dom.js";

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
const applicationForm = document.getElementById("applicationForm");
const dashboardMainEl = document.querySelector(".dashboard__main");
const articlesLinks = document.querySelectorAll(".articlesLink");
const contributorsLinks = document.querySelectorAll(".contributorsLink");
const applicationsLinks = document.querySelectorAll(".applicantsLink");
const navbarAuthLinks = document.querySelector(".navbar__registration-links");
const mobileAuthLinks = document.querySelector(".sidenav-reg__links");
const postArticleForm = document.getElementById("postArticleForm");
const formContainer = document.getElementById("formContainer");
const editArticleForm = document.getElementById("editArticleForm");
const editImageContainer = document.querySelector(".edit_image");
const showEditImageInput = document.querySelector(".edit_image > .btn");

//Events
const updateDomEvent = new Event("updateDOM");

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

const loadDashboardArticles = callback => {
	dashboardMainEl.innerHTML = '<div class="loader">Loading...</div>';
	Promise.all([getArticles(), getUnpublishedArticles()]).then(result => {
		let [published, unpublished] = result;
		published = published.data || [];
		unpublished = unpublished.data || [];
		onLoadDashboardArticles(published, unpublished, dashboardMainEl);
		callback();
	});
};

const loadDashboardContributors = callback => {
	dashboardMainEl.innerHTML = '<div class="loader">Loading...</div>';
	getContributors().then(result => {
		onLoadDashboardContributors(result.data, dashboardMainEl);
		callback();
	});
};

const loadDashboardApplications = callback => {
	dashboardMainEl.innerHTML = '<div class="loader">Loading...</div>';
	Promise.all([getReviewedApplications(), getUnreviewedApplications()]).then(
		result => {
			let [reviewed, unreviewed] = result;
			reviewed = reviewed.data || [];
			unreviewed = unreviewed.data || [];
			onLoadDashboardApplications(reviewed, unreviewed, dashboardMainEl);
			callback();
		}
	);
};

const loadEditArticle = (
	aid,
	formContainer,
	editImageContainer,
	sAlert,
	loadingDiv,
	postArticle,
	editArticle
) => {
	loadingDiv.classList.remove("hide");
	getSingleArticle(aid)
		.then(result => {
			const {data: article} = result;
			const legend = formContainer.querySelector("legend");
			const form = formContainer.querySelector("form");
			const formTitle = formContainer.querySelector("input[name=title]");
			const formCategoryId = formContainer.querySelector(
				"select[name=categoryId]"
			);
			const formFile = formContainer.querySelector("input[type=file]");
			const formContent = formContainer.querySelector("input[name=content]");
			const editImage = editImageContainer.querySelector("img");
			legend.textContent = "Edit Aticle";
			form.id = "editArticleForm";
			formTitle.value = article.title;
			formCategoryId.value = article.category.cid;
			formContent.value = article.content;
			formFile.classList.add("hide");
			formFile.removeAttribute("required");
			editImage.setAttribute("src", article.imageUrl);
			editImageContainer.classList.remove("hide");
			loadingDiv.classList.add("hide");
			form.removeEventListener("submit", postArticle);
			form.addEventListener("submit", e => {
				const urlParams = new URLSearchParams(window.location.search);
				const aid = urlParams.get("edit");
				editArticle(e, aid);
			});
			document.dispatchEvent(updateDomEvent);
		})
		.catch(err => {
			sAlert({
				title: "Something went wrong",
				message: err.message,
				type: "error"
			});
			console.log(err.stack);
		});
};

const resetNavbarLinks = navLink => {
	let activeLink = navLink.parentElement.querySelector(".navbar__link--active");
	if (activeLink !== null) {
		activeLink.classList.remove("navbar__link--active");
	}
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
	if (
		window.location.pathname.includes("index") ||
		window.location.pathname === "/"
	) {
		if (checkAuthState()) {
			navbarAuthLinks.innerHTML = `<a href="#" class="btn navbar__registration-link">
					LOGOUT
				</a>`;
			mobileAuthLinks.innerHTML = `
			<button class="sidenav-reg__link">
				LOGOUT
			</button>`;
		} else {
			navbarAuthLinks.innerHTML = `<a href="./sign_in.html" class="btn navbar__registration-link">
					SIGN IN
				</a>
				<a href="./contributor_form.html" class="btn navbar__registration-link">
					SIGN UP
				</a>`;
			mobileAuthLinks.innerHTML = `<button class="sidenav-reg__link">
			SIGN IN
		</button>
		<button class="sidenav-reg__link">
			SIGN UP
		</button>`;
		}
		loadHomepageElements();
	}

	if (
		window.location.pathname.includes("dashboard") ||
		window.location.pathname.includes("create_account") ||
		window.location.pathname.includes("post_article")
	) {
		if (!checkAuthState()) {
			window.location.href = "/sign_in.html";
		}
	}

	if (window.location.pathname.includes("dashboard")) {
		articlesLinks.forEach(articlesLink => {
			articlesLink.click();
		});
	}

	if (window.location.pathname.includes("post_article")) {
		loadingDiv.classList.remove("hide");
		const categorySelect = document.querySelector("select.form_field");
		getCategories().then(result => {
			if (result.data.length > 0) {
				result.data.forEach(category => {
					categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
				});
				loadingDiv.classList.add("hide");
				if (window.location.search.includes("edit")) {
					const urlParams = new URLSearchParams(window.location.search);
					const aid = urlParams.get("edit");
					loadEditArticle(
						aid,
						formContainer,
						editImageContainer,
						sAlert,
						loadingDiv,
						postArticle,
						editArticle
					);
				}
			}
		});
	}
});

if (backBtn !== null) {
	backBtn.addEventListener("click", () => {
		let main = mainEl;
		if (dashboardMainEl !== null) {
			main = dashboardMainEl;
		}
		showHomepage(main, loadingDiv, singleArticleSection, singleArticleMain);
	});
}

if (signInForm !== null) {
	signInForm.addEventListener("submit", postSignIn);
}

if (applicationForm !== null) {
	applicationForm.addEventListener("submit", postApply);
}

if (articlesLinks !== null) {
	articlesLinks.forEach(articlesLink => {
		articlesLink.addEventListener("click", () => {
			loadDashboardArticles(() => {
				const publishBtns = dashboardMainEl.querySelectorAll(
					".publish_article"
				);
				const viewBtns = dashboardMainEl.querySelectorAll(".view_article");
				const deleteBtns = dashboardMainEl.querySelectorAll(".delete_article");
				const editBtns = dashboardMainEl.querySelectorAll(".edit_article");
				setupArticlesActions(
					loadingDiv,
					publishBtns,
					deleteBtns,
					viewBtns,
					editBtns,
					articlesLink,
					{dashboardMainEl, singleArticleMain, singleArticleSection}
				);
			});
			resetNavbarLinks(articlesLink);
			articlesLink.classList.add("navbar__link--active");
		});
	});
}

if (contributorsLinks !== null) {
	contributorsLinks.forEach(contributorsLink => {
		contributorsLink.addEventListener("click", () => {
			loadDashboardContributors(() => {
				const deleteConBtns = dashboardMainEl.querySelectorAll(
					".delete_contributor"
				);
				setupContributorActions(loadingDiv, deleteConBtns);
			});
			resetNavbarLinks(contributorsLink);
			contributorsLink.classList.add("navbar__link--active");
		});
	});
}
if (applicationsLinks !== null) {
	applicationsLinks.forEach(applicationsLink => {
		applicationsLink.addEventListener("click", () => {
			loadDashboardApplications(() => {
				const reviewBtns = dashboardMainEl.querySelectorAll(
					".review_application"
				);
				const approveBtns = dashboardMainEl.querySelectorAll(
					".approve_application"
				);
				const deleteBtns = dashboardMainEl.querySelectorAll(
					".delete_application"
				);
				setupApplicationActions(
					loadingDiv,
					reviewBtns,
					approveBtns,
					deleteBtns,
					applicationsLink
				);
			});
			resetNavbarLinks(applicationsLink);
			applicationsLink.classList.add("navbar__link--active");
		});
	});
}

if (postArticleForm !== null) {
	postArticleForm.addEventListener("submit", postArticle);
}

if (showEditImageInput !== null) {
	showEditImageInput.addEventListener("click", e => {
		const formFile = formContainer.querySelector("input[type=file]");
		editImageContainer.classList.add("hide");
		formFile.setAttribute("required", "true");
		formFile.classList.remove("hide");
	});
}
