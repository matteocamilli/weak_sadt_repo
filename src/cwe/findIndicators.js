const findIndicators = (data, comments, indicators) => {

    let indicatorsFound = [] //{lineNumber: number, indicator:string}
    // eslint-disable-next-line
    data.map((single, i) => {
        // eslint-disable-next-line
        for(let j = 0 ; j < indicators.length; ++j) {
            let regex = new RegExp(`${indicators[j]}\\s*\\(`, 'g')
            if (single.match(regex) && !isComment(i + 1, comments.comments.lineComments, comments.comments.blockComments)) {
                indicatorsFound.push({lineNumber: i + 1, indicator: indicators[j]})
            }
        }
    })

    return indicatorsFound
}

module.exports = findIndicators