'use strict';

/**
 * check string is valid json string
 * 
 * @param {String} json json string  
 * @returns {boolean} is valid json string
 */
const isJson = json => {

	// is object
	if (typeof json === 'object') {

		return true;
	}

	try {

		if (typeof json !== 'string') {

			throw new Error('not a string');
		}

		JSON.parse(json);
	} catch (err) {

		return false;
	}

	return true;
};

/**
 * check string is valid email format
 * 
 * @param {String} value string to be test
 * @returns {boolean} is valid email format
 */
const isEmail = value => {

	// is not string
	if (typeof value !== 'string') {

		return false;
	}

	// email checking regexp
	const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	// return test result
	return emailRegex.test(value);
};

/**
 * validate
 * 
 * @param {Object} input input values to be validate
 * @param {Object} schema validation scheme
 * @param {Object} options validate options
 */
const validate = (input = {}, schema = {}, options = {}) => {

	/**
	 * throw new error
	 */
	const goError = (key, message = undefined) => {

		// input value
		const value = input[key];

		// get each schema config
		const config = schema[key];

		// has custom error setting
		if (schema[key] && schema[key].hasOwnProperty('error')) {

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

		// has custom message
		else if (typeof message === 'string') {

			throw new Error(message);
		}

		// no custom error setting
		else {

			throw new Error('invalid value of ' + key);
		}
	};

	// schema is use for check input value
	if (schema.direct === true) {

		// get parent key
		const parentKey = typeof options.parentKey === 'string' ? options.parentKey : 'noname';

		// remove direct
		const { direct, ...rest } = schema;

		// direct validate
		return validate({

			[parentKey]: input
		}, {

			[parentKey]: rest
		});
	}

	// schema is use for check input object
	else {

		// allow properties that out of schema
		if (options.allowExtraProperties === false) {

			// check unspecified keys
			for (let key in input) {

				// is key found
				let found = false;

				// check each key in schema
				for (let key2 in schema) {

					// key found
					if (key === key2) {

						found = true;

						break;
					}
				}

				// reject key that not defined in schema
				if (!found) {

					return goError(key, 'unknown input ' + key + '');
				}
			}
		}

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

				// config "nullable" <boolean> (true)
				if (config.nullable === true) {

					// value is null
					if (value === null || value === 'null') {

						// value is valid
						continue;
					}
				}

				// config "nullable" <boolean> (false)
				else if (config.nullable === false) {

					// value is null
					if (value === null || value === 'null') {

						// go error
						return goError(key);
					}
				}

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

				// config "inValues"
				if (Array.isArray(config.inValues)) {

					// no values set
					if (config.inValues.length === 0) {

						// go error
						return goError(key);
					}

					// flag
					let hasEqual = false;

					// check each value
					for (const targetValue of config.inValues) {

						// value equal to one of the target values
						if (value === targetValue) {

							// has equal
							hasEqual = true;

							// stop
							break;
						}
					}

					// no equal to any values
					if (!hasEqual) {

						// go error
						return goError(key);
					}
				}

				// config "isArray"
				if (config.isArray === true) {

					// value to be check
					let valueToBeCheck = value;

					// value is a valid json string
					if (typeof value === 'string' && isJson(value)) {

						// value may be a array json string
						valueToBeCheck = JSON.parse(value);
					}

					// target is not array
					if (!Array.isArray(valueToBeCheck)) {

						// go error
						return goError(key);
					}
				}

				// config "isJson"
				if (config.isJson === true) {

					// target is not json
					if (!isJson(value)) {

						// go error
						return goError(key);
					}
				}

				// config "isEmail"
				if (config.isEmail === true) {

					// target is not valid email format
					if (!isEmail(value)) {

						// go error
						return goError(key);
					}
				}

				// config "childSchema"
				if (typeof config.childSchema === 'object') {

					// should be a json object
					if (config.isJson !== true) {

						throw new Error('when using child schema, should turn on isJson checking.');
					}

					// parse input value
					const checkValue = typeof value === 'string' ? JSON.parse(value) : value;

					// check child element
					validate(checkValue, config.childSchema, {

						parentKey: key
					});
				}

				// config "childrenSchema"
				if (typeof config.childrenSchema === 'object') {

					// should be an array
					if (config.isArray !== true) {

						throw new Error('when using children schema, should turn on isArray checking.');
					}

					// parse input value
					const checkValue = typeof value === 'string' ? JSON.parse(value) : value;

					// check each array elements
					checkValue.forEach(m => validate(m, config.childrenSchema, {

						parentKey: key
					}));
				}
			}
		}
	}
};

/**
 * exports
 */
module.exports = {

	isJson,

	isEmail,

	validate
};