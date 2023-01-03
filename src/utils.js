
export function isNumeric(str) {
    if (typeof str != "string") return false; // we only process strings!
    return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
}
export function reverse(array) {
    //array
    array = [...array];
    var output = [];
    while (array.length) {
      output.push(array.pop());
    }
    return output;
  }