//https://cwe.mitre.org/data/definitions/242.html
//https://cwe.mitre.org/data/definitions/676.html

const getPotentialMitigations = require('./getPotentialMitigations')
const cwe676242WordList = require('./cwe_676_242_wordlist')
const isComment = require('./../comment/isComment')
const findFunctions = require('./findFunctions')


const issueNumber = 676
const issueNumberMerge = 242


const cwe_676_242 = (data, comment) => {
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "",
        "lineNumbers": [],
        "issueNumber": `${issueNumber} and ${issueNumberMerge}`
    }

    errors.mitigation.push(getPotentialMitigations(issueNumberMerge))
    errors.mitigation = errors.mitigation.flat()


    let prohibitedFunctions = findFunctions(data, cwe676242WordList)
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    errors.text = `In the following lines was one or more prohibited functions found: ${prohibitedFunctions.map(single => `in line: ${single.lineNumber} function: ${single.functionName}`).join(', ')}`

    errors.lineNumbers = prohibitedFunctions.map(single => single.lineNumber)


    return errors
}




module.exports = cwe_676_242