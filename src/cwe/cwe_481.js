
//https://cwe.mitre.org/data/definitions/481.html

const getPotentialMitigations = require("./getPotentialMitigations");
const findIndicators = require("./findIndicators");
const indicators = require("./cwe_483_wordList");

let issueNumber = 481

const cwe_481 = (data, comments) => {

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "In the following lines was an incorrect block delimitation found:",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    let possibleErrors = findIndicators(data, comments, indicators)

    for (let i = 0; i < possibleErrors.length; ++i) {
        //calculates the indexes which are interesting to scan
        let index = possibleErrors[i].lineNumber - 1
        let indexNext = i < possibleErrors.length - 1 ? possibleErrors[i + 1].lineNumber : data.length - 1
        let join = data
            .slice(index, indexNext)
            .join('')
        //finds the start of the sacn
        let regex = new RegExp(`${possibleErrors[i].indicator}\\s*\\(`, 'g')
        let start = regex.exec(join)
        let end
        join = join.slice(start.index, join.length)
        let joinSplit = join.split('')
        let count = 0
        //finds the end of the condition block example: if(condition)
        for(let k = 0;k < joinSplit.length;++k){
            if(count === 0 && joinSplit[k] === '(') { count++; start = k + 1 }
            else if(count > 0 && joinSplit[k] === '(') { count++ }
            else if(count > 1 && joinSplit[k] === ')') { count-- }
            else if(count === 1 && joinSplit[k] === ')') { //found last closing braked
                count--
                end = k
                break
            }
        }

        let condition = joinSplit.splice(start, end - start).join('')
        let conditionAndSplit = condition.split(`/[&&||]/`)
        for(let k = 0 ; k < conditionAndSplit.length; ++k){
            if(possibleErrors[i].indicator === 'for' && conditionAndSplit[k].split(';').length === 3){
                conditionAndSplit[k] = conditionAndSplit[k].split(';')[1]
            }
            let regex = new RegExp(`[^=!]=[^=]`)
            if(conditionAndSplit[k].match(regex)){
                regex = new RegExp(`(?:!=|==|<=|>=)`)
                if(!conditionAndSplit[k].match(regex)){
                    errors.lineNumbers.push(possibleErrors[i])
                }
            }
        }
    }

    for(let key in data){
        if(data[key].includes('return')){
            let regex = new RegExp(`return\\s.*=.*;`)
            if(data[key].match('return.*;') && data[key].match(regex) && data[key].split('=').length === 2){
                errors.lineNumbers.push({lineNumber: parseInt(key) + 1, indicator: 'return'})
            }
        }
        if(data[key].match(`.*=.*=.*;$`)){
            let split = data[key]
                .split('=')
                .filter(single => single !== '')
            if(split.length === 3){
                errors.lineNumbers.push({lineNumber: parseInt(key) + 1, indicator: 'assignment'})
            }
        }
    }
    errors.lineNumbers.sort(function (a, b){return a.lineNumber - b.lineNumber})
    errors.text += errors.lineNumbers.map(single => ` in line ${single.lineNumber} and the indicator was ${single.indicator}`).join(', ')
    errors.lineNumbers = errors.lineNumbers.map(single => single.lineNumber)
    return errors
}

export default cwe_481