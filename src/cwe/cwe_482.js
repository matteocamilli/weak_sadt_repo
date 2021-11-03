//https://cwe.mitre.org/data/definitions/482.html

const getPotentialMitigations = require("./getPotentialMitigations");
const findIndicators = require("./findIndicators");
const indicators = require("./cwe_483_wordList");
const isComment =require("../comment/isComment");

let issueNumber = 482

const checkForAssigment = (single, data) => {
    let regex = new RegExp(`=.*${single.sign}`)
    return data[single.lineNumber - 1].match(regex) ? false : true
}

const checkForReturn = (single, data) => {
    return !data[single.lineNumber - 1].includes("return")
}
const cwe_482 = (data, comments) => {

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "In the following lines was an comparing instead of assigning found:",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    let possibleErrors481 = findIndicators(data, comments, indicators)
    let possibleErrors = findSigns(data, ['=='])

    for(let j = 0 ; j < possibleErrors481.length; ++j){
        for(let i = 0 ; i < possibleErrors.length ; ++i){
            if(possibleErrors[i].lineNumber === possibleErrors481[j].lineNumber){
                possibleErrors.splice(i, 1)
                i -= 1
            }
        }
    }
    errors.lineNumbers = possibleErrors
        .filter(single => !isComment(single.lineNumber, comments.comments.lineComments, comments.comments.blockComments))
        .filter(single => checkForAssigment(single, data))
        .filter(single => checkForReturn(single, data))

    errors.text += errors.lineNumbers.map(single => ` in line ${single.lineNumber}`).join(', ')
    errors.lineNumbers = errors.lineNumbers.map(single => single.lineNumber)

    return errors
}

const findSigns = (data, indicator) => {
    let result = []//{lineNumber: number, sign: string}
    for(let i = 0;i<data.length;++i){
        for(let j=0;j < indicator.length;++j){
            if(data[i].includes(indicator[j])){
                result.push({
                    lineNumber: i + 1,
                    sign: indicator[j]
                })
            }
        }
    }
    return result
}

module.exports = cwe_482