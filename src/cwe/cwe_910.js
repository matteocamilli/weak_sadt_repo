//https://cwe.mitre.org/data/definitions/910.html

const getPotentialMitigations = require( "./findIssue");
const findFunctions = require( "./cwe_676_242");
const open = require( './cwe_910_open')
const close = require( './cwe_910_close')
const dataTypes = require( "./cwe_467_listOfDataTypes");
const findUpperCodeBlock = require( "../comment/findUpperCodeBlock");

let issueNumber = 910

const cwe_910 = (data, comment) => {
    let foundErrors = findErrors(data, comment)
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines an expired file descriptor is in use: ${foundErrors.map( single => `in line ${single}`).join(', ')}`,
        "lineNumbers": foundErrors,
        "issueNumber": issueNumber
    }

    return errors
}

const findErrors = (data, commment) => {
    let result = []
    let varNames = findVarNames(data, commment, findFunctions(data, open))
    for( let i = 0 ; i < varNames.length; ++i){
        let start = varNames[i].closingLing
        let end = varNames[i].codeBlock.upper.end > -1 ? varNames[i].codeBlock.upper.end : data.length
        let regex = new RegExp(`[^a-zA-Z0-9]${varNames[i].varName}[^a-zA-Z0-9]`)
        for(let j = start ; j < end; ++j){
            let match = regex.exec(data[j])
            if(match !== null){
                result.push(j + 1)
            }
        }
    }
    return result
}

const findVarNames = (data, comment, openFunctions) => {
    let result = [] // {varName: string, line: number, cobeblock: codeblock, closingLine: number}
    for(let key in openFunctions){
        let varName = data[openFunctions[key].lineNumber - 1].split('=')[0]
        for(let i = 0 ; i < dataTypes.length; ++i){
            if(varName.includes(dataTypes[i])){
                varName = varName.replace(dataTypes[i], '')
            }
        }
        varName = varName.replace(/\s/g, '')
        result.push({
            varName,
            line: openFunctions[key].lineNumber,
            codeBlock:{
                upper: findUpperCodeBlock(openFunctions[key].lineNumber-1, data)
            },
            closingLing: findClosingLine(data, comment, findFunctions(data, close), varName)

        })
    }
    return result
}
const findClosingLine = (data, comment, closingFunction, varName) => {
    let result = null
    for(let i = 0 ; i < closingFunction.length; ++i){
        let regex = new RegExp(`\\s*.*${closingFunction[i].functionName}\\(\\s*.*${varName}`)
        let match = regex.exec(data[closingFunction[i].lineNumber - 1])
        if(match !== null){
            result = closingFunction[i].lineNumber
        }
    }
    return result
}

modules.exports = cwe_910