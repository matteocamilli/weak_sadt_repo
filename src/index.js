const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require('fs');
const extractComments = require('./comment/extractComments')
const cwe_14 = require('./cwe/cwe14')
const cwe_135 = require('./cwe/cwe_135')
const cwe_188 = require('./cwe/cwe_188')
const cwe_195 = require('./cwe/cwe_195')
const cwe_196 = require('./cwe/cwe_196')
const cwe_243 = require('./cwe/cwe_243')
const cwe_244 = require('./cwe/cwe_244')
const cwe_374 = require('./cwe/cwe_374')
const cwe_375 = require('./cwe/cwe_375')
const cwe_401 = require('./cwe/cwe_401')
const cwe_415 = require('./cwe/cwe_415')
const cwe_416 = require('./cwe/cwe_416')
const cwe_467 = require('./cwe/cwe_467')
const cwe_468 = require('./cwe/cwe_468')
const cwe_478 = require('./cwe/cwe_478')
const cwe_481 = require('./cwe/cwe_481')
const cwe_482 = require('./cwe/cwe_482')
const cwe_483 = require('./cwe/cwe_483')
const cwe_484 = require('./cwe/cwe_484')
const cwe_588 = require('./cwe/cwe_588')
const cwe_560 = require('./cwe/cwe_560')
const cwe_587 = require('./cwe/cwe_587')
const cwe_242_676 = require('./cwe/cwe_676_242')
const alignPotentialMitigations = require('./cwe/alignPotentialMitigations')
const matchCodeAndComments = require('./comment/matchCodeAndComments')

const find = async () => {
    const globber = await glob.create('*')
    const issues = core.getInput('number-issues')
    let errorsGlobal = [] //all errors over all files

    for await (const filePath of globber.globGenerator()) {
        let path = filePath
        let ending = path.toString().split(".").pop()
        if (ending === "c" || ending === "h" || ending === "o") {
            await fs.readFile(filePath, 'utf8', (err, data) => {
                if(data !== undefined) {
                    const changedData = data.toString().replace('"', '').split('\n')
                    let errors = []

                    errors.push(extractComments(changedData))

                    const cwe_242_676_error = cwe_242_676(changedData, errors[0])
                    if(cwe_242_676_error.lineNumbers.length > 0) errors.push(cwe_242_676_error)

                    const cwe_14_error = cwe_14(changedData)
                    if(cwe_14_error.lineNumbers.length > 0) errors.push(cwe_14_error)

                    const cwe_135_error = cwe_135(changedData, errors[0])
                    if(cwe_135_error.lineNumbers.length > 0) errors.push(cwe_135_error)

                    const cwe_188_error = cwe_188(changedData, errors[0])
                    if(cwe_188_error.lineNumbers.length > 0) errors.push(cwe_188_error)

                    const cwe_195_error = cwe_195(changedData, errors[0])
                    if(cwe_195_error.lineNumbers.length > 0) errors.push(cwe_195_error)

                    const cwe_196_error = cwe_196(changedData, errors[0])
                    if(cwe_196_error.lineNumbers.length > 0) errors.push(cwe_196_error)

                    const cwe_243_error = cwe_243(changedData, errors[0])
                    if(cwe_243_error.lineNumbers.length > 0) errors.push(cwe_243_error)

                    const cwe_244_error = cwe_244(changedData, errors[0])
                    if(cwe_244_error.lineNumbers.length > 0) errors.push(cwe_244_error)

                    const cwe_374_error = cwe_374(changedData, errors[0])
                    if(cwe_374_error.lineNumbers.length > 0) errors.push(cwe_374_error)

                    const cwe_375_error = cwe_375(changedData, errors[0])
                    if(cwe_375_error.lineNumbers.length > 0) errors.push(cwe_375_error)

                    const cwe_401_error = cwe_401(changedData, errors[0])
                    if(cwe_401_error.lineNumbers.length > 0) errors.push(cwe_401_error)

                    const cwe_415_error = cwe_415(changedData, errors[0])
                    if(cwe_415_error.lineNumbers.length > 0) errors.push(cwe_415_error)

                    const cwe_416_error = cwe_416(changedData, errors[0])
                    if(cwe_416_error.lineNumbers.length > 0) errors.push(cwe_416_error)

                    const cwe_467_error = cwe_467(changedData, errors[0])
                    if(cwe_467_error.lineNumbers.length > 0) errors.push(cwe_467_error)

                    const cwe_468_error = cwe_468(changedData, errors[0])
                    if(cwe_468_error.lineNumbers.length > 0) errors.push(cwe_468_error)

                    const cwe_478_error = cwe_478(changedData, errors[0])
                    if(cwe_478_error.lineNumbers.length > 0) errors.push(cwe_478_error)

                    const cwe_481_error = cwe_481(changedData, errors[0])
                    if(cwe_481_error.lineNumbers.length > 0) errors.push(cwe_481_error)

                    const cwe_482_error = cwe_482(changedData, errors[0])
                    if(cwe_482_error.lineNumbers.length > 0) errors.push(cwe_482_error)

                    const cwe_483_error = cwe_483(changedData, errors[0])
                    if(cwe_483_error.lineNumbers.length > 0) errors.push(cwe_483_error)

                    const cwe_484_error = cwe_484(changedData, errors[0])
                    if(cwe_484_error.lineNumbers.length > 0) errors.push(cwe_484_error)

                    const cwe_588_error = cwe_588(changedData, errors[0])
                    if(cwe_588_error.lineNumbers.length > 0) errors.push(cwe_588_error)

                    const cwe_560_error = cwe_560(changedData, errors[0])
                    if(cwe_560_error.lineNumbers.length > 0) errors.push(cwe_560_error)

                    const cwe_587_error = cwe_587(changedData, errors[0])
                    if(cwe_587_error.lineNumbers.length > 0) errors.push(cwe_587_error)

                    errors.map((error, index) => {
                        if(index > 0) {
                            errorsGlobal.push(JSON.stringify({
                                filePath,
                                error
                            }))
                            core.setFailed(`CWE Weakness ${error.issueNumber} found in file ${filePath}, following lines are affected: ${error.lineNumbers.join(', ')}`)
                            core.info(alignPotentialMitigations(error.mitigation))
                        }
                    })

                    const satd = matchCodeAndComments(errors, data)

                    if(satd['0'].comments.matchedCommets && satd['0'].comments.matchedCommets.length > 0){
                        core.setFailed(`${satd['0'].comments.matchedCommets.length === 1 ? `One instance of SATD was found in the file ${filePath}:` : `Multiple instances of SATD were found in the file ${filePath}:` }`)
                        core.info(satd['0'].comments.matchedCommets.map(satd => `- Comment (line ${satd.commentLine}) and code (line ${satd.codeLine}) for the CWE issue ${errors[satd.errorNumber].issueNumber} were linked and identified as SATD`).join('\n'))
                    } else {
                        core.info(`No instance of satd was found in the ${filePath}\n\n`)
                    }

                } else {
                    console.log('Data was undefined')
                    console.log(filePath)
                }

            })
        }
    }
}

try{
    find()
} catch (err){
    core.setFailed('some strange error occurred, please re-run it!')
}