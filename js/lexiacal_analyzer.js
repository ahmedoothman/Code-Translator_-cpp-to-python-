let tokens = [];
function tokenize() {
  var regExpPatternString = '';
  for (var i = 0; i < constants.length; i++) {
    regExpPatternString += constants[i] + '|';
  }
  regExpPatternString = regExpPatternString.slice(0, -1);
  const regExpPattern = new RegExp(regExpPatternString, 'g');

  theCode = theCode.replace(/ \/\/.*$ /, '');

  const commentsPattern = /\/\/.*|\/\*[\s\S]*?\*\//g;
  theCode = theCode.replace(commentsPattern, '');

  theCode = theCode.replace('\n', '');
  //theCode = theCode.replace(/\s+/g, '');
  const words = theCode.match(regExpPattern);
  words.forEach((lexem) => {
    console.log("")
    if (constants.includes(lexem) || brackets.includes(lexem)) {
      tokens.push(new Token(lexem, 'const'));
    } else {
      //id
      tokens.push(new Token(lexem, 'var'));
    }
  });
}
