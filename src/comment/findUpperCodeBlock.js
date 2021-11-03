const findLowerCodeBlock = require('./findLowerCodeBlock')

/*
* INPUT:
* @startingPoint: line number where the comment was found
* @data: content of the file, split by \n
*
* OUTPUT:
* JSON-object with starting and ending line of the code block
*
* if no match was possible for both values -1 will be returned
* */


const findUpperCodeBlock = (startingPoint, data) => {
    let result = {
        start: -1,
        end: -1
    }
    let interimResult = {
        start: -1,
        end: -1
    }
    let findUpperStartingPoint = data.filter((_, index) => index < startingPoint).join("").split('')
    let count = 0
    let countString = 0
    for (let i = findUpperStartingPoint.length - 1; i >= 0; --i) {
        if(countString === 0 && findUpperStartingPoint[i] === '"') {
            countString++
        }
        else if(countString === 1 && findUpperStartingPoint[i] === '"'){
            countString--
        }
        else if (count === 0 && findUpperStartingPoint[i] === '{' && countString === 0) {
            interimResult.start = i;
            break;
        } else if (findUpperStartingPoint[i] === '}' && countString === 0) {
            count++
        } else if (count > 0 && findUpperStartingPoint[i] === '{' && countString === 0) {
            count--
        }
    }
    if (interimResult.start >= 0) {
        let diff = findUpperStartingPoint.length - interimResult.start
        let lineCount = startingPoint - 1
        while (diff > 0) {
            diff = diff - data[lineCount].split('').length
            --lineCount

            if (diff <= 0) {
                result.start = lineCount
            }


        }
        result = findLowerCodeBlock(result.start, data)
    }

    return result
}


module.exports = findUpperCodeBlock