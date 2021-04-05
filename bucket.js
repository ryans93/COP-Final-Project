var someArray = [1231231,123123,54,764674,345,59,25345,51,4588,234,12,12,34562,3,3,5];

//Everything around the function is just test code
//################ The Actual Function ################

function BucketSort(toSort, bucketAmount = 1) {
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
    var toReturn = [];
    for (var i = 0; i < bucketAmount; i++) {
        toReturn = toReturn.concat(buckets[i]);
    }
    return toReturn;
}

//##########################################################


someArray = BucketSort(someArray);
console.log(someArray);
