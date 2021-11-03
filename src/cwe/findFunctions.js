

/*
* input:
* output:
* desc:
* */
const findFunctions = (data, cwe676242WordList) => {
    let result = [] //{line: number, functionName: string}
    let regexp = /[A-Za-z0-9_]/gi;
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < cwe676242WordList.length; j++) {
            let regex = new RegExp(`${cwe676242WordList[j]}\\s*\\(.*`, 'g')
            //matches the regex to a single data line
            if (data[i].match(regex)) {
                //checks of the capiatlization is also the as in the function from the list
                //this step is mandatory to reject false positives like StrCat instead of save_StrCat
                let indexBefore = data[i][regex.exec(data[i]).index - 1]
                if((indexBefore !== undefined && !indexBefore.match(regexp)) || indexBefore === undefined){ //indexBefore can also be undefined since there dose not needs to be a character before the regex
                    result.push({
                        lineNumber: i + 1, //because we start to count from 1 and not 0 in file lines
                        functionName: cwe676242WordList[j]
                    })
                }
            }
        }
    }
    return result
}

module.exports = findFunctions