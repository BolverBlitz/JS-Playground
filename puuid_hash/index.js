const fs = require('node:fs');
const crypto = require('node:crypto');


const testRuns = 100; // Number of times to run the benchmark

/*
    Benchmark to find the best hash algorithm for puuids
*/

/**
 * Read file as UTF-8 string
 * @param {String} path 
 * @returns 
 */
const readPuuidFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

/**
 * Generate random random multiple puuids
 * @param {Array} puuids
 * @param {Number} min
 * @param {Number} max
 */
const generateUniqueCombinations = (uuids, min = 1, max = 15, limit = 10000) => {
    uuids = shuffleArray(uuids); // Shuffle uuids to get random combinations
    function combinations(array, length, startIndex, currentCombination, allCombinations) {
        if (allCombinations.length >= limit) return;
        if (currentCombination.length === length) {
            allCombinations.push(currentCombination.slice());
            return;
        }
        for (let i = startIndex; i < array.length; i++) {
            currentCombination.push(array[i]);
            combinations(array, length, i + 1, currentCombination, allCombinations);
            currentCombination.pop();
        }
    }

    let allCombinations = [];
    for (let length = min; length <= max; length++) {
        combinations(uuids, length, 0, [], allCombinations);
        if (allCombinations.length >= limit) break;
    }

    return allCombinations.slice(0, limit);
}

/**
 * Shuffle array
 * @param {Array} array 
 * @returns 
 */
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Check if there are no duplicates in the combinations
 * @param {Array} combinations 
 * @returns 
 */
const hasNoDuplicates = (combinations) => {
    function createKey(combination) {
        return combination.slice().sort().join('');
    }

    const combinationKeys = new Set();

    for (const combination of combinations) {
        const key = createKey(combination);
        if (combinationKeys.has(key)) {
            return false;
        }
        combinationKeys.add(key);
    }

    return true;
}

const sortArray_lexicographical  = (uuids) => {
    return uuids.sort().join('');
}

const sortArray_numerical = (uuids) => {
    return uuids.sort((a, b) => {
        let numA = parseInt(a.replace(/\D/g,''));
        let numB = parseInt(b.replace(/\D/g,''));
        return numA - numB;
    }).join('');
}

const sortArray_l_lexicographical = (uuids) => {
    return uuids.sort((a, b) => a.length - b.length || a.localeCompare(b)).join('');
}

/**
 * Hash puuid with md5
 * @param {Array} puuids
 * @returns {Array} hashed puuids
 */
const hash_md5 = (puuids) => {
    return puuids.map(puuid => {
        const hash = crypto.createHash('md5');
        hash.update(puuid);
        return hash.digest('hex');
    });
};

/**
 * Hash puuid with sha256
 * @param {Array} puuids
 * @returns {Array} hashed puuids
 */
const hash_sha256 = (puuids) => {
    return puuids.map(puuid => {
        const hash = crypto.createHash('sha256');
        hash.update(puuid);
        return hash.digest('hex');
    });
};

/**
 * Hash puuid with sha3-256
 * @param {Array} puuids
 * @returns {Array} hashed puuids
 */
const hash_sha3_256 = (puuids) => {
    return puuids.map(puuid => {
        const hash = crypto.createHash('sha3-256');
        hash.update(puuid);
        return hash.digest('hex');
    });
};

/**
 * Hash puuid with BLAKE2
 * @param {Array} puuids
 * @returns {Array} hashed puuids
 */
const hash_blake2 = (puuids) => {
    return puuids.map(puuid => {
        const hash = crypto.createHash('blake2b512');
        hash.update(puuid);
        return hash.digest('hex');
    });
};

/**
 * Return persentage of hash collisions
 * @param {Array} puuids_hashes
 */
const checkHashCollisionPercentage = (puuids_hashes) => {
    const puuids_hashes_set = new Set(puuids_hashes);
    return (puuids_hashes.length - puuids_hashes_set.size) / puuids_hashes.length * 100;
};

/**
 * Benchmarking single puuid hashing
 * @param {Number} loops
 * @param {Array} puuids
 * @param {Function} hashFunction
 * @param {String} hashName
 */
