const { performance } = require('perf_hooks');
var Table = require('cli-table');
var colors = require('colors');

var table = new Table({
    head: ['Sort-Type (N=10^5)'.white, '10^1 Max Range'.white, '10^2 Max Range'.white, '10^3 Max Range'.white,
    '10^4 Max Range'.white, '10^5 Max Range'.white, '10^6 Max Range'.white, '10^7 Max Range'.white,
    '10^8 Max Range'.white]
});
//Table Rows
var row1 = ["Count".red];
var row2a = ["Radix(base 2)".yellow];
var row2b = ["Radix(base 10)".green];
var row3a = ["Bucket(1)".cyan];
var row3b = ["Bucket(n)".blue];
var row4 = ["Merge".magenta];

const size = 100000;
var randomArr = new Array(size);
var max;

for (let m = 1; m < 9; m++) {
    //initialize random array
    max = Math.pow(10, m)
    for (let i = 0; i < size; i++) {
        randomArr[i] = Math.floor(Math.random() * (max + 1));
    }

    //count sort
    if (m < 8) {
        var t0 = performance.now();
        let countSortArr = countSort();
        var t1 = performance.now();
        if (checkSort(countSortArr)) {
            row1.push(((t1 - t0).toFixed(4) + " ms").red);
        }
        else {
            console.log("Error Count Sort");
            process.exit(0);
        }
    }
    else {
        row1.push("Out of Memory".red);
    }

    //radix sort base 2
    var t0 = performance.now();
    let radixSortArr = radixSort2();
    var t1 = performance.now();
    if (radixSortArr === "> 1000 ms") {
        row2a.push("> 1000 ms".yellow);
    }
    else {
        if (checkSort(radixSortArr)) {
            row2a.push(((t1 - t0).toFixed(4) + " ms").yellow);
        }
        else {
            console.log("Error Radix Sort 2");
            process.exit(0);
        }
    }

    //radix sort base 10
    var t0 = performance.now();
    radixSortArr = radixSort();
    var t1 = performance.now();
    if (checkSort(radixSortArr)) {
        row2b.push(((t1 - t0).toFixed(4) + " ms").green);
    }
    else {
        console.log("Error Radix Sort 10");
        process.exit(0);
    }

    //bucket sort(1)
    var t0 = performance.now();
    let bucketSortArr = BucketSort(randomArr, 1);
    var t1 = performance.now();
    if (bucketSortArr === "> 1000 ms") {
        row3a.push("> 1000 ms".cyan);
    }
    else {
        if (checkSort(bucketSortArr)) {
            row3a.push(((t1 - t0).toFixed(4) + " ms").cyan);
        }
        else {
            console.log("Error Bucket Sort");
            process.exit(0);
        }
    }

    // bucket sort(n)
    var t0 = performance.now();
    bucketSortArr = BucketSort(randomArr, size);
    var t1 = performance.now();
    if (checkSort(bucketSortArr)) {
        row3b.push(((t1 - t0).toFixed(4) + " ms").blue);
    }
    else {
        console.log("Error Bucket Sort");
        process.exit(0);
    }

    //merge sort
    var t0 = performance.now();
    let mergeSortArr = mergeSort();
    var t1 = performance.now();
    if (checkSort(mergeSortArr)) {
        row4.push(((t1 - t0).toFixed(4) + " ms").magenta);
    }
    else {
        console.log("Error Merge Sort");
        process.exit(0);
    }
}

table.push(row1);
table.push(row2a);
table.push(row2b);
table.push(row3a);
table.push(row3b);
table.push(row4);
console.log(table.toString());

function countSort() {
    let countArr = new Array(max + 1).fill(0);
    let sortedArray = new Array(size);
    let sum = 0;

    randomArr.forEach((value) => {
        countArr[value]++;
    });

    countArr.forEach((value, i) => {
        sum += value;
        countArr[i] = sum;
    });
    sum = 0;
    countArr.forEach((value, index) => {
        let count = 0;
        for (let i = 0; i < countArr[index] - sum; i++) {
            sortedArray[countArr[index] - (i + 1)] = index;
            count++;
        }
        sum += count;
    });
    return sortedArray;
}

