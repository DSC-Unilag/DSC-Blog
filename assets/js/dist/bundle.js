(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupCategoryClickEventListeners = exports.onLoadCategoryArticles = exports.setupPostClickEventListeners = exports.showHomepage = exports.showSingleArticle = exports.onLoadCategories = exports.onLoadArticles = exports.getArticlesByCategory = exports.getCategories = exports.getSingleArticle = exports.getArticles = void 0;

var _helpers = require("./helpers.js");

var DEV_API_URL = "http://localhost:5000/dsc-blog-c97d3/us-central1/app";
var API_URL = "https://us-central1-dsc-blog-c97d3.cloudfunctions.net/app"; // API Actions

var getArticles = function getArticles() {
  return (0, _helpers.requestData)("".concat(API_URL, "/articles"), "get")["catch"](function (err) {
    console.log("Error Msg: " + error.message);
    console.log(error.stack);
  });
};

exports.getArticles = getArticles;

var getSingleArticle = function getSingleArticle(aid) {
  return (0, _helpers.requestData)("".concat(API_URL, "/articles/").concat(aid), "get")["catch"](function (err) {
    console.log("Error Msg: " + error.message);
    console.log(error.stack);
  });
};

exports.getSingleArticle = getSingleArticle;

var getCategories = function getCategories() {
  return (0, _helpers.requestData)("".concat(API_URL, "/categories"), "get")["catch"](function (err) {
    console.log("Error Msg: " + error.message);
    console.log(error.stack);
  });
};

exports.getCategories = getCategories;

var getArticlesByCategory = function getArticlesByCategory(cid) {
  return (0, _helpers.requestData)("".concat(API_URL, "/articles/category/").concat(cid), "get")["catch"](function (err) {
    console.log("Error Msg: " + error.message);
    console.log(error.stack);
  });
}; // DOM Actions


exports.getArticlesByCategory = getArticlesByCategory;

var onLoadArticles = function onLoadArticles(articlesSection) {
  articlesSection.innerHTML = "<div class=\"loader\">Loading...</div>";
  return function (articles, topPosts) {
    articlesSection.innerHTML = "";

    if (articles.length > 0) {
      articles.forEach(function (article) {
        articlesSection.innerHTML += "<article class=\"article\">\n                <div class=\"article__img-wrapper\">\n                    <span class=\"article__img-tag article__img-tag--black\">".concat(article.category.name, "</span>\n                    <img src=\"").concat(article.imageUrl, "\" alt=\"article\" class=\"article__img\">\n                </div>\n                <p class=\"article__title tool\" data-aid=").concat(article.aid, " data-tip=\"Read Full Article\">\n                    <a href=\"javascript:;\">").concat(article.title, "</a>\n                </p>\n                <p class=\"article__details\">\n                    ").concat((0, _helpers.getDateDiff)(article.created), " / by ").concat(article.user.firstname + " " + article.user.lastname, "\n                </p>\n                <p class=\"article__synopsis\">\n                    ").concat(article.content.substring(0, 100) + "...", "\n                </p>\n                <!-- <div class=\"article__metrics\">\n                    <div class=\"article__views\">\n                        <img src=\"./assets/images/options.svg\" alt=\"options\">\n                        <div class=\"article__viewers\">\n                            <img src=\"./assets/images/viewer-1.png\" alt=\"viewer\">\n                            <img src=\"./assets/images/viewer-2.png\" alt=\"viewer\" class=\"img-1\">\n                            <img src=\"./assets/images/viewer-3.png\" alt=\"viewer\" class=\"img-2\">\n                            <img src=\"./assets/images/viewer-4.png\" alt=\"viewer\" class=\"img-3\">\n                            <span>+20 more</span>\n                        </div>\n                    </div>\n                    <div class=\"article__stats\">\n                        <div class=\"article__stat\">\n                            <img src=\"./assets/images/heart.svg\" alt=\"heart\">\n                            <span>10</span>\n                        </div>\n                        <div class=\"article__stat\">\n                            <img src=\"./assets/images/chat.svg\" alt=\"heart\">\n                            <span>10</span>\n                        </div>\n                    </div>\n                </div> -->\n            </article>");
      });
      articlesSection.innerHTML += "<div class=\"article__page-links\">\n            <span class=\"article__page-link article__page-link--active\">1</span>\n            <span class=\"article__page-link\">2</span>\n            <span class=\"article__page-link\">3</span>\n            <span class=\"article__page-link\">...</span>\n            <a class=\"article__page-next-link\">Next</a>\n        </div>";
      topPosts.innerHTML = "<div class=\"top-post\">\n            <div class=\"overlay\"></div>\n            <img src=\"./assets/images/camp-2-min.png\" alt=\"Post Image\" class=\"top-post__img\">\n            <p class=\"top-post__tag\">\n                <img src=\"./assets/images/play.svg\" alt=\"play\">\n                Latest Post\n            </p>\n            <p class=\"top-post__title\">\n                ".concat(articles[0].title, "\n            </p>\n            <p class=\"top-post__content\">\n                ").concat(articles[0].content.substring(0, 100) + "...", "\n            </p>\n            <div class=\"top-post__row\">\n                <a href=\"#\" class=\"top-post__link\" data-aid=").concat(articles[0].aid, ">\n                    KEEP READING\n                </a>\n                <div class=\"top-post__author-details\">\n                    <p class=\"top-post__author\">\n                    ").concat(articles[0].user.firstname + " " + articles[0].user.lastname, "\n                    </p>\n                    <p class=\"top-post__author-role\">\n                        ").concat(articles[0].user.role[0].toUpperCase() + articles[0].user.role.slice(1), "\n                    </p>\n                </div>\n            </div>\n        </div>");
    } else {
      articlesSection.innerHTML += "<p>No Articles Found</p>";
    }
  };
};

exports.onLoadArticles = onLoadArticles;

var onLoadCategories = function onLoadCategories(categoriesList, categories) {
  if (categories.length > 0) {
    categories.forEach(function (category) {
      categoriesList.innerHTML += "<li class=\"categories__category\" data-cid=".concat(category.id, ">\n            <span></span>\n            ").concat(category.name, "\n        </li>");
    });
  }
};

exports.onLoadCategories = onLoadCategories;

var showSingleArticle = function showSingleArticle(e, mainEl, loadingDiv, singleArticleSection, singleArticleMain) {
  loadingDiv.classList.remove("hide");
  mainEl.classList.add("hidden");
  var aid = e.target.dataset.aid;

  if (e.target.dataset.aid === undefined) {
    aid = e.target.parentElement.dataset.aid;
  }

  getSingleArticle(aid).then(function (result) {
    var data = result.data;
    singleArticleSection.innerHTML += "<article class=\"single__article\">\n        <p class=\"single__article-title\">".concat(data.title, "</p>\n        <p class=\"single__article-author\">\n            By ").concat(data.user.firstname + " " + data.user.lastname, " <span>").concat((0, _helpers.generateDate)(data.created), "</span>\n        </p>\n        <div class=\"single__article-img\">\n            <img src=\"").concat(data.imageUrl, "\" alt=\"Article Image\" />\n        </div>\n        <br />\n        <p class=\"single__article-content\">\n            ").concat(data.content, "\n        </p>\n    </article>");
    loadingDiv.classList.add("hide");
    singleArticleMain.classList.add("visible");
  });
};

exports.showSingleArticle = showSingleArticle;

var showHomepage = function showHomepage(mainEl, loadingDiv, singleArticleSection, singleArticleMain) {
  loadingDiv.classList.remove("hide");
  singleArticleSection.innerHTML = "";
  singleArticleMain.classList.remove("visible");
  loadingDiv.classList.add("hide");
  mainEl.classList.remove("hidden");
};

exports.showHomepage = showHomepage;

var setupPostClickEventListeners = function setupPostClickEventListeners(postTitles) {
  postTitles.forEach(function (postTitle) {
    postTitle.addEventListener("click", function (e) {
      return showSingleArticle(e, mainEl, loadingDiv, singleArticleSection, singleArticleMain);
    });
  });
};

exports.setupPostClickEventListeners = setupPostClickEventListeners;

var onLoadCategoryArticles = function onLoadCategoryArticles(e, loadArticles, loadingDiv, topPost) {
  var cid = e.target.dataset.cid;

  if (e.target.dataset.cid === undefined) {
    cid = e.target.parentElement.dataset.cid;
  }

  getArticlesByCategory(cid).then(function (result) {
    loadArticles(result.data, topPost);
    loadingDiv.classList.add("hide");
  });
};

exports.onLoadCategoryArticles = onLoadCategoryArticles;

var setupCategoryClickEventListeners = function setupCategoryClickEventListeners(categoriesList, loadArticles, topPost, loadingDiv) {
  categoriesList.forEach(function (category) {
    category.addEventListener("click", function (e) {
      onLoadCategoryArticles(e, loadArticles, loadingDiv, topPost);
    });
  });
};

exports.setupCategoryClickEventListeners = setupCategoryClickEventListeners;

},{"./helpers.js":3}],2:[function(require,module,exports){
"use strict";

var _actions = require("./actions.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

//DOM Elements
var articlesSection = document.querySelector(".articles");
var categoryList = document.querySelector(".categories__list");
var loadingDiv = document.querySelector(".loading");
var topPost = document.querySelector(".top-posts");
var mainEl = document.querySelector("main");
var singleArticleSection = document.querySelector(".single__article-page");
var singleArticleMain = document.querySelector(".single__article-main");
var backBtn = document.querySelector(".single__article-main > .btn"); // Event Listeners

document.addEventListener("DOMContentLoaded", function () {
  Promise.all([(0, _actions.getCategories)(), (0, _actions.getArticles)()]).then(function (result) {
    var _result = _slicedToArray(result, 2),
        categoryResult = _result[0],
        articlesResult = _result[1];

    (0, _actions.onLoadCategories)(categoryList, categoryResult.data);
    var loadArticles = (0, _actions.onLoadArticles)(articlesSection);

    if (categoryList.childElementCount > 1) {
      var categoriesList = Array.from(categoryList.childNodes).filter(function (childNode) {
        return childNode.className === "categories__category";
      });
      (0, _actions.setupCategoryClickEventListeners)(categoriesList, loadArticles, topPost, loadingDiv);
    }

    loadArticles(articlesResult.data, topPost);
    loadingDiv.classList.add("hide");
    var postTitles = document.querySelectorAll("p.article__title.tool > a");

    if (postTitles !== null) {
      (0, _actions.setupPostClickEventListeners)(postTitles);
    }
  });
});

if (backBtn !== null) {
  backBtn.addEventListener("click", function () {
    (0, _actions.showHomepage)(mainEl, loadingDiv, singleArticleSection, singleArticleMain);
  });
}

},{"./actions.js":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateDate = exports.getDateDiff = exports.requestData = void 0;

var requestData = function requestData(url, method) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var defaultHeaders = {
    "Content-Type": "application/json"
  };
  var requestConfig = {
    method: method,
    headers: headers || defaultHeaders
  };

  if (method.toLowerCase() !== "get" || method.toLowerCase() !== "delete") {
    requestConfig.body = data;
  }

  return fetch(url, requestConfig).then(function (res) {
    return res.json();
  });
};

exports.requestData = requestData;

var getDateDiff = function getDateDiff(datetime) {
  var diff = new Date().getTime() - datetime;
  var years = Math.floor(diff / (1000 * 3600 * 24 * 365));
  var months = Math.floor(diff / (1000 * 3600 * 24 * 30));
  var weeks = Math.floor(diff / (1000 * 3600 * 24 * 7));
  var days = Math.floor(diff / (1000 * 3600 * 24));
  var duration = "".concat(years, " ").concat(years === 1 ? "year" : "years", " ago");

  if (years === 0) {
    duration = "".concat(months, " ").concat(months === 1 ? "month" : "months", " ago");
  }

  if (months === 0) {
    duration = "".concat(weeks, " ").concat(weeks === 1 ? "week" : "weeks", " ago");
  }

  if (weeks === 0) {
    duration = "".concat(days, " ").concat(days === 1 ? "day" : "days", " ago");
  }

  return duration;
};

exports.getDateDiff = getDateDiff;

var generateDate = function generateDate(timestamp) {
  var options = {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric'
  };
  var date = new Date(timestamp);
  return date.toLocaleDateString('en-US', options);
};

exports.generateDate = generateDate;

},{}]},{},[2]);
