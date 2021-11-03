const functionArguments = (line, functionName) => {
    line = line.replace(/\s/g, '')
    let match = line.match(functionName)
    let split = line.split('').slice(match.index + functionName.length, line.length)
    return split
}

module.exports = functionArguments