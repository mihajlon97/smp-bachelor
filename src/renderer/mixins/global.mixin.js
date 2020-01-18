export default {
	methods: {
		setCookie(name, value, days) {
			let expires = "";
			if (days) {
				let date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toUTCString();
			}
			document.cookie = name + "=" + (value || "") + expires + "; path=/";
		},
		firstLetterUppercase(string) {
			return string[0].toUpperCase() + string.slice(1);
		},
		getCookie(name) {
			let nameEQ = name + "=";
			let ca = document.cookie.split(';');
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) === ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		},
		get_blob(path) {
			return URL.createObjectURL(new Blob([require('fs').readFileSync(path)], {type: 'image/jpeg'}));
		},
		/** Function which checks if provided object is empty  */
		isEmpty(obj) {
			for (let prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					return false;
				}
			}
			return JSON.stringify(obj) === JSON.stringify({});
		},
		uuidv4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	}
};
