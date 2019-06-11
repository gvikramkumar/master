import Q from 'q';
import _ from 'lodash';
import AnyObj from '../../../shared/models/any-obj';



/*
let p1 = Q({prop:'one'});
let p2 = Q({prop:'two'});
let p3 = Q({prop: 'three'});
let p4 = Q({prop:'four'});
*/

/*
let p1 = Q({name:'one'});
let p2 = Q.reject({error:'two'});
let p3 = Q({name: 'three'});
let p4 = Q.reject({error:'four'});

let items = [
   {number: '11'},
   {number: '22'},
   {number: '33'},
   {number: '44'},
]



let dataArray = [
   {number: '11'},
   {number: '22'},
   {number: '33'},
   {number: '44'},
];


Q.allSettled([p1, p2, p3, p4])
   .then(handleQAllSettled(dataArray, 'Catch Name'))
   .then(function () {
      console.log('then block')
   })
   .catch(function (resp) {
      console.log('catch block')
   });

*/


/*
Q.allSettled([p1, p2, p3, p4])
   .then(handleQAllSettled())
   .then(x => console.log('success', JSON.stringify(x,null,2)))
   .catch(x => console.log('fail', JSON.stringify(x,null,2) ));
*/

/*
Q.allSettled([p1, p2, p3, p4])
   .then(x => console.log('success', x))
   .catch(e => console.log('fail', e ));
*/

/*
Q.allSettled([p1, p2, p3, p4])
   .then(handleQAllSettled)
   .then(x => console.log('success', x))
   .catch(x => console.log('fail', x));
*/


export function handleQAllSettled(dataArray?, rejectName?) {
   return (responses) => {
      responses = responses.map((response, i) => {
         response.index = i;
         if (dataArray && _.isArrayLike(dataArray)) {
            response.data = dataArray[i];
         }
         return response;
      });

      const rtn: AnyObj = {};
      rtn.resolves = responses.filter((response) => response.state === 'fulfilled')
         .map((resolve) => {
            delete resolve.state;
            return resolve;
         });

      rtn.rejects = responses.filter((response) => response.state === 'rejected')
         .map((reject) => {
            reject.error = reject.reason;
            delete reject.reason;
            delete reject.state;
            return reject;
         });

      rtn.hasResolves = !!rtn.resolves.length;
      rtn.hasRejects = !!rtn.rejects.length;
      rtn.isEmpty = !rtn.hasResolves && !rtn.hasRejects;

      if (rtn.hasRejects && rejectName) {
         rtn.name = rejectName.toString();
         return Q.reject(rtn);
      } else {
         return rtn;
      }
   };
}
