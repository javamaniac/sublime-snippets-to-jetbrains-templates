// import { Element } from 'html-element';

const snippets = require('./snippets.json')
const snippetNames = Object.keys(snippets)

console.log(`<templateSet group="Polymer">`)
snippetNames.forEach(snippetName => { 
  // console.log(snippetName) 
  const snippet = snippets[snippetName]
  
const obj = getValue(snippet.body)


console.log(`<template name="${snippet.prefix}"
  value="${obj.body}"
  description="${snippet.description}" toReformat="true" toShortenFQNames="true">
    ${obj.variables}
    <context>
      <option name="HTML" value="true"/>
      <option name="HTML_TEXT" value="true"/>
      <option name="OTHER" value="true"/>
    </context>
</template>`)  
// console.log("==>", htmlToString(snippet.body))

})

console.log(`</templateSet>`)
//console.log(snippets)

function findPlaceHolders(value) {
  const stringPlaceHolders = value.match(/\${[0-9]+: *[a-zA-Z0-9-_ :]+}/g)

  if (stringPlaceHolders) {
    // console.warn("STRING PLACE HOLDERS : ", stringPlaceHolders)
    // TODO convert to « $bower_components$ »
    // console.log(value.replace(/\${[0-9]+: *([a-zA-Z0-9-_ :]+)}/g, '$$$1$$'))
    value = value.replace(/\${[0-9]+: *([a-zA-Z0-9-_ :]+)}/g, '(@@@$1@@@)')
  // } else {

    const numberPlaceHolders = value.match(/\$[0-9]+/g)
    if (numberPlaceHolders) {
      // console.log(value)      
      // console.warn("NUMBER PLACE HOLDERS : ", numberPlaceHolders)
      value = value.replace(/\$([0-9]+)/g, '(@@@$1@@@)')


      // } else {
        // console.warn("NO PLACE HOLDER", value)      
      }
    } 

    let variableXml = ''

    const variables = value.match(/(@@@[^@]+@@@)/g)
    if (variables) {
      let varList = []
      variables.forEach(variable => {
        const name = variable.replace(/@@@/g, '')
        if (!varList[name]) {
          varList[name] = true
          variableXml += `<variable name="${name}" expression="" defaultValue="&quot;${name}&quot;" alwaysStopAt="true"/>`
        }
      })
    }


    value = value.replace(/@@@/g, '$$')
    
    // console.log(value)
  return {
    body: value,
    variables: variableXml
  }
  

}

function getValue(value) {
  return htmlToString(value)
}

function htmlToString(html) {
  var document = require('html-element').document;

  const obj = findPlaceHolders(html)

  let p = document.createElement("p")
  p.textContent = obj.body
  return {
    variables: obj.variables,
    body: p.innerHTML.replace(/\n/g, '&#10;')
  }
}