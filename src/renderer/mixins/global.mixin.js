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
		// function to encode file data to base64 encoded string
		base64_encode(file) {
			return new Promise(function (resolve, reject) {
				const fs = require('fs');
				// read binary data
				fs.readFile(file, function (err, data) {
					if (err) reject(err);
					// convert binary data to base64 encoded string
					resolve(Buffer(data).toString('base64'))
				});
			})
		},
		// function to create file from base64 encoded string
		base64_decode(base64str, file) {
			// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
			var bitmap = new Buffer(base64str, 'base64');
			// write buffer to file
			fs.writeFileSync(file, bitmap);
			console.log('******** File created from base64 encoded string ********');
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
	}
};
