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

				Validator.validate({ foo: '' }, { foo: { isArray: false } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: [] }, { foo: { isArray: false } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// should failure
			try {

				Validator.validate({ foo: '' }, { foo: { isArray: true } });

				return done(new Error('should throw error'));
			} catch (err) { }

			// next
			return done(undefined);
		});
	});
})();