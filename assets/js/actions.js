import {requestData} from "./helpers.js";

const API_URL = "https://us-central1-dsc-blog-c97d3.cloudfunctions.net/app";

export const getArticles = () => {
	return requestData(`${API_URL}/articles`, "get")
		.then(result => console.log(result))
		.catch(err => {
			console.log(err.message);
			console.log(err.stack);
		});
};
