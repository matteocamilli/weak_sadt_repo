
//https://cwe.mitre.org/data/definitions/467.html

const getPotentialMitigations = require("./findIssue");
const findSwitch = require("./findSwitch");
const indicators = require("./cwe_483_wordList");
const isComment = require("../comments/isComment");

let issueNumber = 483

const cwe_483 = (data, comments) => {
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "In the following lines was an incorrect block Delimitation found:",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    let possibleError = findIndicators(data, comments, indicators)

    //deletes if indicators for the list if in the same line is an else if
    for(let i = 1;i<possibleError.length;++i){
        if(possibleError[i-1].lineNumber === possibleError[i].lineNumber){
            possibleError.splice(i, 1)
        }
    }

    let possibleErrorForElse = findElse(data, comments, possibleError)

    for (let i = 0; i < possibleError.length; ++i) {
        //calculates the indexes which are interesting to scan
        let index = possibleError[i].lineNumber - 1
        let indexNext = i < possibleError.length - 1 ? possibleError[i + 1].lineNumber : data.length - 1
        let join = data
            .slice(index, indexNext)
            .join('')
        //finds the start of the sacn
        let regex = new RegExp(`${possibleError[i].indicator}`, 'g')
        let start = regex.exec(join)
        join = join.slice(start.index, join.length)
        let joinSplit = join.split('')
        let count = 0
        //finds the end of the condition block example: if(condition)
        for(let k = 0;k < joinSplit.length;++k){
            if(count === 0 && joinSplit[k] === '(') { count++ }
            else if(count > 0 && joinSplit[k] === '(') { count++ }
            else if(count > 1 && joinSplit[k] === ')') { count-- }
            else if(count === 1 && joinSplit[k] === ')') { //found last closing braked
                count--
                start = k + 1
                break
            }
        }
        //generates a new list with the updated starting point
        join = join.slice(start, join.length)
        joinSplit = join.split('')
        //scans for the first non whitespace
        //if it is an opening curly braked all is fine
        //if it is not an opening curly braked or a whitespace it can be added to the list
        for(let j = 0; j < joinSplit.length;++j){
            if(joinSplit[j] === '{'){ break }
            else if(/\S/.test(joinSplit[j])){
                errors.lineNumbers.push(possibleError[i])
                break
            }
        }
    }

    //does the same but only for else
    //this step was mandatory because else as indicator has no condition block
    for(let i = 0 ; i < possibleErrorForElse.length ; ++i) {
        //calculates the indexes which are interesting to scan
        let index = possibleErrorForElse[i] - 1
        let indexNext = i < possibleErrorForElse.length - 1 ? possibleErrorForElse[i + 1] : data.length - 1
        let join = data
            .slice(index, indexNext)
            .join('')
        //finds the start of the sacn
        let regex = new RegExp(`else`, 'g')
        let start = regex.exec(join)
        join = join.slice(start.index + 4, join.length)
        let joinSplit = join.split('')
        //scans for the first non whitespace
        //if it is an opening curly braked all is fine
        //if it is not an opening curly braked or a whitespace it can be added to the list
        for(let j = 0; j < joinSplit.length;++j){
            if(joinSplit[j] === '{'){ break }
            else if(/\S/.test(joinSplit[j])){
                errors.lineNumbers.push({lineNumber:possibleErrorForElse[i], indicator: 'else'})
                break
            }
        }
    }
    //sorts the lineNumbers, due the later calculation of else the order got disturbed
    errors.lineNumbers.sort(function (a, b){return a.lineNumber - b.lineNumber})
    errors.lineNumbers = errors.lineNumbers.filter(single => checkForDowhile(single, data[single.lineNumber - 1]))
    errors.text += errors.lineNumbers.map(single => ` in line ${single.lineNumber} and the indicator was ${single.indicator}`).join(', ')
    errors.lineNumbers = errors.lineNumbers.map(single => single.lineNumber)

    return errors
}

const checkForDowhile = (single, line) => {
    if(single.indicator !== "while"){
        return true
    }
    return !line.includes(';')
}

const findElse = (data, comments, possibleErrors) => {
    let result = [] //lineNumber eq.:[1, 3, 5, 32]
    for(let i = 0 ; i < data.length ; ++i){
        if(data[i].toLowerCase().split(' ').includes('else')){
            //checks if a line is a comment and if a line was found as else if
            if(
                !isComment(i + 1, comments.comments.lineComments, comments.comments.blockComments)
                &&
                !possibleErrors.filter(single => single.lineNumber === i + 1 && single.indicator === 'else if').length > 0
            ){
                result.push(i + 1)
            }
        }
    }
    return result
}

module.exports = cwe_483

