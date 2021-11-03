const findUpperCodeBlock = require('../comment/findUpperCodeBlock')

const determinePotentialErrors = (data, i, potentialErrors) => {
    let index = potentialErrors[i].lineNumber
    let indexNext = i < potentialErrors.length - 1 ? potentialErrors[i + 1].lineNumber : data.length - 1
    let join = data
        .slice(index, indexNext)
        .join('')
    let regex = new RegExp(`free\\s*\\(.*`, 'g')
    let start = regex.exec(data[potentialErrors[i].lineNumber])
    let end
    join = join.slice(start.index, join.length)
    let count = 0
    let joinSplit = join.split('')
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
    potentialErrors[i].varName = joinSplit.slice('free('.length, end).join('')
    let upperCodeBlock = findUpperCodeBlock(potentialErrors[i].lineNumber, data)
    potentialErrors[i].end = upperCodeBlock.end === -1 ? data.length : upperCodeBlock.end
    potentialErrors[i].start = upperCodeBlock.start === -1 ? 1 : upperCodeBlock.start
    delete potentialErrors[i].indicator
    return potentialErrors[i]
}

module.exports = determinePotentialErrors