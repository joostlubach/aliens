function isTokenOnSameLine(left, right) {
  return left.loc.end.line === right.loc.start.line
}

function isClosingBracketToken(token) {
  return token.value === "]" && token.type === "Punctuator"
}

function isClosingBraceToken(token) {
  return token.value === "}" && token.type === "Punctuator"
}

function isNotCommaToken(token) {
  return !(token.value === "," && token.type === "Punctuator")
}

module.exports = {
  isTokenOnSameLine,
  isClosingBracketToken,
  isClosingBraceToken,
  isNotCommaToken,
}