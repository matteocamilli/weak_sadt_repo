// https://cwe.mitre.org/data/definitions/484.html

const getPotentialMitigations = require("./getPotentialMitigations");
const findSwitch = require("./findSwitch");
const isComment = require("../comment/isComment");

const issueNumber = 484

const cwe_484 = (data, comment) => {
    let possibleError = findSwitch(data)

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "",
        "lineNumbersInformation": [],
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
            let defaultCase = join.split('default')[1]
            let cases = join.split('default')[0].split('case')

            if (defaultCase !== undefined) cases.push(defaultCase)
            let count = 0
            for (let j = 1; j < cases.length; ++j) {
                if (!cases[j].includes('break;')) {
                    ++count;
                }
            }
            if (count > 0 && !isComment(possibleError[i], comment.comments.lineComments, comment.comments.blockComments)) {
                errors.lineNumbersInformation.push({
                    "switchLine": possibleError[i],
                    "breakCount": count
                })
                errors.lineNumbers.push(possibleError[i])
            }
        }
    }

    errors.text = `In the following lines (switch statements) where found one or more error ${errors.lineNumbersInformation.map(single => `${single.switchLine} (${single.breakCount} error${single.breakCount > 0 ? 's' : ''})`).join(', ')}`

    return errors
}

module.exports = cwe_484