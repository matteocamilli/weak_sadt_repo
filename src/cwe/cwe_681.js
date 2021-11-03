//https://cwe.mitre.org/data/definitions/681.html

const getPotentialMitigations = require("./getPotentialMitigations");
const findVariableDeclarations = require("./findVariableDeclarations");
const dataTypes = require("./cwe_467_listOfDataTypes");
const findErrorsSignAndUnsignConversionError = require("./findErrorsSignAndUnsignConversionError");
const removeunsigned = require('./removeunsigned')

let issueNumber = 681

const cwe_681 = (data, comment) => {
    let errorsFound = findErrorsSignAndUnsignConversionError(data, comment, findVariableDeclarations(data, dataTypes, {start: -1, end: -1}))
    let lineNumbers = []
    let potentialLineNumbers = []
    //remove unsigned information, the conversion problems from unsigned to signed and vice versa are covered in the issue 195/196
    errorsFound = removeunsigned(errorsFound)
    //short < int < float < double
    let order = ['short', 'int', 'float', 'double']

    for(let i = 0 ; i < errorsFound.length; ++i){
        let destIndex = order.indexOf(errorsFound[i].dest)
        let sourceIndex = -1
        let percent = 0
        if(Array.isArray(errorsFound[i].source)){
            let tmp = 0
            for(let j = 0 ; j < errorsFound[i].source.length ; ++j){
                if(sourceIndex < order.indexOf(errorsFound[i].source[j])){
                    tmp += 1
                }
            }
            percent = tmp/errorsFound[i].source.length
        } else {
            sourceIndex = order.indexOf(errorsFound[i].source)
        }

        if(destIndex < sourceIndex){ //for the normal case a = b
            lineNumbers.push(errorsFound[i])
        } else if(percent === 1){ //for the case where all possibilities are in a higher order on the right than the left
            lineNumbers.push(errorsFound[i])
        } else if(percent < 1){ //for the case where some of the possibilities are in a higher order on the right than the left
            potentialLineNumbers.push(errorsFound[i])
        }
    }
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a conversions error was detected: ${lineNumbers.map(single => `in line ${single.lineNumber}`).join(', ')}. 
        In the following lines a conversion error could be: ${potentialLineNumbers.map(single => `in line ${single.lineNumber}`).join(', ')}.`,
        "lineNumbers": lineNumbers.map(single => single.lineNumber),
        "potentialLineNumbers": potentialLineNumbers.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_681