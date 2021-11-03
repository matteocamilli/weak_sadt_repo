//https://cwe.mitre.org/data/definitions/188.html

const getPotentialMitigations = require('./getPotentialMitigations')
const isComment = require('../comment/isComment')

let issueNumber = 188

const cwe_188 = (data, comments) => {

    let errorsFound = findErrors(data, comments)

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a violation on reliance on data/memory layout was detected: ${errorsFound.map(single => `on line ${single}`).join(', ')}`,
        "lineNumbers": errorsFound,
        "issueNumber": issueNumber
    }

    return errors
}

const findErrors = (data, comment) => {
    let result = [] //numbers
    let regex = new RegExp('\\*\\(&[a-zA-Z0-9]*\\s*[+|-]\\s[a-zA-Z0-9]*\\s*\\)\\s*=\\s*[a-zA-Z0-9]*;an', 'g')
    for(let line in data){
        if(!isComment(line, comment.comments.lineComments, comment.comments.blockComments)){
            let match = regex.exec(data[line])
            if ( match ) {
                result.push(line + 1)
            }
        }
    }
    return result
}

module.exports = cwe_188