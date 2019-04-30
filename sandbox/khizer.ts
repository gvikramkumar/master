function truncateDecimal(number, places) {
 const dot = number.toString().indexOf('.');
 const nth = number.toString().charAt(dot + places + 1);
 const str = number.toFixed(places + 1);
 return Number(str.substr(0, str.length - 1));
}

// console.log(truncateDecimal(0.0000001, 8));
// console.log(truncateDecimal(1.000000000009, 8));
// console.log(truncateDecimal(0.123456789, 8));
// console.log(truncateDecimal(0.98765432, 8));
// console.log(truncateDecimal(123.000000001, 8));
// console.log(truncateDecimal(0.0000041, 8));
console.log(truncateDecimal(0.0000041999, 8));

