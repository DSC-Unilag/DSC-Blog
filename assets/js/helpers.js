import swal from "sweetalert";

export const requestData = ({
	url,
	method,
	data = null,
	authToken = "",
	type = null
}) => {
	const headers = {
		Authorization: authToken !== "" ? "Bearer " + authToken : authToken
	};
	if (!type) {
		headers["Content-Type"] = "application/json";
	}
	const requestConfig = {
		method,
		headers
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

export const generateDate = timestamp => {
	const options = {
		weekday: "short",
		month: "short",
		year: "numeric",
		day: "numeric"
	};
	const date = new Date(timestamp);
	return date.toLocaleDateString("en-US", options);
};

export const inquire = (question, callback, icon = "info", danger = false) => {
	return swal({
		title: "Are you sure?",
		text: question,
		icon,
		dangerMode: danger
	}).then(carryOn => {
		if (carryOn) {
			return callback();
		} else {
			swal.close();
		}
	});
};

export const sAlert = ({title, message, type}) => {
	return swal({
		title,
		text: message,
		icon: type,
		button: "OK"
	});
};

export const sEnquire = (title, callback) => {
	return swal({
		title: title,
		icon: "info",
		buttons: true,
		dangerMode: true
	}).then(carryOn => {
		if (carryOn) {
			callback();
		}
	});
};

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
export const chunkArray = (myArray, chunk_size) => {
	const results = [];
	while (myArray.length) {
		results.push(myArray.splice(0, chunk_size));
	}
	return results;
};
