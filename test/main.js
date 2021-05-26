'use strict';

const Path = require('path');

const Validator = require(Path.join(__dirname, '..', 'lib', 'main.js'));

(() => {

	describe('Validator', r => {

		it('test optional', done => {

			// should success
			try {

				Validator.validate({}, { foo: { optional: true } });

				Validator.validate({ foo: 1 }, { foo: { optional: false } });

				Validator.validate({ foo: 1 }, { foo: { optional: true } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({}, { foo: {} });

				return done(new Error('should throw error'));
			} catch (err) { }

			// should failure
			try {

				Validator.validate({}, { foo: { optional: false } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});

		it('test type', done => {

			// should success
			try {

				Validator.validate({ foo: 'tom' }, { foo: { type: 'string' } });

				Validator.validate({ foo: 1 }, { foo: { type: 'number' } });

				Validator.validate({ foo: true }, { foo: { type: 'boolean' } });

				Validator.validate({ foo: true }, { foo: { type: ['boolean', 'string'] } });

				Validator.validate({ foo: 'tom' }, { foo: { type: ['boolean', 'string'] } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: 'tom' }, { foo: { type: 'number' } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// should failure
			try {

				Validator.validate({ foo: 1 }, { foo: { type: 'string' } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});

		it('test empty', done => {

			// should success
			try {

				Validator.validate({ foo: ' ' }, { foo: { empty: false } });

				Validator.validate({ foo: 0 }, { foo: { empty: false } });

				Validator.validate({ foo: true }, { foo: { empty: false } });

				Validator.validate({ foo: '' }, { foo: { empty: true } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: '' }, { foo: { empty: false } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});

		it('test regex', done => {

			// should success
			try {

				Validator.validate({ foo: ' ' }, { foo: { regex: /^ $/ } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: ' ' }, { foo: { regex: /^$/ } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});

		it('test isArray', done => {

			// should success
			try {

				Validator.validate({ foo: [] }, { foo: { isArray: true } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: '' }, { foo: { isArray: true } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});

		it('test isJson', done => {

			// should success
			try {

				Validator.validate({ foo: '{}' }, { foo: { isJson: true } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: '' }, { foo: { isJson: true } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});

		it('test isEmail', done => {

			// should success
			try {

				Validator.validate({ foo: 'hihi@gmail.com' }, { foo: { isEmail: true } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: '' }, { foo: { isEmail: true } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});

		it('test childSchema', done => {

			// should success
			try {

				Validator.validate({ foo: { bar: 1, car: 'hello world' } }, { foo: { isJson: true, childSchema: { bar: { type: 'number' }, car: { type: 'string' } } } });

				Validator.validate({ foo: { car: 'hello world' } }, { foo: { isJson: true, childSchema: { bar: { optional: true, type: 'number' }, car: { type: 'string' } } } });

				Validator.validate({ foo: { car: 'hello world', dar: { ear: 'far' } } }, { foo: { isJson: true, childSchema: { bar: { optional: true, type: 'number' }, car: { type: 'string' }, dar: { isJson: true, childSchema: { ear: { type: 'string' } } } } } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: { bar: 1, car: 'hello world' } }, { foo: { isJson: true, childSchema: { bar: { type: 'number' }, car: { type: 'string' } } } });

				Validator.validate({ foo: { car: 'hello world' } }, { foo: { isJson: true, childSchema: { bar: { type: 'number' }, car: { type: 'string' } } } });

				Validator.validate({ foo: { car: 'hello world', dar: { ear: 1 } } }, { foo: { isJson: true, childSchema: { bar: { optional: true, type: 'number' }, car: { type: 'string' }, dar: { isJson: true, childSchema: { ear: { type: 'string' } } } } } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});

		it('test childrenSchema', done => {

			// should success
			try {

				Validator.validate({ foo: [{ bar: 1, car: 'hello world' }] }, { foo: { isArray: true, childrenSchema: { bar: { type: 'number' }, car: { type: 'string' } } } });

				Validator.validate({ foo: [{ car: 'hello world' }] }, { foo: { isArray: true, childrenSchema: { bar: { optional: true, type: 'number' }, car: { type: 'string' } } } });

				Validator.validate({ foo: [{ bar: [{ dar: 'j', md: 1 }, { dar: 'k' }], car: 'hello world' }] }, { foo: { isArray: true, childrenSchema: { bar: { isArray: true, childrenSchema: { dar: { type: 'string' }, md: { optional: true, type: 'number' } } }, car: { type: 'string' } } } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: [{ bar: '1', car: 'hello world' }] }, { foo: { isArray: true, childrenSchema: { bar: { type: 'number' }, car: { type: 'string' } } } });

				Validator.validate({ foo: [{ car: 'hello world' }] }, { foo: { isArray: true, childrenSchema: { bar: { type: 'number' }, car: { type: 'string' } } } });

				Validator.validate({ foo: [{ bar: [{ dar: 'j', md: 1 }, { dar: 'k' }], car: 'hello world' }] }, { foo: { isArray: true, childrenSchema: { bar: { isArray: true, childrenSchema: { dar: { type: 'string' }, md: { type: 'number' } } }, car: { type: 'string' } } } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});
	});
})();