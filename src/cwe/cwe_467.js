const getPotentialMitigations = require("./getPotentialMitigations");
const findFunctions = require("./findFunctions");
const dataTypes = require('./cwe_467_listOfDataTypes')
const findUpperCodeBlock = require('../comment/findUpperCodeBlock')
const isComment = require("../comment/isComment");
const findVariableDeclarations = require('./findVariableDeclarations')

let issueNumber = 467


const cwe_467 = (data, comment) => {

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }

    let possibleProblems = findFunctions(data, ['sizeof']).map(single => single.lineNumber - 1) //subtract 1, because the result is not in the corresponding array entry
    let result = []
    for (let i = 0; i < possibleProblems.length; ++i) {
        let codeBlock = findUpperCodeBlock(possibleProblems[i], data)

        let variableDeclarations = findVariableDeclarations(data, dataTypes, codeBlock)
        let line = data[possibleProblems[i]]
        result.push(matchFunctionAndVariable(line, possibleProblems[i], variableDeclarations))
        //console.log(result)

    }


    errors.lineNumbers = result
        .filter(single => single.length > 0)
        .flat()
        .map(single => single.lineNumber)
        .filter(single => !isComment(single, comment.comments.lineComments, comment.comments.blockComments))

    let text = result
        .filter(single => single.length > 0)
        .flat()
        .map(single => `in line ${single.lineNumber} the variable ${single.varName}`)
        .join(', ')

    errors.text = `In the following lines the sizeof function was male used: ${text}`


    return errors
}

const matchFunctionAndVariable = (line, lineNumber, vars) => {
    let result = []//{lineNumber: number, dataType: string}


    let after = line.split('sizeof')[1]
    let end
    for (let i = 1; i < after.split('').length; ++i) {
        if (after[i] === ')') {
            end = i
            break
        }
    }


    let varName = after.split('').filter((single, index) => index >= 1 && index < end).join('')
    if (vars.filter(single => single.variable === varName).length === 0 && !varName.includes('*')) {
        result.push({
            lineNumber: lineNumber + 1,
            varName
        })
    }

    return result
}

module.exports = cwe_467