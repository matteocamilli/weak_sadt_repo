//https://cwe.mitre.org/data/definitions/468.html

const getPotentialMitigations = require("./getPotentialMitigations");
const dataTypes = require('./cwe_467_listOfDataTypes')
const isComment = require("../comment/isComment");
const findVariableDeclarations = require('./findVariableDeclarations')

let issueNumber = 468

const cwe_468 = (data, comments) => {
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": '',
        "lineNumbers": [],
        "issueNumber": issueNumber
    }

    let variables = findVariableDeclarations(data, dataTypes, {start: 0, end: data.length -1} )
    let regexForPointerSpace = /\s*\(\s*.*\s*\*\)\(.*\s*\+\s*.*\)/g
    for(let i = 0; i < variables.length;++i){
        let line = data[variables[i].lineNumber - 1]
        let assignedValue = line.split("=")[1]
        if(assignedValue && doesNotContain(assignedValue , ['malloc'])){
            if(assignedValue.match(regexForPointerSpace) && !isComment(variables[i].lineNumbers, comments.comments.lineComments, comments.comments.blockComments)){
                errors.lineNumbers.push(variables[i].lineNumber)
            }
        }
    }

    errors.text = `In the following lines an error occurred: ${errors.lineNumbers.map(single => `in line ${single} the pointer was addressed wrongly`).join()}`

    return errors
}

const doesNotContain = (assignedValue, functionList) =>{
    return functionList.filter(single => assignedValue.includes(single)).length === 0
}

module.exports = cwe_468