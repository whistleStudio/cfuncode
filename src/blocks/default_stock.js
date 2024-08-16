/* 默认类目下添加积木 */
import * as Blockly from 'blockly/core';
import {pythonGenerator, Order} from 'blockly/python';
import { javascriptGenerator, Order as jsOrder } from 'blockly/javascript';
import themeJson from "../assets/theme/theme.json"

const controlsColor = themeJson.categoryStyles.controls_category.colour 

function addBlockSta (th, {pre=true, next=true, tip="", inline=true, oType=null, colour=controlsColor}={}) {
  if (pre) th.setPreviousStatement(true, null)
  if (next) th.setNextStatement(true, null)
  if (inline) th.setInputsInline(true)
  if (oType) th.setOutput(true, oType)
  th.setColour(colour)
  th.setTooltip(tip)
  th.setHelpUrl("");
}

/* 积木：延时 */
Blockly.Blocks['controls_delay'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('等待')
    this.appendValueInput("DELAYT")
      .setCheck("Number")
    this.appendDummyInput()
      .appendField('秒')
    addBlockSta(this)
  }
}

pythonGenerator.forBlock['controls_delay'] = function (block) {
  const delayT = pythonGenerator.valueToCode(block, 'DELAYT', pythonGenerator.ORDER_ATOMIC) || '1';
  pythonGenerator.definitions_["import_time"] = "import time\n"

  return `time.msDelay(int(${delayT} * 1000))\n`;
};

javascriptGenerator.forBlock['controls_delay'] = function (block) {
  const delayT = javascriptGenerator.valueToCode(block, 'DELAYT', javascriptGenerator.ORDER_ATOMIC) || '1';

  // return `var ms = ${delayT} * 1000;ms += new Date().getTime();\nwhile (new Date() < ms) { };\nconsole.log("ggg");\n`
  return `delayMs(${delayT});\n`
}

/* 积木: 串口打印 */
Blockly.Blocks['controls_print'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('串口打印')
    this.appendValueInput("CTX")
    addBlockSta(this)
  }
}

javascriptGenerator.forBlock['controls_print'] = function (block) {
  const ctx = javascriptGenerator.valueToCode(block, 'CTX', javascriptGenerator.ORDER_ATOMIC) || '';
  return `console.log(${ctx});\n`
}