function radixSort() {
    let table1 = [[], [], [], [], [], [], [], [], [], []];
    let table2 = [[], [], [], [], [], [], [], [], [], []];
    let sortedArr = [];
    for (let i = 0; i < randomArr.length; i++) {
        let digit = randomArr[i] % 10;
        table1[digit].push(randomArr[i]);
    }
    let digitLength = max.toString().length;
    for (let i = 1; i < digitLength; i++) {
        if (i % 2 == 1) {
            for (let j = 0; j < table1.length; j++) {
                for (let k = 0; k < table1[j].length; k++) {
                    let string = table1[j][k].toString();
                    let digit = parseInt(string.charAt(string.length - (1 + i)));
                    if (Number.isNaN(digit))
                        digit = 0;
                    table2[digit].push(table1[j][k]);
                }
            }
            table1 = [[], [], [], [], [], [], [], [], [], []];
        }
        else {
            for (let j = 0; j < table2.length; j++) {
                for (let k = 0; k < table2[j].length; k++) {
                    let string = table2[j][k].toString();
                    let digit = parseInt(string.charAt(string.length - (1 + i)));
                    if (Number.isNaN(digit))
                        digit = 0;
                    table1[digit].push(table2[j][k]);
                }
            }
            table2 = [[], [], [], [], [], [], [], [], [], []];
        }
    }

    if (digitLength % 2 == 1) {
        for (let j = 0; j < table1.length; j++) {
            for (let k = 0; k < table1[j].length; k++) {
                sortedArr.push(table1[j][k])
            }
        }
    }
    else {
        for (let j = 0; j < table2.length; j++) {
            for (let k = 0; k < table2[j].length; k++) {
                sortedArr.push(table2[j][k])
            }
        }
    }
    return sortedArr;
}

function radixSort2() {
    let t0 = performance.now();
    let table1 = [[], []];
    let table2 = [[], []];
    let sortedArr = [];
    for (let i = 0; i < randomArr.length; i++) {
        let bin = Number(randomArr[i]).toString(2);
        let digit = bin.charAt(bin.length - 1);
        table1[digit].push(bin);
    }
    let digitLength = Number(max).toString(2).length;
    for (let i = 1; i < digitLength; i++) {
        let t1 = performance.now();
        if ((t1 - t0) > 1000) {
            return "> 1000 ms";
        }
        if (i % 2 == 1) {
            for (let j = 0; j < table1.length; j++) {
                for (let k = 0; k < table1[j].length; k++) {
                    let string = table1[j][k];
                    let digit = parseInt(string.charAt(string.length - (1 + i)));
                    if (Number.isNaN(digit))
                        digit = 0;
                    table2[digit].push(table1[j][k]);
                }
            }
            table1 = [[], []];
        }
        else {
            for (let j = 0; j < table2.length; j++) {
                for (let k = 0; k < table2[j].length; k++) {
                    let string = table2[j][k];
                    let digit = parseInt(string.charAt(string.length - (1 + i)));
                    if (Number.isNaN(digit))
                        digit = 0;
                    table1[digit].push(table2[j][k]);
                }
            }
            table2 = [[], []];
        }
    }

    if (digitLength % 2 == 1) {
        for (let j = 0; j < table1.length; j++) {
            for (let k = 0; k < table1[j].length; k++) {
                sortedArr.push(parseInt(table1[j][k], 2));
            }
        }
    }
    else {
        for (let j = 0; j < table2.length; j++) {
            for (let k = 0; k < table2[j].length; k++) {
                sortedArr.push(parseInt(table2[j][k], 2));
            }
        }
    }
    return sortedArr;
}

//bucket sort function

function BucketSort(toSort, bucketAmount) {
    let t0 = performance.now();
    var max = Math.max.apply(Math, toSort);
    var buckets = new Array(bucketAmount);
    for (var i = 0; i < bucketAmount; i++) {
        buckets[i] = [];
    }
    for (var i = 0; i < toSort.length; i++) {
        var index = Math.floor(bucketAmount * toSort[i] / max);
        if (index == bucketAmount) {
            index--;
        }
        buckets[index].push(toSort[i]);
    }
    var temp;
    for (var i = 0; i < bucketAmount; i++) {
        /* Insertion sort each bucket */
        for (var j = 1; j < buckets[i].length; j++) {
            let t1 = performance.now();
            if ((t1 - t0) > 1000) {
                return "> 1000 ms";
            }
            temp = buckets[i][j]
            index = j - 1;
            while (index >= 0) {
                if (temp < buckets[i][index]) {
                    buckets[i][index + 1] = buckets[i][index];
                    index--;
                } else {
                    break;
                }
            }
            buckets[i][index + 1] = temp;
        }
    }
    var toReturn = new Array(toSort.length);
    index = 0;
    for (var i = 0; i < bucketAmount; i++) {
        for (var j = 0; j < buckets[i].length; j++) {
            toReturn[index] = buckets[i][j]
            index++;
        }
    }
    return toReturn;
}

