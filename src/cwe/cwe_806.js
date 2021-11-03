//https://cwe.mitre.org/data/definitions/806.html

const functionArguments = require('./functionArguments')
const findFunctions = require('./findFunctions')
const isComment = require('../comment/isComment')

let issueNumber = 806

const cwe_806 = (data, comment) => {

    let errorsFound = findErrors(data, comment, findFunctions(data, ['strncpy']))
    let errors = {
        "mitigation": "Phase: Architecture and Design\n" +
            "\n" +
            "Use an abstraction library to abstract away risky APIs. Examples include the Safe C String Library (SafeStr) by Viega, and the Strsafe.h library from Microsoft. This is not a complete solution, since many buffer overflows are not related to strings.\n" +
            "Phase: Build and Compilation\n" +
            "\n" +
            "Use automatic buffer overflow detection mechanisms that are offered by certain compilers or compiler extensions. Examples include StackGuard, ProPolice and the Microsoft Visual Studio /GS flag. This is not necessarily a complete solution, since these canary-based mechanisms only detect certain types of overflows. In addition, the result is still a denial of service, since the typical response is to exit the application.\n" +
            "Phase: Implementation\n" +
            "\n" +
            "Programmers should adhere to the following rules when allocating and managing their applications memory: Double check that your buffer is as large as you specify. When using functions that accept a number of bytes to copy, such as strncpy(), be aware that if the destination buffer size is equal to the source buffer size, it may not NULL-terminate the string. Check buffer boundaries if calling this function in a loop and make sure there is no danger of writing past the allocated space. Truncate all input strings to a reasonable length before passing them to the copy and concatenation functions\n" +
            "Phase: Operation\n" +
            "\n" +
            "Strategy: Environment Hardening\n" +
            "\n" +
            "Run or compile the software using features or extensions that randomly arrange the positions of a program's executable and libraries in memory. Because this makes the addresses unpredictable, it can prevent an attacker from reliably jumping to exploitable code.\n" +
            "Examples include Address Space Layout Randomization (ASLR) [REF-58] [REF-60] and Position-Independent Executables (PIE) [REF-64].\n" +
            "Effectiveness: Defense in Depth\n" +
            "\n" +
            "Note: This is not a complete solution. However, it forces the attacker to guess an unknown value that changes every program execution. In addition, an attack could still cause a denial of service, since the typical response is to exit the application.\n" +
            "Phase: Operation\n" +
            "\n" +
            "Strategy: Environment Hardening\n" +
            "\n" +
            "Use a CPU and operating system that offers Data Execution Protection (NX) or its equivalent [REF-60] [REF-61].\n" +
            "Effectiveness: Defense in Depth\n" +
            "\n" +
            "Note: This is not a complete solution, since buffer overflows could be used to overwrite nearby variables to modify the software's state in dangerous ways. In addition, it cannot be used in cases in which self-modifying code is required. Finally, an attack could still cause a denial of service, since the typical response is to exit the application.\n" +
            "Phases: Build and Compilation; Operation\n" +
            "\n" +
            "Most mitigating technologies at the compiler or OS level to date address only a subset of buffer overflow problems and rarely provide complete protection against even that subset. It is good practice to implement strategies to increase the workload of an attacker, such as leaving the attacker to guess an unknown value that changes every program execution.",
        "text": `In the following lines the buffer size is calculated with the buffer source size: ${errorsFound.map(single => `in line ${single}`).join(', ')}`,
        "lineNumbers": errorsFound,
        "issueNumber": issueNumber
    }

    return errors
}

const findErrors = (data, comment, possibleErrors) => {
    let result = []
    for(let i = 0 ; i < possibleErrors.length; ++i){
        if(!isComment(possibleErrors[i].lineNumber, comment.comments.lineComments, comment.comments.blockComments)){
            let split = functionArguments(data[possibleErrors[i].lineNumber - 1], 'strncpy')
            let start = 0
            let end = 0
            let count = 0
            for(let j = 0 ; j < split.length; ++j){
                if(split[j] === '(' && count === 0){ count++; start = j + 1}
                else if(split[j] === '(' && count > 0){ count++;}
                else if(split[j] === ')' && count > 1){ count--;}
                else if(split[j] === ')' && count === 1){ end = j; break;}
            }
            let dest = split.slice(start, end).join('').split(',')[0]
            //let source = split.slice(start, end).join('').split(',')[1]
            let size = split.slice(start, end).join('').split(',')[2]
            let regex = new RegExp(`sizeof\\(${dest}\\)`)
            let match = size.match(regex)
            if(match === null){
                result.push(possibleErrors[i].lineNumber)
            }
        }
    }
    return result
}

module.exports = cwe_806