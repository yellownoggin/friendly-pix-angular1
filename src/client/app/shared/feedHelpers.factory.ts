// namespace friendlyPix {
//     'use strict';
//
//     angular
//         .module('app.shared')
//         .factory('feedHelper', feedHelper);
//
//
//     function feedHelper($rootScope) {
//
//         var data = {
//             entries: null,
//             nextPage: null
//         };
//
//         return {
//             concatNextPage: concatNextPage
//         };
//
//
//         function concatNextPage(nextFn, currentData, busyState, ctrl) {
//             console.log('concat next page called');
//             var self = this;
//
//             if (busyState === true || typeof nextFn !== 'function') {
//                 return;
//             }
//             busyState = true;
//             nextFn().then((results) => {
//                 var newData = [];
//                 newData = convertToArray(results.entries);
//                 self.nextPage = results.nextPage;
//                 self.data = currentData.concat(newData);
//                 busyState = false;
//                 $rootScope.$apply();
//             });
//         }
//
//
//         function convertToArray(data) {
//             // TODO: save for firebase object to usable angular array
//             var reversedPostData = [];
//             let p = Object.keys(data);
//             var myArray = [];
//
//             for (let i = p.length - 1; i >= 0; i--) {
//                 // TODO: abstraction and docs;;
//                 // convert to an array and add the key
//                 var myObject = {};
//                 myObject['value'] = data[p[i]];
//                 myObject['key'] = p[i];
//                 myArray.push(myObject);
//
//             }
//             return myArray;
//         }
//
//
//     }
// }
