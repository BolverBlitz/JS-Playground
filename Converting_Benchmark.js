const TestIterations = [10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
const PossibleKeyStatus = ['ava', 'unk', 'gif', 'use'];
const PossibleKeyStatusObj = {'ava': 1, 'unk': 2, 'gif': 3, 'use': 4};

const convertStatusToNumber1 = (status) => {
    switch (status) {
        case 'ava':
            return 1;
        case 'unk':
            return 2;
        case 'gif':
            return 3;
        case 'use':
            return 4;
    }

    return PossibleKeyStatus.indexOf(status) + 1;
}

const convertStatusToNumber2 = (status) => {
    return PossibleKeyStatus.indexOf(status) + 1;
}

const convertStatusToNumber3 = (status) => {
    return PossibleKeyStatusObj.status;
}

for (a = 0; a < TestIterations.length; a++) {
    console.time(`V1 ${TestIterations[a]}`)
    for (i = 0; i < TestIterations[a]; i++) {
        for (j = 0; j < PossibleKeyStatus.length; j++) {
            convertStatusToNumber1(PossibleKeyStatus[j]);
        }
    }
    console.timeEnd(`V1 ${TestIterations[a]}`)
}

for (a = 0; a < TestIterations.length; a++) {
    console.time(`V2 ${TestIterations[a]}`)
    for (i = 0; i < TestIterations[a]; i++) {
        for (j = 0; j < PossibleKeyStatus.length; j++) {
            convertStatusToNumber2(PossibleKeyStatus[j]);
        }
    }
    console.timeEnd(`V2 ${TestIterations[a]}`)
}

for (a = 0; a < TestIterations.length; a++) {
    console.time(`V3 ${TestIterations[a]}`)
    for (i = 0; i < TestIterations[a]; i++) {
        for (j = 0; j < PossibleKeyStatus.length; j++) {
            convertStatusToNumber3(PossibleKeyStatus[j]);
        }
    }
    console.timeEnd(`V3 ${TestIterations[a]}`)
}