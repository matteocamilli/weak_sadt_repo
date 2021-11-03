//https://cwe.mitre.org/data/definitions/415.html

const getPotentialMitigations = require("./getPotentialMitigations");
const findFunctions = require("./findFunctions");
const isComment = require("../comment/isComment");
const determinePotentialErrors = require('./determinePotentialErrors')

let issueNumber = 415

const cwe_415 = (data, comments) => {
    let potentialErrors = findFunctions(data, ['free'])
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": '',
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    //checks if a line where free is in use is a comment.
    //and simplifies the structure, the indicator gets lost but as it is only free it does not matter
    potentialErrors = potentialErrors
        .filter(single => !isComment(single.lineNumber, comments.comments.lineComments, comments.comments.blockComments))
        .map(single => {return {lineNumber:single.lineNumber - 1, indicator: single.indicator}})


    for(let i=0;i<potentialErrors.length;++i){
        potentialErrors[i] = determinePotentialErrors(data, i, potentialErrors)
    }
    try {
        for (let i = 0; i < potentialErrors.length; ++i) {
            for (let j = 0; j < potentialErrors.length; ++j) {
                if (j !== i) {
                    if (
                        potentialErrors[i].varName === potentialErrors[j].varName
                        &&
                        potentialErrors[j].lineNumber >= potentialErrors[i].start
                        &&
                        potentialErrors[j].lineNumber <= potentialErrors[i].end
                    ) {
                        errors.lineNumbers.push({
                            free: potentialErrors[i].lineNumber,
                            freeSecond: potentialErrors[j].lineNumber
                        })
                        potentialErrors.splice(i, 1)
                        potentialErrors.splice(j - 1, 1)
                    }
                }
            }
        }
    } catch (e) {}

    errors.text = `In the following lines an error occurred: ${errors.lineNumbers.map(single => `free in line ${single.free} and in line ${single.freeSecond} the variable was freed again`).join()}`

    return errors
}

module.exports = cwe_415