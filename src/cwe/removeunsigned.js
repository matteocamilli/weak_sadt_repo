const removeunsigned = (errorsFound) =>{
    for(let i = 0 ; i < errorsFound.length; ++i){
        errorsFound[i].dest = errorsFound[i].dest.replace('unsigned ', '')
        if(Array.isArray(errorsFound[i].source)){
            errorsFound[i].source = errorsFound[i].source.filter(single => !single.includes('unsigned'))
        } else {
            errorsFound[i].source = errorsFound[i].source.replace('unsigned ', '')
        }
    }
    return errorsFound
}

module.exports = removeunsigned