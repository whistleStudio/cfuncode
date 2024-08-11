/* 改变内置积木颜色 */
import * as Blockly from 'blockly/core'

function recolor(block, hue) { 
  var oldInit = block.init
  block.init = function() { 
    oldInit.call(this)
    console.log(this) 
    this.setColour(hue) 
  } 
} 

recolor(Blockly.Blocks['controls_if'], '#0fbd8c')
recolor(Blockly.Blocks['controls_if_elseif'], '#0fbd8c')
recolor(Blockly.Blocks['controls_if_if'], '#0fbd8c')
recolor(Blockly.Blocks['controls_if_else'], '#0fbd8c')

