export const requestData = (url, method, headers = null, data = null) => {
	const defaultHeaders = {
		"Content-Type": "application/json"
	};
	const requestConfig = {
		method,
		headers: headers || defaultHeaders
	};
	if (method.toLowerCase() !== "get" || method.toLowerCase() !== "delete") {
		requestConfig.body = data;
	}
	return fetch(url, requestConfig).then(res => res.json());
};
