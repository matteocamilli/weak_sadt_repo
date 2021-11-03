const isComment = require('../comment/isComment')
const getPotentialMitigations = require('./getPotentialMitigations')
const findPrivateVars = require('./findPrivateVars')

let issueNumber = 375

const cwe_375 = (data, comment) => {

    let pvars = findPrivateVars(data)
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let weaknesses = findErrors(data, pvars)
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line(s) a mutable data was returned to an untrusted caller: ${weaknesses.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": weaknesses.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_375

const findErrors = (data, pvars) => {
    let result = [] //varname and lineNumber
    for(let key in data){
        if(data[key].match(/return\s/)){
            let split = data[key]
                .replace(';', '')
                .split(/\s/)
                .filter(single => single !== '')
            if(pvars.filter(single => single.varName === split[1]).length > 0){
                result.push({
                    'varname': split[1],
                    'lineNumber': key + 1
                })
            }
        }
    }
    return result
}