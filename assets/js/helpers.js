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

export const getDateDiff = datetime => {
	const diff = new Date().getTime() - datetime;
	const years = Math.floor(diff / (1000 * 3600 * 24 * 365));
	const months = Math.floor(diff / (1000 * 3600 * 24 * 30));
	const weeks = Math.floor(diff / (1000 * 3600 * 24 * 7));
	const days = Math.floor(diff / (1000 * 3600 * 24));
	let duration = `${years} ${years === 1 ? "year" : "years"} ago`;
	if (years === 0) {
		duration = `${months} ${months === 1 ? "month" : "months"} ago`;
    }
    if (months === 0) {
		duration = `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    if (weeks === 0) {
		duration = `${days} ${days === 1 ? "day" : "days"} ago`;
	}
	return duration;
};

export const generateDate = (timestamp) => {
	const options = {
		weekday: 'short',
		month: 'short',
		year: 'numeric',
		day: 'numeric'
	};
	const date = new Date(timestamp);
	return date.toLocaleDateString('en-US', options);
}