import _ from 'lodash';


beforeAll(() => {

  jasmine.addMatchers({

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
      }
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
