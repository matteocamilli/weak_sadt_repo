const isComment = require("../comment/isComment");

const findErrorsSignAndUnsignConversionError = (data, comment, vars) => {
    let result = []
    vars = vars
        .filter(single =>
            (single.variable[0] && single.variable[0].match(/[a-zA-Z]/))
            &&
            !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments)
            &&
            !single.variable.includes('(')
            &&
            !single.variable.includes('}')
            &&
            !single.variable.includes(')')
            &&
            !single.variable.includes('{')
        )

    let dest
    let source
    for(let i = 0; i < data.length;++i){
        let match = data[i].match('=')
        dest = null
        source = null
        if(match && data[i][match.index+1] !== '='){
            let split = data[i].split('=')
            dest = matchVarLeft(split[0], vars)
            if(split.length > 1){
                source = matchVarRight(split[1], vars)
            }
            if(dest !== null && source !== null && dest !== source){
                result.push({
                    dest,
                    source,
                    lineNumber: i + 1
                })
            }
        }
    }

    return result
}

// returns the datatype
const matchVarLeft = (left, vars) => {
    for(let i = 0 ; i < vars.length; ++i){
        try {
            let regex = new RegExp(`(?![a-zA-Z0-9])\\s*${vars[i].variable}\\s*(?![a-zA-Z0-9])`)
            let match = regex.exec(left)
            if (match) {
                let before = left[match.index] ? left[match.index] : ' '
                let next = left[match.index + 1 + vars[i].variable.length] ? left[match.index + 1 + vars[i].variable.length] : ' '
                if (before.match('\\s') && next.match('[\\s\\=]')) {
                    return vars[i].dataType
                }
            }
        }catch (e) {}
    }
    return null
}

//returns array of possible datatype
const matchVarRight = (right, vars) => {
    for(let i = 0 ; i < vars.length; ++i){
        try {
            let regex = new RegExp(`\\s*${vars[i].variable}\\s*;`)
            let match = right.match(regex)
            if (match) {
                return vars[i].dataType
            }
            try {
                // eslint-disable-next-line
                let result = eval(right)
                if (result >= 0) {
                    if (result.toString().includes('.')) {
                        return ['unsigned float', 'unsigned double', "double", "float"]
                    }
                    return ['unsigned char','unsigned int', 'unsigned short', 'unsigned long', 'unsigned float', "unsigned double", 'char','int', 'short', 'long', 'float', 'double']
                } else {
                    if (result.toString().includes('.')) {
                        return ["double", "float"]
                    }
                    return ['char','int', 'short', 'long', 'float', 'double']
                }
            } catch (e) {
            }
            for (let j = 0; j < dataTypes.length; ++j) {
                regex = new RegExp(`\\(${dataTypes[j]}\\)\\s*[a-zA-Z0-9\\.\\-\\+\\/\\*]+;`)
                match = right.match(regex)
                if (match) {
                    return dataTypes[j]
                }
            }
        } catch (e){}
    }
    return null
}

module.exports = findErrorsSignAndUnsignConversionError