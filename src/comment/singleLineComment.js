const findLowerCodeBlock =  require("./findLowerCodeBlock")
const findUpperCodeBlock =  require("./findLowerCodeBlock")


const singleLineComment = (data) => {
    let result = []
    for (let i = 0; i < data.length; ++i) {
        if (data[i].split('//').length > 1) {
            result.push({
                loc: {
                    start: {line: i + 1},
                    end: {line: i + 1}
                },
                value: data[i],
                codeBlock: {
                    lower: findLowerCodeBlock(i, data),
                    upper: findUpperCodeBlock(i, data)
                }
            })
        }
    }
    return result
}


module.exports = singleLineComment