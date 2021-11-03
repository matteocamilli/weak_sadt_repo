//https://cwe.mitre.org/data/definitions/690.html

const getPotentialMitigations = require("./getPotentialMitigations");
const findVariableDeclarations = require("./findVariableDeclarations");
const dataTypes = require("./cwe_467_listOfDataTypes");
const isComment = require("../comment/isComment");
const findUpperCodeBlock = require("../comment/findUpperCodeBlock");

let issueNumber = 690

const cwe_690 = (data, comment) => {

    //finds var declarations
    let varDeclaration = findVariableDeclarations(data, dataTypes, {start: -1, end: -1})
    //finds pointer
    let pointer = findPointer(data, comment, varDeclaration)


    let pointerIWF = findPointerInstantiatedWithFunction(data, comment, pointer)

    let lineNumbers = findPointerNextUsage(data, comment, pointerIWF)


    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a conversions error from unsigned to signed was detected: ${lineNumbers.map(single => `in line ${single}`).join(', ')} `,
        "lineNumbers": lineNumbers,
        "issueNumber": issueNumber
    }

    return errors
}

//returns all cases where the next usage is not a check for null
const findPointerNextUsage = (data, comment, pointerIWF) => {
    let result = []
    for(let i = 0 ; i < pointerIWF.length; ++i){
        let variable = pointerIWF[i].variable
        let start = pointerIWF[i].lineNumber
        let codeBlock = findUpperCodeBlock.findUpperCodeBlock(start, data)
        let end = codeBlock.end >=0 ? codeBlock.end : data.length -1
        for(let j = start ; j < end; ++j){
            if(!isComment(j+1, comment.comments.lineComments, comment.comments.blockComments)){
                let regex = new RegExp(`[^a-zA-Z0-9]${variable}(?![a-zA-Z0-9])`)
                let match = data[j].match(regex)
                if(match){
                    let line = data[j]
                    if(line.match(`!${variable}`)){break}
                    else if(line.match(`${variable}\\s*==\\s*null`)){break}
                    else if(line.match(`null\\s*==\\s*${variable}`)){break}
                    else if(line.match(`${variable}\\s*!=\\s*null`)){break}
                    else if(line.match(`null\\s*!=\\s*${variable}`)){break}
                    else {
                        result.push(j + 1)
                        break;
                    }
                }
            }
        }
    }
    return result
}

const findPointer = (data, comment, varDeclaration) => {
    let pointer = []
    for(let i = 0 ; i < varDeclaration.length; ++i){
        if(!isComment(varDeclaration[i].lineNumber, comment.comments.lineComments, comment.comments.blockComments)){
            try {
                let regex = new RegExp(`${varDeclaration[i].dataType}\\s\\*`)
                let match = regex.exec(data[varDeclaration[i].lineNumber - 1])
                if(match){
                    pointer.push(varDeclaration[i])
                }
            } catch (e) {}
        }
    }
    return pointer
}

const findPointerInstantiatedWithFunction = (data, comment, pointer) =>{
    let result = []
    for(let i = 0 ; i < data.length; ++i){
        if(!isComment(i + 1, comment.comments.lineComments, comment.comments.blockComments)){
            let match = data[i].match('=')
            if(match && data[i][match.index+1] !== '=') {
                let left = data[i].split('=')[0]
                let right = data[i].split('=')[1]
                for(let j = 0 ; j < pointer.length ; ++j){
                    try {
                        let regex = new RegExp(`(?![a-zA-Z0-9])\\s*${pointer[j].variable}\\s*(?![a-zA-Z0-9])`)
                        match = left.match(regex)
                        if(match){
                            regex = new RegExp(`\\s*[a-zA-Z]{1}[a-zA-Z0-9]*\\(`)
                            match = right.match(regex)
                            if(match){
                                result.push({
                                    lineNumber: i + 1,
                                    variable: pointer[j].variable
                                })
                            }
                        }
                    } catch (e) {}
                }
            }
        }
    }
    return result
}

module.exports = cwe_690