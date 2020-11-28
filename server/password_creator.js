const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'mosbyboy';
const someOtherPlaintextPassword = 'not_bacon';

const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
console.log(hash);
console.log(bcrypt.compareSync(myPlaintextPassword, hash));
console.log(bcrypt.compareSync(someOtherPlaintextPassword, hash));

// bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
//     console.log(hash);
// });
// 
// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hasht, function (err, result) {
//     // result == true
//     console.log(result + "a");
// });
// bcrypt.compare(someOtherPlaintextPassword, hasht, function (err, result) {
//     // result == false
//     console.log(result + "b");
// });