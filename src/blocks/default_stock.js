/* 默认类目下添加积木 */
import * as Blockly from 'blockly/core';
import {pythonGenerator, Order} from 'blockly/python';
import { javascriptGenerator, Order as jsOrder } from 'blockly/javascript';
import themeJson from "../assets/theme/theme.json"
import { customBlockProps, blockInit } from './customBlockInit';


const controlsColor = themeJson.categoryStyles.controls_category.colour 
customBlockProps.colour = controlsColor

/* 积木：延时 */
blockInit('controls_delay', {
  message0: "等待%1秒",
  args0:[{ type: "input_value", name: "DELAYT", check: "Number" }]
})

pythonGenerator.forBlock['controls_delay'] = function (block) {
  const delayT = pythonGenerator.valueToCode(block, 'DELAYT', pythonGenerator.ORDER_ATOMIC) || '1';
  pythonGenerator.definitions_["import_time"] = "import time\n"

  return `time.msDelay(int(${delayT} * 1000))\n`;
};
javascriptGenerator.forBlock['controls_delay'] = function (block) {
  const delayT = javascriptGenerator.valueToCode(block, 'DELAYT', javascriptGenerator.ORDER_ATOMIC) || '1';
  return `delayMs(${delayT});\n`
}

/* 积木: 串口打印 */
blockInit('controls_print', {
  message0: "串口打印%1",
  args0:[{ type: "input_value", name: "CTX" }]
})

pythonGenerator.forBlock['controls_print'] = function (block) {
  const ctx = pythonGenerator.valueToCode(block, 'CTX', pythonGenerator.ORDER_ATOMIC) || '';

  return `print(${ctx})\n`;
};
javascriptGenerator.forBlock['controls_print'] = function (block) {
  const ctx = javascriptGenerator.valueToCode(block, 'CTX', javascriptGenerator.ORDER_ATOMIC) || '';
  return `console.log(${ctx});\n`
}