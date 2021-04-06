var someArray = [
    1119,
1024,
1719,
 307,
1351,
1581,
2672,
  51,
 714,
 520,
2290,
2078,
 165,
 293,
2982,
2641,
1538,
1530,
1308,
1292,
2421,
1819,
2324,
2892
];

//Everything around the function is just test code
//################ The Actual Function ################

function BucketSort(toSort, bucketAmount = 20) {
    var max = Math.max.apply(Math,toSort);
    var buckets = new Array(bucketAmount);
    for (var i = 0; i < bucketAmount; i++) {
        buckets[i] = [];
    }
    for (var i = 0; i < toSort.length; i++) {
        var index = Math.floor(bucketAmount*toSort[i]/max);
        if (index == bucketAmount) {
            index--;
        }
        buckets[index].push(toSort[i]);
    }
    var temp;
    for (var i = 0; i < bucketAmount; i++) {
        /* Insertion sort each bucket */
        for (var j = 1; j < buckets[i].length; j++) { 
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
            buckets[i][index+1] = temp;
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

//##########################################################


someArray = BucketSort(someArray);
console.log(someArray);
