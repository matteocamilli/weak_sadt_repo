//https://cwe.mitre.org/data/definitions/375.html

const isComment = require('../comment/isComment')
const getPotentialMitigations = require('./getPotentialMitigations')
const findPrivateVars = require('./findPrivateVars')

let issueNumber = 374

const cwe_374 = (data, comment) => {

    let pVars = findPrivateVars(data)
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let usage = findUsage(data, pVars)
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a private variable is passed to an untrusted caller: ${usage.map(single => single).join(", ")}`,
        "lineNumbers": usage,
        "issueNumber": issueNumber
    }
    return errors
}

const findUsage = (data, pVars) => {
    let result = []
    for(let i in pVars) {
        for(let key in data){
            if(data[key].includes(pVars[i].varName) && data[key].match(`.*\\(.*${pVars[i].varName}.*\\)`)){
                let before = data[key][data[key].indexOf(pVars[i].varName) - 1]
                let after = data[key][data[key].indexOf(pVars[i].varName) + pVars[i].varName.length]
                let regex = new RegExp('[^a-zA-Z0-9]')
                if(before.match(regex) && after.match(regex)){
                    result.push( parseInt(key) + 1)
                }
            }
        }
    }
    return result
}

module.exports = cwe_374