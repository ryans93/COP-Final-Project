const { performance } = require('perf_hooks');
var Table = require('cli-table');
var table = new Table({
    head: ['Sort-Type', '10^1 Max Range', '10^2 Max Range', '10^3 Max Range',
        '10^4 Max Range', '10^5 Max Range', '10^6 Max Range', '10^7 Max Range', '10^8 Max Range']
});
var row1 = ["Count"];
var row2 = ["Radix"];
var row3 = ["Bucket"];
var row4 = ["Merge"];

const size = 100000;
var randomArr = new Array(size);
var max;

for (let m = 1; m < 9; m++) {
    max = Math.pow(10, m)
    for (let i = 0; i < size; i++)
        randomArr[i] = Math.floor(Math.random() * (max + 1));

    //count sort
    if (m < 8) {
        var t0 = performance.now();
        let countSortArr = countSort();
        var t1 = performance.now();
        if (checkSort(countSortArr))
            row1.push((t1 - t0).toFixed(4) + " ms");
        else {
            console.log("Error Count Sort");
            System.exit(0);
        }
    }
    else
        row1.push("Out of Memory");
    //radix sort
    var t0 = performance.now();
    let radixSortArr = radixSort();
    var t1 = performance.now();
    if (checkSort(radixSortArr))
        row2.push((t1 - t0).toFixed(4) + " ms");
    else {
        console.log("Error Radix Sort");
        System.exit(0);
    }
}

table.push(row1);
table.push(row2);
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
        for (let i = 0; i < countArr[index] - sum; i++) {
            sortedArray[countArr[index] - (i + 1)] = index;
            sum++;
        }
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
    for (let i = 1; i <= digitLength; i++) {
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
                    let string = table2[j][k].toString()
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
            for (let k = 0; j < table2[j].length; k++) {
                sortedArr.push(table2[j][k])
            }
        }
    }
    return sortedArr;
}

function checkSort(sortedArray) {
    for (let i = 0; i < sortedArray.length - 1; i++) {
        if (sortedArray[i] > sortedArray[i + 1])
            return false;
    }
    return true;
}