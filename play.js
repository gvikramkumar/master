

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(5);
    console.log('resolved');
  });
})

setTimeout(() => {
  p.then(val => console.log(val));
  console.log('after');
},1000)







