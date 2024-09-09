/* 智能主控类目积木功能 */
/* 步骤：1 customToolbox/toolbox.json添加; 2 xxxstock.js添加 */

import * as Blockly from 'blockly/core';
import {pythonGenerator, Order} from 'blockly/python';
import themeJson from "../assets/theme/theme.json"
import { JavascriptGenerator, javascriptGenerator } from 'blockly/javascript';
import { customBlockProps, blockInit } from './customBlockInit';

const pybColor = themeJson.categoryStyles.pyb.colour 
customBlockProps.colour = pybColor

// 无符号short转双字节， 高左
function unsignedShortToByte2(s){
  var targets = [];
  targets[0] = (s >> 8 & 0xFF);
  targets[1] = (s & 0xFF);
  return targets;
}
// 生成设置
function genOpt (arr) {return arr.map(v => [v, v])}

/* ------------ 硬件基础 ------------ */
/* 积木：大师兄程序头 */
blockInit("pyb_start", {
  message0: "智能主控程序",
  previousStatement: undefined
})

pythonGenerator.forBlock['pyb_start'] = function (block, generator) {
  return ``
}

/* 积木：根据时间运动 */
blockInit("pyb_moveByT", {
  message0: "设置智能车以动力%1 %2 %3秒后停止",
  args0: [
    { type: "input_value", name: "SPEED", check: "Number"},
    { type: "field_dropdown", name: "DIR", options: [["前进", "0"], ["后退", "1"], ["左转", "2"], ["右转", "3"]] },
    { type: "input_value", name: "T", check: "Number"},
    // { type: "field_dropdown", name: "M1", options: genOpt(["1", "2", "3", "4"])},
    // { type: "field_dropdown", name: "M2", options: genOpt(["1", "2", "3", "4"])},
  ],
  tooltip: "驱动轮电机接M1, M2"
})

pythonGenerator.forBlock['pyb_moveByT'] = function (block) {
  const speed = pythonGenerator.valueToCode(block, 'SPEED', pythonGenerator.ORDER_ATOMIC) || 50, t = pythonGenerator.valueToCode(block, 'T', pythonGenerator.ORDER_ATOMIC) || 1
  const dir = block.getFieldValue('DIR')
  pythonGenerator.definitions_["from_pyb_import_DCMotor"] = "from pyb import DCMotor\n"
  pythonGenerator.definitions_[`from_time_import_sleep_ms`] = `from time import sleep_ms\n`
  pythonGenerator.definitions_[`dc_motor1_init`] = `dc_motor1 = DCMotor(1)\n`
  pythonGenerator.definitions_[`dc_motor2_init`] = `dc_motor2 = DCMotor(2)\n`
  pythonGenerator.definitions_[`moveByTFunc`] = `def moveByT (speed, dir, t):
  global dc_motor1, dc_motor2
  if dir == 0:
    dc_motor1.setDirPower("forward", speed)
    dc_motor2.setDirPower("forward", speed)
  elif dir == 1:
    dc_motor1.setDirPower("reverse", speed)
    dc_motor2.setDirPower("reverse", speed)
  elif dir == 2:
    dc_motor1.setDirPower("reverse", speed)
    dc_motor2.setDirPower("forward", speed)
  else:
    dc_motor1.setDirPower("forward", speed)
    dc_motor2.setDirPower("reverse", speed)
  sleep_ms(int(t * 1000))
  dc_motor1.setDirPower("forward", 0)
  dc_motor2.setDirPower("forward", 0)\n`
  return `moveByT(${speed}, ${dir}, ${t})\n`
}

/* 积木：设置灰度阈值 */
let g1 = "A0", g2 = "A2", g3 = "A4", g4 = "A6" // 灰度默认接线

blockInit("pyb_setGray", {
  message0: "设置灰度阈值: %1,  灰度检测传感器引脚: %2|%3|%4|%5",
  args0: [
    { type: "input_value", name: "THRESHOLD", check: "Number"},
    { type: "field_dropdown", name: "G1", options: [["1", "A0"], ["2", "A2"], ["3", "A4"], ["4", "A6"], ["5", "B0"], ["6", "C0"], ["7", "C2"], ["8", "C4"]] },
    { type: "field_dropdown", name: "G2", options: [["1", "A0"], ["2", "A2"], ["3", "A4"], ["4", "A6"], ["5", "B0"], ["6", "C0"], ["7", "C2"], ["8", "C4"]] },
    { type: "field_dropdown", name: "G3", options: [["1", "A0"], ["2", "A2"], ["3", "A4"], ["4", "A6"], ["5", "B0"], ["6", "C0"], ["7", "C2"], ["8", "C4"]] },
    { type: "field_dropdown", name: "G4", options: [["1", "A0"], ["2", "A2"], ["3", "A4"], ["4", "A6"], ["5", "B0"], ["6", "C0"], ["7", "C2"], ["8", "C4"]] },
  ]
})

pythonGenerator.forBlock['pyb_setGray'] = function (block) {
  const threshold = pythonGenerator.valueToCode(block, 'THRESHOLD', pythonGenerator.ORDER_ATOMIC) || 600
  g1 = block.getFieldValue('G1'), g2 = block.getFieldValue('G2'), g3 = block.getFieldValue('G3'), g4 = block.getFieldValue('G4')
  pythonGenerator.definitions_["from_pyb_import_CarTrack"] = "from pyb import CarTrack\n"
  pythonGenerator.definitions_[`carTrack_init`] = `carTrack =CarTrack()\n`
  return `carTrack.setGrayPin(${threshold}, '${g1}', '${g2}', '${g3}', '${g4}')\n`
}

/* 积木: 屏显灰度检测数值 （可先调用设置灰度阈值积木，更改对应引脚）*/
blockInit("pyb_grayTest", {
  message0: "屏显灰度检测数值",
  tooltip: "默认灰度检测传感器P1-4, 可先调用设置灰度阈值积木，更改对应引脚"
})

pythonGenerator.forBlock['pyb_grayTest'] = function (block) {
  const pinArr = ["A0", "A2", "A4", "A6", "B0", "C0", "C2", "C4"]
  pythonGenerator.definitions_["from_pyb_import_OLED"] = "from pyb import OLED\n"
  pythonGenerator.definitions_[`from_pyb_import_ADC`] = `from pyb import ADC\n`
  pythonGenerator.definitions_[`from_time_import_sleep_ms`] = `from time import sleep_ms\n`
  pythonGenerator.definitions_[`oled_init`] = `oled= OLED()\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g1)+1}_init`] = `adc${pinArr.indexOf(g1)+1} = ADC('${g1}')\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g2)+1}_init`] = `adc${pinArr.indexOf(g2)+1} = ADC('${g2}')\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g3)+1}_init`] = `adc${pinArr.indexOf(g3)+1} = ADC('${g3}')\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g4)+1}_init`] = `adc${pinArr.indexOf(g4)+1} = ADC('${g4}')\n`
  pythonGenerator.definitions_[`grayTestFunc`] = `def grayTest():
  oled.clear()
  oled.displayNum(1,  1, "big", "forward", adc${pinArr.indexOf(g1)+1}.read())
  oled.displayNum(17, 1, "big", "forward", adc${pinArr.indexOf(g2)+1}.read())
  oled.displayNum(33, 1, "big", "forward", adc${pinArr.indexOf(g3)+1}.read())
  oled.displayNum(49, 1, "big", "forward", adc${pinArr.indexOf(g4)+1}.read())
  sleep_ms(int(0.5 * 1000))\n`

  return `grayTest()\n`
}