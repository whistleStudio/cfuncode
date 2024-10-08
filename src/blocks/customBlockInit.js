import * as Blockly from 'blockly/core';

const defaultBlockSta = {
  "previousStatement": null,
  "nextStatement": null,
  "inputsInline": true,
}

let customBlockProps = {
  colour: "#eee"
}

function blockInit (blockType, initJson) {
  Blockly.defineBlocksWithJsonArray([
    {
      type: blockType,
      colour: customBlockProps.colour,
      ... defaultBlockSta,
      ...initJson
    }
  ])
}

export {customBlockProps, blockInit}