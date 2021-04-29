# 19json-validator

Simple JSON schema validator

# Install

```sh
$ npm install 19json-validator
```

# Usage

```js
// import
const Validator = require('19json-validator');

// input
const input = {

    id: 1,

    name: 'tom',

    description: '1a student',

    skills: ['read', 'write', 'speak']
};

// schema
const schema = {

    // id field
    id: {

        // is optional
        optional: true,

        // allow type
        type: ['number', 'string'],

        // regexp
        regex: /^[1-9][0-9]*$/
    },

    // name field
    name: {

        // optional when id present
        optional: input.hasOwnProperty('id'),

        // type
        type: 'string',

        // not allow empty
        empty: false
    },

    // description field
    description: {

        // optional when id present
        optional: input.hasOwnProperty('id'),

        // type
        type: 'string',

        // allow empty
        empty: true
    },

    // skills field
    skills: {

        // optional
        optional: true,
        
        // is array
        isArray: true
    }
};

try {

    // do validation
    Validator.validate(input, schema);

} catch(err) {

    // log error
    console.error(err);
}
```

### Test

```sh
$ npm test
```
