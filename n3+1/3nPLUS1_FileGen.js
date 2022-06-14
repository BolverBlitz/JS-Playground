const MegaHash = require('megahash');
const fs = require("fs");
const readline = require('readline');

const S_Cache = new MegaHash();

/**
 * Question that needs to be answered
 * @param {String} query 
 * @returns 
 */
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

/**
 * Checks if a BigInt is a odd number
 * @param {BigInt} num 
 * @returns 
 */
function isOdd(num) { return num % 2n; }

function calculate(MAX_INT) {
    const Calculation_Start = performance.now();
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

            const Cache_Sequenze = S_Cache.get(C_Number)

            if (Cache_Sequenze !== undefined) {
                const Cached_Numbers = Cache_Sequenze.split("-")
                for (let y = 0; y < Cached_Numbers.length; y++) {
                    C_Cache.push(Cached_Numbers[y])
                }
                break;
            }
        }

        S_Cache.set(i, C_Cache.join("-"))
    }
    const Calculation_Stop = performance.now();

    for (let i = 0n; i < MAX_INT; i++) {
        const Cache_Sequenze = S_Cache.get(i);
        if (Cache_Sequenze !== undefined) {
            const Cache_Sequenze_Length = Cache_Sequenze.split("-").length;
            console.log(`${i} -${Cache_Sequenze_Length}-> ${Cache_Sequenze}`);
        }
    }
}

(async function () {
    const MAX_INT = await askQuestion("Enter the max integer: ");
    calculate(MAX_INT + 1);
})();