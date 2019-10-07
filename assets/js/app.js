import {
	getArticles,
	getUnpublishedArticles,
	getCategories,
	postSignIn,
	postApply,
	getContributors,
	getReviewedApplications,
	getUnreviewedApplications
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
	checkAuthState
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

const loadDashboardArticles = () => {
	dashboardMainEl.innerHTML = '<div class="loader">Loading...</div>';
	Promise.all([getArticles(), getUnpublishedArticles()]).then(result => {
		let [published, unpublished] = result;
		published = published.data || [];
		unpublished = unpublished.data || [];
		onLoadDashboardArticles(published, unpublished, dashboardMainEl);
	});
};

const loadDashboardContributors = () => {
	dashboardMainEl.innerHTML = '<div class="loader">Loading...</div>';
	getContributors().then(result => {
		onLoadDashboardContributors(result.data, dashboardMainEl);
	});
};

const loadDashboardApplications = (callback) => {
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

const resetNavbarLinks = navLink => {
	let activeLink = navLink.parentElement.querySelector(".navbar__link--active");
	activeLink.classList.remove("navbar__link--active");
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
		window.location.pathname.includes("create_account")
	) {
		if (!checkAuthState()) {
			window.location.href = "/sign_in.html";
		}
	}

	if (window.location.pathname.includes("dashboard")) {
		loadDashboardArticles();
		articlesLinks.forEach(articlesLink => {
			articlesLink.classList.add("navbar__link--active");
		});
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

if (applicationForm !== null) {
	applicationForm.addEventListener("submit", postApply);
}

if (articlesLinks !== null) {
	articlesLinks.forEach(articlesLink => {
		articlesLink.addEventListener("click", () => {
			loadDashboardArticles();
			resetNavbarLinks(articlesLink);
			articlesLink.classList.add("navbar__link--active");
		});
	});
}

if (contributorsLinks !== null) {
	contributorsLinks.forEach(contributorsLink => {
		contributorsLink.addEventListener("click", () => {
			loadDashboardContributors();
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
