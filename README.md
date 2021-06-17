# 19json-validator

Simple JSON schema validator.

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

    mother: null,

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

    // mother field
    mother: {

        // optional
        optional: true,

        // nullable
        nullable: true,
        
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

    // father field
    father: {

        // optional
        optional: true,

        // nullable
        nullable: true,
        
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

# Test

```sh
$ npm test
```

# Usage

validate(input, schema, options)

# Schema config

The following config options can help you to build your own json check schema for validation.

### optional (boolean, default: false)

true = allow target key missing, false = must contain key.

### nullable (boolean)

true = allow target value is (null) object or 'null' string, false = target value must not equal to (null) object or 'null' string.

### type (string | array&lt;string&gt;)

restrict target value of key should equal to given types, use underlying `typeof` to perform type checking.

### regex (object instanceof RegExp)

restrict target value of key should match to given regular expression, this checking will add a empty string to the end of the value for non-string value.

### empty (boolean, default: true)

true = accept empty value, false = reject empty value.

### isArray (boolean, default: false)

true = value must be a valid array object or a valid json array string.

### isJson (boolean, default: false)

true = value must be a valid object or a valid json object string.

### isEmail (boolean, default: false)

true = input value must be in valid email format.

### childSchema (object)

check input value with provided child schema, use for nested json object structure.

### childrenSchema (object)

check input (array) values with provided child schema, use for json array checking.

### direct (boolean, default: false)

true = use schema to check the input value directly, use for non-object input checking.

# options

### allowExtraProperties (boolean, default: true)

true = allow properties that not defined in schema, false = do not allow properties that not defined in schema