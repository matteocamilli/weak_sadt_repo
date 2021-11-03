// https://cwe.mitre.org/data/definitions/478.html
const isComment = require('../comment/isComment')
const getPotentialMitigations = require('./getPotentialMitigations')
const findSwitch = require('./findSwitch')

const issueNumber = 478

const cwe_478 = (data, comment) => {
    let possibleError = findSwitch(data)

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    if (possibleError.length > 0) {
        for (let i = 0; i < possibleError.length; ++i) {
            let index = possibleError[i] - 1
            let indexNext = i < possibleError.length - 1 ? possibleError[i + 1] : data.length - 1
            let join = data
                .slice(index, indexNext)
                .join('')
            if (join.match(/(switch\s*\(\s*.*\s*\)\s*{.*default:.*(\s*.*{(\s*|.*){(.*)}(\s*|.*)})?})/g) === null) {
                //wrong switch found
                if(!isComment(possibleError[i], comment.comments.lineComments, comment.comments.blockComments)) {
                    errors.lineNumbers.push(possibleError[i])
                }
            }
        }
    }

    errors.text = `In the following lines ${errors.lineNumbers.join(', ')} the error was detected!`

    return errors
}

module.exports = cwe_478