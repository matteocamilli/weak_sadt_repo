const findVariableDeclarations = (data, dataTypes, codeBlock) => {
    let result = []//{lineNumber: number, dataTyp: string, variableName: string}
    let start = codeBlock.start === -1 ? 0 : codeBlock.start
    let end = codeBlock.end === -1 ? data.length - 1  : codeBlock.end -1
    for (let i = start; i <= end; ++i) {
        for (let j = 0; j < dataTypes.length; ++j) {
            try {
                if (data[i].includes(`${dataTypes[j]}`)) {
                    let variable = findVariable(data[i], dataTypes[j])
                    if (variable !== undefined) {
                        result.push({
                            lineNumber: i + 1,
                            dataType: dataTypes[j],
                            variable
                        })
                    }
                    break; // in order to not detect multiple times the same datatype (unsigned int and int) //TODO fix if in one line are more than one declarations
                }
            } catch (e){}
        }
    }

    return result
}

const findVariable = (line, variableTyp) => {
    let result

    let varName = line.split(variableTyp)[1]
    result = varName.toString().replace(/\s/g, '').replace(/;/g, '').replace(/\*/g, '').split('=')[0]
    return result.includes('(') ? undefined : result
}

module.exports = findVariableDeclarations