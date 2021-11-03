//https://cwe.mitre.org/data/definitions/416.html

const getPotentialMitigations = require("./getPotentialMitigations");
const findFunctions = require("./findFunctions");
const isComment = require("../comment/isComment");
const determinePotentialErrors = require('./determinePotentialErrors')

let issueNumber = 416
const storeForRemove = []
const checkForReassignment = (single, data) => {
    const regex = new RegExp(`${single.varName}\\s*=[a-zA-Z0-9\\s]`)
    if(data[single.usage - 1].match(regex)){
        storeForRemove.push(single)
        return false
    }
    return true
}

const cwe_416 = (data, comments) => {
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


    errors.lineNumbers = findErrors(potentialErrors, data)
        .filter(single => checkForReassignment(single, data)) //checks if a variable was re-assigned and if so, the line with the initial free will be stored

    for(let i = 0;i < storeForRemove.length;++i){
        for(let j = 0 ; j < errors.lineNumbers.length; ++j){
            if(storeForRemove[i].free === errors.lineNumbers[j].free && storeForRemove[i].usage < errors.lineNumbers[j].usage){
                errors.lineNumbers.splice(j, 1)
                j--
            }
        }
    }
    errors.text = `In the following lines an error occurred: ${errors.lineNumbers.map(single => `free in line ${single.free} and the variable was reused in line ${single.usage}`).join()}`


    return errors
}

const findErrors = (potentialErrors, data) => {
    let result = []
    let regexp = /[A-Za-z0-9_]/gi;
    for(let i=0;i<potentialErrors.length;++i){
        potentialErrors[i] = determinePotentialErrors(data, i, potentialErrors)
        for(let j = potentialErrors[i].lineNumber + 1;j<potentialErrors[i].end;++j){
            try {
                let regex = new RegExp(`${potentialErrors[i].varName}`, 'g')
                if (data[j].match(regex)) {
                    let start = regex.exec(data[j])
                    let end = start.index + potentialErrors[i].varName.length
                    let indexBefore = data[j][start.index - 1]
                    let indexAfter = data[j][end]
                    if (((indexBefore !== undefined && !indexBefore.match(regexp)) || indexBefore === undefined) && ((indexAfter !== undefined && !indexAfter.match(regexp)) || indexAfter === undefined)) {
                        result.push({free: potentialErrors[i].lineNumber + 1, usage: j + 1, varName: potentialErrors[i].varName})
                    }
                }
            } catch (e){
                console.log(potentialErrors[i].varName)
            }
        }
    }
    return result
}

module.exports = cwe_416