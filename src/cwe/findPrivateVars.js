const findPrivateVars = (data) => {
    let result = [] //var name and line
    for(let key = 0 ; key < data.length; ++key){
        if(data[key].includes('private')) {
            if(data[key].includes('private:')){ //multiple public var declaration
                let end = key
                for(let i = key + 1 ; i < data.length; ++i){
                    if(!data[i].match(/;/)){
                        end = i
                        break
                    } else if(data[i].match('public')){
                        end = i
                        break
                    }
                }
                for(let i = key + 1 ; i < end; ++i){
                    let split = data[i]
                        .replace(';', '')
                        .split(" ")
                        .filter(single => single !== '')
                    result.push({
                        'varName': split[1],
                        'lineNumber': i + 1
                    })
                }
            } else { // single public declaration
                //console.log(data[key])
                // eslint-disable-next-line
                let regex = new RegExp(`private\\s*[a-zA-Z\[\]\*]*\\s*[a-zA-Z]*[;|\\s=]+.*;`)
                //console.log(data[key].match(regex))
                if(data[key].match(regex)){ //ensuring it is not a function i.e. private int main(){...
                    let split = data[key].replace(';', '').split(/\s/)
                    result.push({
                        'varName':split[2],
                        'lineNumber': key + 1
                    })
                }
            }
        }
    }
    return result
}

module.exports = findPrivateVars