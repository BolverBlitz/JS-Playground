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

/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
 function humanFileSize(bytes, si=false, dp=2) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }

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

        const result =S_Cache.set(i, C_Cache.join("-"))
        if (!result) {
            throw new Error("Failed to write to MegaHash: Out of memory");
        }

    }
    const Calculation_Stop = performance.now();
}

(async function () {
    const MAX_INT = await askQuestion("Enter the max integer: ");
    calculate(MAX_INT + 1);
    console.log(`\n\nCalculated: ${S_Cache.stats().numKeys} number sequences.\nThis required ${humanFileSize(S_Cache.stats().dataSize, true)} of RAM.\nThe index is ${humanFileSize(S_Cache.stats().indexSize, true)} of RAM.\n\n`);

    for (let i = 0n; i < MAX_INT; i++) {
        const Cache_Sequenze = S_Cache.get(i);
        if (Cache_Sequenze !== undefined) {
            const Cache_Sequenze_Length = Cache_Sequenze.split("-").length;
            fs.appendFileSync("Sequenze.txt", `${i}-${Cache_Sequenze_Length}-${Cache_Sequenze}\n`);
        }
    }

    console.log(`Saved to Sequenze.txt\n\nNUMBER-LENGTH-SEQUENZE-SEQUENZE\n`);
})();