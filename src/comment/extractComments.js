const singleLineComment = require('./singleLineComment')
const multiLineComment = require('./multiLineComment')
const findLowerCodeBlock = require('./findLowerCodeBlock')
const findUpperCodeBlock = require('./findUpperCodeBlock')
const comments = require('./problematicComments')

function extractComments(data) {

    let result = {'comments': {}}

    result.comments['lineComments'] = singleLineComment(data)

    result.comments['blockComments'] = multiLineComment(data)

    let pcomment = findProblematicComments(result)

    for(let i = 0 ; i < pcomment.length; i++){
        //expand to upper
        let upper = pcomment[i].loc.start.line
        for(let j = pcomment[i].loc.start.line - 2; j > 0; j--){

            let blankLine = data[j].replace(/\sg/, '').length === 0
            let singleComment = result.comments.lineComments.filter(single => j + 1 === single.loc.start.line).length > 0
            if(singleComment){
                if(data[j].split('//').length > 1 && data[j].split('//')[0].replace(/\s/g, '').length > 0){
                    singleComment = false
                }
            }
            let multiLineComment = result.comments.blockComments.filter(single => j + 1 >= single.loc.start.line && j + 1 <= single.loc.end.line).length > 0
            if(multiLineComment){
                if(data[j].split('/*').length > 1 && data[j].split('/*')[0].replace(/\s/g, '').length > 0){
                    multiLineComment = false
                }
            }
            /*
            console.log(
                j,
                blankLine,
                singleComment,
                multiLineComment,
                data[j],
                (blankLine || singleComment || multiLineComment)
            )
             */
            if(blankLine || singleComment || multiLineComment) {
                upper = j + 1
            } else {
                break;
            }
        }
        //expand to lower
        let lower = pcomment[i].loc.end.line
        for(let j = pcomment[i].loc.end.line; j < data.length; j++){
            let blankLine = data[j].replace(/\sg/, '').length === 0
            let singleComment = result.comments.lineComments.filter(single => j + 1 === single.loc.start.line).length > 0
            if(singleComment){
                if(data[j].split('//').length > 1 && data[j].split('//')[0].replace(/\s/g, '').length > 0){
                    singleComment = false
                }
            }
            //line >= blockComments[i].loc.start.line && line <= blockComments[i].loc.end.line
            let multiLineComment = result.comments.blockComments.filter(single => j + 1 >= single.loc.start.line && j + 1 <= single.loc.end.line).length > 0
            if(multiLineComment){
                if(data[j].split('/*').length > 1 && data[j].split('/*')[0].replace(/\s/g, '').length > 0){
                    multiLineComment = false
                }
            }
            /*
            console.log(
                j,
                blankLine,
                singleComment,
                multiLineComment,
                data[j],
                (blankLine || singleComment || multiLineComment)
            )
            */
            if(blankLine || singleComment || multiLineComment) {
                lower = j + 1
            } else {
                break;
            }
        }
        pcomment[i].loc = {
            start:{
                line: upper
            },
            end:{
                line: lower
            }
        }
        pcomment[i].codeBlock.lower = findLowerCodeBlock(lower, data)
        pcomment[i].codeBlock.upper = findUpperCodeBlock(upper, data)
    }

    pcomment = pcomment.filter((single, index) => pcomment.findIndex((t) => t.loc.start.line === single.loc.start.line) === index)

    //pcomment.map(single => console.log(single))

    result.comments['problematicComments'] = pcomment


    return result

}

/*
*
* @input: 2-dimensional array for the raw comment lines
* @output: Array of a comments which could indicated a problematic code segment, with the corresponding line in the file
*
* */
function findProblematicComments(data) {
    const blockComments = data.comments.blockComments
    const lineComments = data.comments.lineComments

    let result = []
    // eslint-disable-next-line
    blockComments.filter(single => {
        if(matchComments(single).length > 0) {
            result.push({
                commentsFound: matchComments(single),
                loc: single.loc,
                codeBlock: single.codeBlock
            })
        }
    })
    // eslint-disable-next-line
    lineComments.filter(single => {
        if(matchComments(single).length > 0) {
            result.push({
                commentsFound: matchComments(single),
                loc: single.loc,
                codeBlock: single.codeBlock
            })
        }
    })

    return result
}

/*
*
* @input: object, result of extract
* @output: list of possible words or phrases which indicate a problem
*
* */
function matchComments(data) {
    let value = data.value.replace("\n", "").toLowerCase()

    let result = comments.filter(single => value.includes(single))
    return result
}

module.exports = extractComments