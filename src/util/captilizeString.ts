function capitalizeWords(input:string,spltVal:string=" ") {
    return input
        .split(spltVal) 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join('-'); 
}
export default capitalizeWords
