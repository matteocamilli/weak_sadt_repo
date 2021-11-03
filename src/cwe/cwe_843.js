//https://cwe.mitre.org/data/definitions/843.html

const getPotentialMitigations = require( "./getPotentialMitigations");
const findVariableDeclarations = require( "./findVariableDeclarations");
const dataTypes = require( "./cwe_467_listOfDataTypes");
const findErrorsSignAndUnsignConversionError = require( "./findErrorsSignAndUnsignConversionError");
const removeunsigned = require( "./removeunsigned");

let issueNumber = 843

const cwe_843 = (data, comment) => {
    let errorsFound = findErrorsSignAndUnsignConversionError(data, comment, findVariableDeclarations(data, dataTypes, {start: -1, end: -1}))
    errorsFound = removeunsigned(errorsFound)

    let group = [['char'], ['short', 'int', 'double', 'float']]
    let lineNumbers = []
    for(let i = 0 ; i < errorsFound.length; ++i){
        let dest = errorsFound[i].dest
        let source = errorsFound[i].source
        let destIndex
        let sourceIndex
        for(let j = 0 ; j < group.length; ++j){
            if(group[j].includes(dest)){
                destIndex = j
            }
        }

        for(let j = 0 ; j < group.length; ++j){
            if(Array.isArray(source)){
                if (group[j].includes(source[0])){
                    sourceIndex = j
                }
            }else {
                if (group[j].includes(source)) {
                    sourceIndex = j
                }
            }
        }
        if(destIndex !== sourceIndex){
            lineNumbers.push(errorsFound[i].lineNumber)
        }
    }


    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a type confusion was detected: ${lineNumbers.map(single => `in line ${single}`).join(', ')}`,
        "lineNumbers": lineNumbers,
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_843