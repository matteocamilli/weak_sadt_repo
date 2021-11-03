//https://cwe.mitre.org/data/definitions/587.html

const getPotentialMitigations = require("./getPotentialMitigations");
const findVariableDeclarations = require("./findVariableDeclarations");
const dataTypes = require("./cwe_467_listOfDataTypes");
const isComment = require("../comment/isComment");


let issueNumber = 587

const cwe_587 = (data, comment) => {
    let errorsFound = findErrors(data, comment, findVariableDeclarations(data, dataTypes, {end: -1, start: -1}))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line a fixed address was assignt to a point: ${errorsFound.map(single => `in line ${single}`).join(", ")}`,
        "lineNumbers": errorsFound,
        "issueNumber": issueNumber
    }

    return errors
}
const findErrors = (data, comment, variables) => {
    let result = []
    for(let i = 0 ; i < variables.length; ++i){
        let line = data[variables[i].lineNumber - 1]
        if(!isComment(variables[i].lineNumber -1, comment.comments.lineComments, comment.comments.blockComments) && line.split('=')[1] !== undefined){
            let assignedValue = line.split('=')[1].replace(/\s/g, '').replace(';', '')
            let regex = new RegExp('[0-9][a-x0-9]+')
            let match = assignedValue.match(regex)
            if(match !== null && match[0].length === assignedValue.length && assignedValue.match('[a-z]+')){
                result.push(variables[i].lineNumber)
            }
        }
    }


    return result
}

module.exports = cwe_587