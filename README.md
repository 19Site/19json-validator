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

    email: 'tom@example.com',

    description: '1a student',

    father: {

        name: 'father tom',

        age: 48
    },

    skills: [
        
        'read', 
        
        'write', 
        
        'speak'
    ],

    orderBy: '[{"field":"id","direction":"asc"}]'
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

    // email field
    email: {

        // optional when id present
        optional: input.hasOwnProperty('id'),

        // is email
        isEmail: true
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

    // father field
    father: {

        // optional
        optional: true,
        
        // is json
        isJson: true,

        // child schema
        childSchema: {

            // child name field
            name: {

                type: 'string'
            },

            // child age field
            age: {

                // type
                type: ['number', 'string'],

                // regex
                regex: /^[1-9][0-9]*$/
            }
        }
    },

    // skills field
    skills: {

        // optional
        optional: true,
        
        // is array
        isArray: true,

        // check for each children element
        childrenSchema: {

            // check directly input value
            direct: true,

            // type
            type: 'string'
        }
    },

    // orderBy field
    orderBy: {

        // optional
        optional: true,
        
        // is array
        isArray: true,        

        // check for each children element
        childrenSchema: {

            // elements field
            field: {

                type: 'string'
            },

            // elements direction
            direction: {

                // type
                type: 'string',

                // regexp
                regex: /^(a|de)sc$/
            }
        }
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