const benchmarkSingleHash = (puuids, hashFunction, hashName, loops) => {
    let totalTime = 0n; // Using BigInt for high precision timing
    let collisions = 0;

    for (let i = 0; i < loops; i++) {
        const start = process.hrtime.bigint();
        const hashed_puuids = hashFunction(puuids);

        // Check for hash collisions, and store collinion in persentage for later
        collisions += checkHashCollisionPercentage(hashed_puuids);

        const end = process.hrtime.bigint();
        totalTime += end - start;
    }

    const averageTimeNanoseconds = totalTime / BigInt(loops);
    const averageTimeMilliseconds = Number(averageTimeNanoseconds) / 1000000;

    console.log(`Average time to hash ${puuids.length} puuids with ${hashName} over ${loops} loops: ${averageTimeMilliseconds.toFixed(3)} ms with ${collisions / loops * 100}% collisions`);
};

/**
 * Benchmarking combinations puuid hashing with sorting to make sure to match them later
 * @param {Number} loops
 * @param {Array} puuids_combinations
 * @param {Function} sortFunction
 * @param {Function} hashFunction
 * @param {String} sortName
 * @param {String} hashName
 */
const benchmarkCombinationsHash = (puuids_combinations, sortFunction, hashFunction, sortName, hashName, loops) => {
    let totalTime = 0n; // Using BigInt for high precision timing
    let collisions = 0;

    for (let i = 0; i < loops; i++) {
        const start = process.hrtime.bigint();
        const sorted_puuids_combinations = [...new Set(puuids_combinations.map(combination => sortFunction(combination)))];

        const hashed_puuids_combinations = hashFunction(sorted_puuids_combinations);

        // Check for hash collisions, and store collinion in persentage for later
        collisions += checkHashCollisionPercentage(hashed_puuids_combinations);
        
        const end = process.hrtime.bigint();
        totalTime += end - start;
    }

    const averageTimeNanoseconds = totalTime / BigInt(loops);
    const averageTimeMilliseconds = Number(averageTimeNanoseconds) / 1000000;

    const collisionsPercentage = collisions / loops * 100;

    console.log(`Average time to hash ${puuids_combinations.length} combinations with ${hashName} over ${loops} loops: ${averageTimeMilliseconds.toFixed(3)} ms with ${collisions / loops * 100}% collisions`);
    return { averageTimeMilliseconds, collisionsPercentage, sortName, hashName}
};

(async () => {
    const puuid_list = await readPuuidFile('./puuids_list.txt');
    const puuids = puuid_list.split('\r\n');

    // Benchmark single hash
    benchmarkSingleHash(puuids, hash_md5, 'md5', testRuns);
    benchmarkSingleHash(puuids, hash_sha256, 'sha256', testRuns);
    benchmarkSingleHash(puuids, hash_sha3_256, 'sha3-256', testRuns);
    benchmarkSingleHash(puuids, hash_blake2, 'blake2', testRuns);

    const puuid_combinations = generateUniqueCombinations(puuids, 1, 15, 2 ** 20);
    console.log(`Generated ${puuid_combinations.length} combinations, witch ${hasNoDuplicates(puuid_combinations) ? 'no duplicates' : 'duplicates'}`);


    // Benchmark combinations hash
    const benchmarkResults = [];
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_lexicographical, hash_md5, 'lexicographical', 'md5', testRuns));
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_lexicographical, hash_sha256, 'lexicographical', 'sha256', testRuns));
    
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_lexicographical, hash_sha3_256, 'lexicographical', 'sha3-256', testRuns));
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_lexicographical, hash_blake2, 'lexicographical', 'blake2', testRuns));

    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_numerical, hash_md5, 'numerical', 'md5', testRuns));
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_numerical, hash_sha256, 'numerical', 'sha256', testRuns));
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_numerical, hash_sha3_256, 'numerical', 'sha3-256', testRuns));
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_numerical, hash_blake2, 'numerical', 'blake2', testRuns));

    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_l_lexicographical, hash_md5, 'l_lexicographical', 'md5', testRuns));
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_l_lexicographical, hash_sha256, 'l_lexicographical', 'sha256', testRuns));
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_l_lexicographical, hash_sha3_256, 'l_lexicographical', 'sha3-256', testRuns));
    benchmarkResults.push(benchmarkCombinationsHash(puuid_combinations, sortArray_l_lexicographical, hash_blake2, 'l_lexicographical', 'blake2', testRuns));

    // Sort benchmark results by average time
    benchmarkResults.sort((a, b) => a.averageTimeMilliseconds - b.averageTimeMilliseconds);

    // Print benchmark results
    console.log('\nBenchmark results:');
    console.table(benchmarkResults);

    console.log('Done');

})();
