const MegaHash = require('megahash');
const S_Cache_F1 = new MegaHash();
const S_Cache_F2 = new MegaHash();
const S_Cache_F3 = new MegaHash();
const S_Cache_F4 = new MegaHash();
const S_Cache_F5 = new MegaHash();
const S_Cache_F6 = new MegaHash();

/*
Disclaimer: Using smal numbers will result in high error margine. This code does NOT run it multiple times and calculates a avrage!
*/

//false will just show how well the cache if performing
const LOG_JS_Benchmark = false; //Set to true to see the results of each benchmark in ms so you can compare them

//Test number of iterations for each benchmark
const MAX_INT_LIST = [10n, 100n, 1000n, 10000, 100000n, 1000000n];
//Random picked number that is checked across all functions if they get the same result
const CONTROL_INT_LIST = [6n, 54n, 854n, 4934n, 69543n, 495845n]

function isOdd(num) { return num % 2n; }

function relDiff(a, b) {
    return 100 * Math.abs((a - b) / ((a + b) / 2));
}

function colorString(str, int) {
    if (int < 0) {
        return `\x1b[31m${str}\x1b[0m`;
    } else {
        return `\x1b[32m${str}\x1b[0m`;
    }
}

function resultWord(int) {
    if (int < 0) {
        return '\x1b[31mslower\x1b[0m';
    } else {
        return '\x1b[32mfaster\x1b[0m';
    }
}

