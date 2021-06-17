'use strict';

const Path = require('path');

const Assert = require('assert');

const Validator = require(Path.join(__dirname, '..', 'lib', 'main.js'));

(() => {

	describe('Validator', r => {

		it('test unspecified keys', done => {

			// should success
			try {

				Validator.validate({ foo: null, bar: 'null' }, { foo: { nullable: true } }, { allowExtraProperties: true });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: null, bar: 'null' }, { foo: { nullable: true } }, { allowExtraProperties: false });

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'unknown input bar');
			}

			// next
			return done(undefined);
		});

		it('test nullable', done => {

			// should success
			try {

				Validator.validate({ foo: null }, { foo: { nullable: true } });

				Validator.validate({ foo: 'null' }, { foo: { nullable: true } });

				Validator.validate({ foo: 1 }, { foo: { nullable: false } });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: null }, { foo: { nullable: false } });

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

			// should failure
			try {

				Validator.validate({ foo: 'null' }, { foo: { nullable: false } });

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

			// next
			return done(undefined);
		});

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
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

			// should failure
			try {

				Validator.validate({}, { foo: { optional: false } });

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

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
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

			// should failure
			try {

				Validator.validate({ foo: 1 }, { foo: { type: 'string' } });

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

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
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

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
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

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
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

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
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

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
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

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

				Validator.validate({ foo: { bar: 1, car: 'hello world' } }, { foo: { isJson: true, childSchema: { bar: { type: 'string' }, car: { type: 'string' } } } });

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of bar');
			}

			// should failure
			try {

				Validator.validate({ foo: { car: 'hello world' } }, { foo: { isJson: true, childSchema: { bar: { type: 'number' }, car: { type: 'string' } } } });

				return done(new Error('should throw error2'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of bar');
			}

			// should failure
			try {

				Validator.validate({ foo: { car: 'hello world', dar: { ear: 1 } } }, { foo: { isJson: true, childSchema: { bar: { optional: true, type: 'number' }, car: { type: 'string' }, dar: { isJson: true, childSchema: { ear: { type: 'string' } } } } } });

				return done(new Error('should throw error3'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of ear');
			}

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

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of bar');
			}

			// should failure
			try {

				Validator.validate({ foo: [{ car: 'hello world' }] }, { foo: { isArray: true, childrenSchema: { bar: { type: 'number' }, car: { type: 'string' } } } });

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of bar');
			}

			// should failure
			try {

				Validator.validate({ foo: [{ bar: [{ dar: 'j', md: 1 }, { dar: 'k' }], car: 'hello world' }] }, { foo: { isArray: true, childrenSchema: { bar: { isArray: true, childrenSchema: { dar: { type: 'string' }, md: { type: 'number' } } }, car: { type: 'string' } } } });

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of md');
			}

			// next
			return done(undefined);
		});

		it('test direct', done => {

			// should success
			try {

				Validator.validate({ foo: ['1', '2'] }, { foo: { isArray: true, childrenSchema: { direct: true, type: 'string' } } });

				Validator.validate('hello world', { direct: true, type: 'string' });
			} catch (err) {

				return done(err);
			}

			// should failure
			try {

				Validator.validate({ foo: ['1', '2'] }, { foo: { isArray: true, childrenSchema: { direct: true, type: 'number' } } });

				Validator.validate('hello world', { direct: true, type: 'number' });

				return done(new Error('should throw error'));
			} catch (err) {

				Assert.equal(err.message, 'invalid value of foo');
			}

			// next
			return done(undefined);
		});
	});
})();