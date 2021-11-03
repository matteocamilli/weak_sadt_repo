const getPotentialMitigations = require("./getPotentialMitigations");
const findFunctions = require("./findFunctions");
const findUpperCodeBlock = require("../comment/findUpperCodeBlock");
const isComment = require("../comment/isComment");

let issueNumber = 401

const cwe_401 = (data, comment) => {


    let errors = {
        "mitigation": 'Phase: Implementation\n' +
            'Choose a language or tool that provides automatic memory management, or makes manual memory management less error-prone.\n' +
            'For example, glibc in Linux provides protection against free of invalid pointers.\n' +
            'When using Xcode to target OS X or iOS, enable automatic reference counting (ARC) [REF-391].\n' +
            'To help correctly and consistently manage memory when programming in C++, consider using a smart pointer class such as std::auto_ptr (defined by ISO/IEC ISO/IEC 14882:2003), std::shared_ptr and std::unique_ptr (specified by an upcoming revision of the C++ standard, informally referred to as C++ 1x), or equivalent solutions such as Boost.\n' +
            '\n' +
            'Phase: Architecture and Design\n' +
            'Use an abstraction library to abstract away risky APIs. Not a complete solution.\n' +
            '\n' +
            'Phases: Architecture and Design; Build and Compilation\n' +
            'The Boehm-Demers-Weiser Garbage Collector or valgrind can be used to detect leaks in code.',
        "text": "",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }

    let mallocUsed = findFunctions(data, ['malloc'])
    //finds the corresponding upper (outer) code block to the line where the malloc function was used
    mallocUsed.map(single => single.codeBlock = findUpperCodeBlock(single.lineNumber, data))

    for (let i = 0; i < mallocUsed.length; ++i) {
        if (mallocUsed[i].codeBlock.start === -1) mallocUsed[i].codeBlock.start = 0
        if (mallocUsed[i].codeBlock.end === -1) mallocUsed[i].codeBlock.end = data.length
    }

    let pointer = mallocUsed.map(single => findPointer(data, single.lineNumber - 1))

    let freeUsed = findFunctions(data, ['free'])
    
    errors.lineNumbers = mallocUsed
        .map(single => single.lineNumber)
        .filter(single => !isComment(single, comment.comments.lineComments, comment.comments.blockComments))
    errors.text = `In the following line memory was allocated but never freed: ${mallocUsed.map(single => `in line ${single.lineNumber}`).join(', ')}`
    return errors
}

const findVarName = (data, lineNumber) => {
    let line = data[lineNumber]

    console.log(line)

    return
}

const findPointer = (data, lineNumber) => {
    let line = data[lineNumber]
    return line.split('=')[0].split('*')[1] && line.split('=')[0].split('*')[1].replace(' ', '')
}

module.exports = cwe_401