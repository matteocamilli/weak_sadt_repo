const getPotentialMitigations = require("./getPotentialMitigations");
const findFunctions = require("./findFunctions");
const functionArguments = require("./functionArguments");


let issueNumber = 560

const cwe_560 = (data, comments) => {

    let errorsFound = findErrors(data, comments, findFunctions(data, ['umask']))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the function umask was with chmod-style argument used: ${errorsFound.map(single => `in line ${single}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

const findErrors = (data, comments, umasks) => {
    let result = []
    for(let i = 0 ; i < umasks.length; ++i){
        let fArguments = functionArguments(data[umasks[i].lineNumber - 1], 'umask').join('')
        if(fArguments.split(',').length > 1){
            result.push(umasks[i].lineNumber)
        }
    }
    return result
}

module.exports = cwe_560