const findSwitch = (data) => {

    let switchFound = []
    // eslint-disable-next-line
    data.map((single, i) => {
        if (single.match(/switch\s*\(\s*.*\s*\)/g)) { //detects all switches
            switchFound.push((i + 1)) // array starts from 0 but the line count starts from 1
        }
    })

    return switchFound
}

module.exports = findSwitch