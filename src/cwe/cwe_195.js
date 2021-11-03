const getPotentialMitigations = require("./getPotentialMitigations");
const dataTypes = require('./cwe_467_listOfDataTypes')
const findVariableDeclarations = require('./findVariableDeclarations')
const findErrorsSignAndUnsignConversionError = require("./findErrorsSignAndUnsignConversionError")

let issueNumber = 195

const cwe_195 = (data, comment) => {


    let errorsFound = findErrorsSignAndUnsignConversionError(data, comment, findVariableDeclarations(data, dataTypes, {start: -1, end: -1}))
    let lineNumbers = []
    for(let i = 0 ; i < errorsFound.length ; ++i) {
        if(errorsFound[i].dest.includes('unsigned')){
            if(Array.isArray(errorsFound[i].source)){
                if(errorsFound[i].source.filter(single => single.includes('unsigned')).length === 0){
                    lineNumbers.push(errorsFound[i])
                }
            }
            else {
                if(!errorsFound[i].source.includes('unsigned')){
                    lineNumbers.push(errorsFound[i])
                }
            }
        }
    }
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a conversions error from signed to unsigned was detected: ${lineNumbers.map(single => `in line ${single.lineNumber}`).join(', ')}`,
        "lineNumbers": lineNumbers.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }
    return errors
}