/*
 * merge sort driver function
 * Takes in no parameters
 * Calls mergeSortRecursive, which recursively completes merge sort
*/
function mergeSort() {
    let sortedArray = randomArr;
    let tempArray = new Array(size);
    mergeSortRecursive(sortedArray, tempArray, 0, size - 1);

    return sortedArray;
} // end mergeSort

/*
 * Recursively completes merge sort on sortedArray
 * Takes in four parameters:
 * 1. The array to be sorted
 * 2. A temporary array of equal size to the array to be sorted to assist with the merging of sorted sub arrays
 * 3. The left most index of the array
 * 4. The right most index of the array
 *
 * Calls mergeSortRecursive on the left and right halves of the array
 * Then calls merge to merge the two sub arrays back together
 */
function mergeSortRecursive(sortedArray, tempArray, leftIndex, rightIndex) {
    let centerIndex = Math.floor((leftIndex + rightIndex) / 2);

    // Proceed with another layer of recursion only if the index of the beginning of the array is less than then end of the array
    if (leftIndex < rightIndex) {
        mergeSortRecursive(sortedArray, tempArray, leftIndex, centerIndex);
        mergeSortRecursive(sortedArray, tempArray, (centerIndex + 1), rightIndex);

        merge(sortedArray, tempArray, leftIndex, centerIndex, rightIndex);
    } // end if

    return;
} // end mergeSortRecursive

/*
 * Merges two sorted arrays
 * Takes in five parameters:
 * 1. The array in with two sub arrays to be merged
 * 2. A temporary array of equal size to the array with sub arrays to be merged to assist with the merging of sorted sub arrays
 * 3. The index of the beginning of the left sub array
 * 4. The index of the end of the left sub array
 * 5. The index of the end of the right sub array
 *
 * Merges the two sorted sub arrays
 */
function merge(sortedArray, tempArray, leftBegin, leftEnd, rightEnd) {
    let beginIndex = leftBegin;     // Stores the index of where the merged array should begin in sortedArray
    let rightBegin = leftEnd + 1;   // Stores the index corresponding to the beginning of the right sub array

    // Copies the section of sortedArray corresponding to the two sub arrays to be merged into tempArray
    for (let i = leftBegin; i < (rightEnd + 1); i++) {
        tempArray[i] = sortedArray[i];
    } // end for

    // While elements are left in both right sub arrays, copy the smallest of the current elements into sortedArray
    while ((leftBegin <= leftEnd) && (rightBegin <= rightEnd)) {
        if (tempArray[leftBegin] <= tempArray[rightBegin]) {
            sortedArray[beginIndex] = tempArray[leftBegin];
            leftBegin++;
        }
        else {
            sortedArray[beginIndex] = tempArray[rightBegin];
            rightBegin++;
        } // end if-else

        beginIndex++;
    } // end while

    // While elements are left in the left sub array, copy them into sortedArray
    while (leftBegin <= leftEnd) {
        sortedArray[beginIndex] = tempArray[leftBegin];
        leftBegin++;
        beginIndex++;
    } // end while

    // While elements are left in the right sub array, copy them into sortedArray
    while (rightBegin <= leftEnd) {
        sortedArray[beginIndex] = tempArray[rightBegin];
        rightBegin++;
        beginIndex++;
    } // end while

    return;
} // end merge

function checkSort(sortedArray) {
    // sizes of arrays are the same
    if (sortedArray.length != size) {
        console.log("Array size doesn't match");
        return false;
    }

    //sorted array is sorted properly and all data fields are valid
    for (let i = 0; i < sortedArray.length - 1; i++) {
        if (sortedArray[i] > sortedArray[i + 1]) {
            console.log("Array is not properly sorted at index " + i);
            return false;
        }
        if (typeof sortedArray[i] != "number" || Number.isNaN(sortedArray[i])) {
            console.log("Array contains element that is not a number or is undefined at index " + i);
            return false;
        }
    }

    // sorted array contains all elements of original array
    for (let i = 0; i < randomArr.length; i++) {
        if (!binarySearch(sortedArray, randomArr[i], 0, sortedArray.length)) {
            console.log("Array is missing element " + randomArr[i] + " from original array.");
            return false;
        }

    }
    return true;
}

function binarySearch(arr, n, min, max) {
    let index = min + Math.floor((max - min) / 2);
    if (arr[index] == n)
        return true;
    else if (arr[index] > n) {
        return binarySearch(arr, n, min, index)
    }
    else {
        return binarySearch(arr, n, index, max)
    }
}