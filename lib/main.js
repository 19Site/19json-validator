'use strict';

/**
 * jsonv
 */
module.exports = {

	/**
	 * validate
	 * 
	 * @param {Object} input input values to be validate
	 * @param {Object} schema validation scheme
	 * @returns 
	 */
	validate: (input, schema) => {

		/**
		 * throw new error
		 */
		const goError = key => {

			// input value
			const value = input[key];

			// get each schema config
			const config = schema[key];

			// has custom error setting
			if (schema[key].hasOwnProperty('error')) {

				// string error
				if (typeof schema[key].error === 'string') {

					throw new Error(schema[key].error);
				}

				// function error
				else if (typeof schema[key].error === 'function') {

					// get the result from error function
					const result = schema[key].error(key, value, config);

					// no result
					if (typeof result === 'undefined') {

						return;
					}

					// have result
					else {

						throw new Error(result);
					}
				}
			}

			// no custom error setting
			else {

				throw new Error('invalid value of ' + key);
			}
		};

		// check schema value
		for (let key in schema) {

			// input value
			const value = input[key];

			// get each schema config
			const config = schema[key];

			// config "optional" (default: false)
			if (config.optional !== true) {

				// no target value
				if (!input.hasOwnProperty(key)) {

					// go error
					return goError(key);
				}
			}

			// has value
			if (input.hasOwnProperty(key)) {

				// config "type" <Array>
				if (Array.isArray(config.type)) {

					// has any type match
					let hasMatch = false;

					// try to match each type
					config.type.forEach(m => {

						if (typeof value === m) {

							hasMatch = true;
						}
					});

					// no one of the types matched
					if (!hasMatch) {

						// go error
						return goError(key);
					}
				}

				// config "type" <string>
				else if (typeof config.type === 'string') {

					// not target type
					if (typeof value !== config.type) {

						// go error
						return goError(key);
					}
				}

				// config "regex"
				if (typeof config.regex === 'object' && config.regex instanceof RegExp) {

					// not match target regexp
					if (!config.regex.test(value + '')) {

						// go error
						return goError(key);
					}
				}

				// config "empty" (default: true)
				if (config.empty === false) {

					// is empty string
					if ((value + '').length === 0) {

						// go error
						return goError(key);
					}
				}
			}
		}
	}
};