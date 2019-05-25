import _ from 'lodash';


beforeAll(() => {

  jasmine.addMatchers(<any>{

    toEqualObj: (util, customEqualityTesters) => {

      return {
        compare: getCompare(false),
        negativeCompare: getCompare(true)
      };

      // nice pattern: both functions are exactly the same outside of NOT in the message and the result.pass being negated,
      // so just use same function in a factory then
      function getCompare(neg) {
        return (_actual, _expected) => {
          if (!_.isObject(_actual) || !_.isObject(_expected)) {
            return {
              pass: false,
              message: `Not an object: actual: ${JSON.stringify(_actual)} expected: ${JSON.stringify(_expected)}`
            };            }
          const result = {
            pass: false,
            message: `Expected ${JSON.stringify(_actual)} ${neg ? 'NOT' : ''} to equal: ${JSON.stringify(_expected)}`
          };
          const actual = JSON.parse(JSON.stringify(_actual));
          const expected = JSON.parse(JSON.stringify(_expected));
          result.pass = _.isEqual(actual, expected);
          if (neg) {
            result.pass = !result.pass;
          }
          return result;
        };
      }
    },

    toBeAnyOf: (util, customEqualityTesters) => {

      return {

        compare: (actual, expecteds) => {
          const result = {
            pass: false,
            message: `Expected ${JSON.stringify(actual)} to be one of: ${JSON.stringify(expecteds)}`
          };
          expecteds.forEach(expected => {
            if (actual === expected) {
              result.pass = true;
            }
          });
          return result;
        },

        negativeCompare: (actual, expecteds) => {
          const result = {
            pass: false,
            message: `Expected ${JSON.stringify(actual)} NOT to be one of: ${JSON.stringify(expecteds)}`
          };
          expecteds.forEach(expected => {
            if (actual === expected) {
              result.pass = true;
            }
          });
          // if we find it, get out of loop, but we're NOT supposed to find it so it's a failure
          // if we don't find it (false) then success, so we negate the results
          result.pass = !result.pass;
        }
      };
    },

    toBeAnyOfEqual: (util, customEqualityTesters) => {

      return {

        compare: (actual, expecteds) => {
          const result = {
            pass: false,
            message: `Expected ${JSON.stringify(actual)} to be one of: ${JSON.stringify(expecteds)}`
          };
          expecteds.forEach(expected => {
            if (util.equals(actual, expected)) {
              result.pass = true;
            }
          });
          return result;
        },

        negativeCompare: (actual, expecteds) => {
          const result = {
            pass: false,
            message: `Expected ${JSON.stringify(actual)} NOT to be one of: ${JSON.stringify(expecteds)}`
          };
          expecteds.forEach(expected => {
            if (util.equals(actual, expected)) {
              result.pass = true;
            }
          });
          // if we find it, get out of loop, but we're NOT supposed to find it so it's a failure
          // if we don't find it (false) then success, so we negate the results
          result.pass = !result.pass;
          return result;
        }
      };
    }

  });
});

