// eslint-disable-next-line
const isComment = require("./isComment")

/*
* input: comments and issues with their corresponding occurrences
* output: list of matched comments and issues
* desc: returns also a lost of comments with no match
* */
function matchCodeAndComments(data, file) {
    //default case, no problematic comments where found
    if (data[0].comments.problematicComments.length === 0) return data

    let commentLines = data[0].comments.problematicComments.map(single => {
        return {endLineComment: single.loc.end.line, codeBlock: single.codeBlock}
    })
    data[0].comments.matchedCommets = data
        // eslint-disable-next-line
        .map((single, index) => {if (index > 0) return matchCode(commentLines, single.lineNumbers, index, file)})
        .filter(single => single) //filters out the undefined for the position 0
        .flat()

    data
        // eslint-disable-next-line
        .map((single, index) => {
            if (index > 0) return matchThem(commentLines, single.lineNumbers, index, file)
        })
        .filter(single => single) //filters out the undefined for the position 0
        .flat()
        .map(single => data[0].comments.matchedCommets.push(single))


    data[0].comments.matchedCommets = data[0].comments.matchedCommets
        .filter((elem, index, self) => index === self.findIndex((t => t.commentLine === elem.commentLine))) // removed duplicates found in the same block

    let matchedCommentLines = data[0].comments.matchedCommets
        .map(single => single.commentLine)
    matchedCommentLines = matchedCommentLines.filter((single, index) => matchedCommentLines.indexOf(single) === index)


    let notMatchedCommentLines = commentLines
        .filter(single => matchedCommentLines.includes(single.endLineComment) === false)
        .map(single => {
            return {'commentLine': single.endLineComment}
        })


    data[0].comments.notMatchedComments = notMatchedCommentLines
    return data
}

function matchCode(commentLines, codeLines, errorNumber, file)  {
    let result = []
    for(let i = 0 ; i < commentLines.length; ++i){
        let start = commentLines[i].endLineComment
        let end = commentLines[i].codeBlock.lower.start
        let diff = end - start
        diff = diff > 9 ? 9 : diff
        if(diff < 0){
            diff = file.length - start > 9 ? file.length - start : 9
            end = file.length - start > 9 ? file.length - start : start + 9
        }
        if(diff > 0){
            for(let j = start + 1; j < end; ++j){
                if(codeLines.includes(j)){
                    result.push({
                        'commentLine': commentLines[i].endLineComment,
                        'codeLine': j,
                        'errorNumber': errorNumber,
                    })
                }
            }
        }
    }
    return result
}


/*
* input: comments and issues, n times m check for connection
* output: list of connected code and comment
* desc:
* */
function matchThem(commentLines, codeLines, errorNumber, file) {
    let result = []
    for (let i = 0; i < commentLines.length; ++i) {
        for (let j = 0; j < codeLines.length; ++j) {
            let result2 = checkConnection(commentLines[i].endLineComment, codeLines[j], errorNumber, commentLines[i].codeBlock, file)
            if (result2) {
                result.push(result2)
            }
        }
    }
    return result
}

/*
* input: single comment and code element
* output: false for mo match, object with the matching pairs
* desc:
* */
function checkConnection(commentline, codeLine, errorNumber, codeBlock, file) {
    //console.log('-----------------------------------')
    let result = {
        'commentLine': commentline,
        'codeLine': codeLine,
        'errorNumber': errorNumber,
        codeBlock
    }
    let start = commentline
    let checkRange = codeLine >= codeBlock.lower.start && codeLine <= codeBlock.lower.end

    if(checkRange && codeBlock.lower.start - commentline <= 3){
        return result
    }
    else if(checkRange && codeBlock.lower.start - commentline <= 9){
        let end = codeBlock.lower.start - 1
        return checkForIF(file, start, end, result, result)
    }
    else if(checkRange){
        let end = commentline + 9
        return checkForIF(file, start, end, result)
    }

    return false
}

function checkForIF(file, start, end, result, defaultResult = false){
    for(let i = start;i<end;++i){
        if(file[i].match(`if`)){
            result.codeLine = i + 1
            return result
        }
    }
    return defaultResult
}

module.exports = matchCodeAndComments