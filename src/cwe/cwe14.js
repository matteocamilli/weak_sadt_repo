//https://cwe.mitre.org/data/definitions/14.html

const getPotentialMitigations = require('./getPotentialMitigations')
const findFunctions = require('./findFunctions')

let issueNumber = 14

const cwe_14 = (data) => {

    let errorsFound = findFunctions(data, ['memset'])

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command chroot was used: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_14