function Benchmark(MAX_INT, CONTROL_INT) {
    const Array_NoCache_S = performance.now();
    for (let i = 2n; i < MAX_INT; i++) {
        let C_Number = i
        let C_Cache = []

        while (C_Number !== 1n) {
            if (isOdd(C_Number)) {
                C_Number = C_Number * 3n + 1n
            } else {
                C_Number = C_Number / 2n
            }

            C_Cache.push(C_Number)
        }

        S_Cache_F1.set(i, C_Cache.join("-"))
    }
    const Array_NoCache_E = performance.now();

    const Array_Cache_S = performance.now();
    for (let i = 2n; i < MAX_INT; i++) {
        let C_Number = i
        let C_Cache = []

        while (C_Number !== 1n) {
            if (isOdd(C_Number)) {
                C_Number = C_Number * 3n + 1n
            } else {
                C_Number = C_Number / 2n
            }

            C_Cache.push(C_Number)

            const Cache_Sequenze = S_Cache_F2.get(C_Number)

            if (Cache_Sequenze !== undefined) {
                const Cached_Numbers = Cache_Sequenze.split("-")
                for (let y = 0; y < Cached_Numbers.length; y++) {
                    C_Cache.push(Cached_Numbers[y])
                }
                break;
            }
        }

        S_Cache_F2.set(i, C_Cache.join("-"))
    }
    const Array_Cache_E = performance.now();

    const String1_NoCache_S = performance.now();
    for (let i = 2n; i < MAX_INT; i++) {
        let C_Number = i
        let C_Cache = ``

        while (C_Number !== 1n) {
            if (isOdd(C_Number)) {
                C_Number = C_Number * 3n + 1n
            } else {
                C_Number = C_Number / 2n
            }

            if (C_Cache === '') { C_Cache = `${C_Number}` } else { C_Cache = `${C_Cache}-${C_Number}` }
        }

        S_Cache_F3.set(i, C_Cache)
    }
    const String1_NoCache_E = performance.now();

    const String1_Cache_S = performance.now();
    for (let i = 2n; i < MAX_INT; i++) {
        let C_Number = i
        let C_Cache = ``

        while (C_Number !== 1n) {
            if (isOdd(C_Number)) {
                C_Number = C_Number * 3n + 1n
            } else {
                C_Number = C_Number / 2n
            }

            if (C_Cache === '') { C_Cache = `${C_Number}` } else { C_Cache = `${C_Cache}-${C_Number}` }

            const Cache_Sequenze = S_Cache_F3.get(C_Number)

            if (Cache_Sequenze !== undefined) {
                const Cached_Numbers = Cache_Sequenze.split("-")
                for (let y = 0; y < Cached_Numbers.length; y++) {
                    C_Cache = `${C_Cache}-${Cached_Numbers[y]}`
                }
                break;
            }
        }

        S_Cache_F4.set(i, C_Cache)
    }
    const String1_Cache_E = performance.now();

    const String2_NoCache_S = performance.now();
    for (let i = 2n; i < MAX_INT; i++) {
        let C_Number = i
        let C_Cache = ``

        while (C_Number !== 1n) {
            if (isOdd(C_Number)) {
                C_Number = C_Number * 3n + 1n
            } else {
                C_Number = C_Number / 2n
            }

            if (C_Cache === ``) { C_Cache = `${C_Number}` } else { C_Cache = C_Cache + "-" + C_Number }
        }
        S_Cache_F5.set(i, C_Cache)
    }
    const String2_NoCache_E = performance.now();

    const String2_Cache_S = performance.now();
    for (let i = 2n; i < MAX_INT; i++) {
        let C_Number = i
        let C_Cache = ``

        while (C_Number !== 1n) {
            if (isOdd(C_Number)) {
                C_Number = C_Number * 3n + 1n
            } else {
                C_Number = C_Number / 2n
            }

            if (C_Cache === ``) { C_Cache = `${C_Number}` } else { C_Cache = C_Cache + "-" + C_Number }

            const Cache_Sequenze = S_Cache_F4.get(C_Number)

            if (Cache_Sequenze !== undefined) {
                const Cached_Numbers = Cache_Sequenze.split("-")
                for (let y = 0; y < Cached_Numbers.length; y++) {
                    C_Cache = C_Cache + "-" + Cached_Numbers[y]
                }
                break;
            }
        }
        S_Cache_F6.set(i, C_Cache)
    }
    const String2_Cache_E = performance.now();

    if (S_Cache_F1.get(CONTROL_INT) === S_Cache_F2.get(CONTROL_INT) && S_Cache_F2.get(CONTROL_INT) === S_Cache_F3.get(CONTROL_INT) && S_Cache_F3.get(CONTROL_INT) === S_Cache_F4.get(CONTROL_INT) && S_Cache_F4.get(CONTROL_INT) === S_Cache_F5.get(CONTROL_INT) && S_Cache_F5.get(CONTROL_INT) === S_Cache_F6.get(CONTROL_INT)&& S_Cache_F6.get(CONTROL_INT) === S_Cache_F1.get(CONTROL_INT)) {
        if (LOG_JS_Benchmark) {
            console.log(`
    ${MAX_INT}:
        Array: Cache ${resultWord((Array_NoCache_E - Array_NoCache_S) - (Array_Cache_E - Array_Cache_S))} in percent: ${colorString(`${relDiff(Array_NoCache_E - Array_NoCache_S, Array_Cache_E - Array_Cache_S).toFixed(2)}%`, (Array_NoCache_E - Array_NoCache_S) - (Array_Cache_E - Array_Cache_S))}
        Array_NoCache: ${(Array_NoCache_E - Array_NoCache_S).toFixed(3)}ms
        Array_Cache: ${(Array_Cache_E - Array_Cache_S).toFixed(3)}ms

        String1: Cache ${resultWord((String1_NoCache_E - String1_NoCache_S) - (String1_Cache_E - String1_Cache_S))} in percent: ${colorString(`${relDiff(String1_NoCache_E - String1_NoCache_S, String1_Cache_E - String1_Cache_S).toFixed(2)}%`, (String1_NoCache_E - String1_NoCache_S) - (String1_Cache_E - String1_Cache_S))}
        String1_NoCache: ${(String1_NoCache_E - String1_NoCache_S).toFixed(3)}ms
        String1_Cache: ${(String1_Cache_E - String1_Cache_S).toFixed(3)}ms

        String2: Cache ${resultWord((String2_NoCache_E - String2_NoCache_S) - (String2_Cache_E - String2_Cache_S))} in percent: ${colorString(`${relDiff(String2_NoCache_E - String2_NoCache_S, String2_Cache_E - String2_Cache_S).toFixed(2)}%`, (String2_NoCache_E - String2_NoCache_S) - (String2_Cache_E - String2_Cache_S))}
        String2_NoCache: ${(String2_NoCache_E - String2_NoCache_S).toFixed(3)}ms
        String2_Cache: ${(String2_Cache_E - String2_Cache_S).toFixed(3)}ms`)
        } else {
            console.log(`
    ${MAX_INT}:
        Array: Cache ${resultWord((Array_NoCache_E - Array_NoCache_S) - (Array_Cache_E - Array_Cache_S))} in percent: ${colorString(`${relDiff(Array_NoCache_E - Array_NoCache_S, Array_Cache_E - Array_Cache_S).toFixed(2)}%`, (Array_NoCache_E - Array_NoCache_S) - (Array_Cache_E - Array_Cache_S))}
        String1: Cache ${resultWord((String1_NoCache_E - String1_NoCache_S) - (String1_Cache_E - String1_Cache_S))} in percent: ${colorString(`${relDiff(String1_NoCache_E - String1_NoCache_S, String1_Cache_E - String1_Cache_S).toFixed(2)}%`, (String1_NoCache_E - String1_NoCache_S) - (String1_Cache_E - String1_Cache_S))}
        String2: Cache ${resultWord((String2_NoCache_E - String2_NoCache_S) - (String2_Cache_E - String2_Cache_S))} in percent: ${colorString(`${relDiff(String2_NoCache_E - String2_NoCache_S, String2_Cache_E - String2_Cache_S).toFixed(2)}%`, (String2_NoCache_E - String2_NoCache_S) - (String2_Cache_E - String2_Cache_S))}`)
        }
    } else {
        console.log(MAX_INT + "Failed, not matching results...")
    }

}

for (let z = 0; z < MAX_INT_LIST.length; z++) {
    Benchmark(MAX_INT_LIST[z], CONTROL_INT_LIST[z])
}