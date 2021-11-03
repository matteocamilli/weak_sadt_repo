const findLowerCodeBlock = require('./findLowerCodeBlock')
const findUpperCodeBlock = require('./findUpperCodeBlock')

const multiLineComment = (data) => {
    let result = []
    let start = -1
    for (let i = 0; i < data.length; ++i) {
        if (start < 0 && data[i].split('/*').length > 1) {
            start = i
            --i //is needed to detect multiline comments over one line ex.: /* multiline comment in a single line */
        } else if (start >= 0 && data[i].split('*/').length > 1) {
            result.push({
                loc: {
                    start: {line: start + 1},
                    end: {line: i + 1}
                },
                // eslint-disable-next-line
                value: data.filter((single, index) => (index >= start && index <= i)).join(" "),
                codeBlock: {
                    lower: findLowerCodeBlock(i, data),
                    upper: findUpperCodeBlock(i, data)
                }
            })
            start = -1
        }
    }
    return result
}

module.exports = multiLineComment