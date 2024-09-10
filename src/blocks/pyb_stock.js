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
  message0: "设置智能车以动力%1 %2 %3秒",
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
  pythonGenerator.definitions_[`moveByTFunc`] = `def moveByT (speed, dir, t, flag=True):
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
  if flag:
    dc_motor1.setDirPower("forward", 0)
    dc_motor2.setDirPower("forward", 0)\n`
  return `moveByT(${speed}, ${dir}, ${t})\n`
}

/* 积木：设置灰度阈值 */
let g1 = "A0", g2 = "A2", g3 = "A4", g4 = "A6" // 灰度默认接线
let threshold = 600

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
  threshold = pythonGenerator.valueToCode(block, 'THRESHOLD', pythonGenerator.ORDER_ATOMIC) || 600
  g1 = block.getFieldValue('G1'), g2 = block.getFieldValue('G2'), g3 = block.getFieldValue('G3'), g4 = block.getFieldValue('G4')
  pythonGenerator.definitions_["from_pyb_import_CarTrack"] = "from pyb import CarTrack\n"
  pythonGenerator.definitions_[`carTrack_init`] = `carTrack = CarTrack()\n`
  return `carTrack.setGrayPin(${threshold}, '${g1}', '${g2}', '${g3}', '${g4}')\n`
}

/* 积木：设置循迹不同状态下动力差 */
blockInit("pyb_setDifSpeed", {
  message0: "设置不同状态下动力差%1, %2",
  args0: [
    { type: "input_value", name: "SMALLDIF", check: "Number"},
    { type: "input_value", name: "LARGEDIF", check: "Number"},
  ]
})

pythonGenerator.forBlock['pyb_setDifSpeed'] = function (block) {
  const smallDif = pythonGenerator.valueToCode(block, 'SMALLDIF', pythonGenerator.ORDER_ATOMIC) || 30
  const largeDif = pythonGenerator.valueToCode(block, 'LARGEDIF', pythonGenerator.ORDER_ATOMIC) || 60
  pythonGenerator.definitions_["from_pyb_import_CarTrack"] = "from pyb import CarTrack\n"
  pythonGenerator.definitions_[`carTrack_init`] = `carTrack = CarTrack()\n`
  return `carTrack.setDifSpeed(${smallDif}, ${largeDif})\n`
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
  pythonGenerator.definitions_[`oled_init`] = `oled = OLED()\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g1)+1}_init`] = `adc${pinArr.indexOf(g1)+1} = ADC('${g1}')\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g2)+1}_init`] = `adc${pinArr.indexOf(g2)+1} = ADC('${g2}')\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g3)+1}_init`] = `adc${pinArr.indexOf(g3)+1} = ADC('${g3}')\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g4)+1}_init`] = `adc${pinArr.indexOf(g4)+1} = ADC('${g4}')\n`
  pythonGenerator.definitions_[`grayTestFunc`] = `def grayTest(adc_1, adc_2, adc_3, adc_4):
  oled.clear()
  oled.displayNum(1,  1, "big", "forward", adc_1.read())
  oled.displayNum(17, 1, "big", "forward", adc_2.read())
  oled.displayNum(33, 1, "big", "forward", adc_3.read())
  oled.displayNum(49, 1, "big", "forward", adc_4.read())
  sleep_ms(int(0.5 * 1000))\n`

  return `grayTest(adc${pinArr.indexOf(g1)+1}, adc${pinArr.indexOf(g2)+1}, adc${pinArr.indexOf(g3)+1}, adc${pinArr.indexOf(g4)+1})\n`
}

/* 积木：设置单次循迹 */
blockInit("pyb_trackPow", {
  message0: "设置以动力值%1循迹",
  args0: [{ type: "input_value", name: "SPEED", check: "Number"},],
  tooltip: "仅包含单次循迹逻辑"
})

pythonGenerator.forBlock['pyb_trackPow'] = function (block) {
  const speed = pythonGenerator.valueToCode(block, 'SPEED', pythonGenerator.ORDER_ATOMIC) || 60
  pythonGenerator.definitions_["from_pyb_import_CarTrack"] = "from pyb import CarTrack\n"
  pythonGenerator.definitions_[`carTrack_init`] = `carTrack = CarTrack()\n`

  return `carTrack.trackPow(${speed})\n`
}

/* 积木：按时循迹 */
blockInit("pyb_tTrack", {
  message0: "设置以动力值%1循迹%2秒",
  args0: [
    { type: "input_value", name: "SPEED", check: "Number"},
    { type: "input_value", name: "T", check: "Number"},
  ]
})

pythonGenerator.forBlock['pyb_tTrack'] = function (block) {
  const speed = pythonGenerator.valueToCode(block, 'SPEED', pythonGenerator.ORDER_ATOMIC) || 60
  const t = pythonGenerator.valueToCode(block, 'T', pythonGenerator.ORDER_ATOMIC) || 1
  pythonGenerator.definitions_["from_pyb_import_InTimer"] = "from pyb import InTimer\n"
  pythonGenerator.definitions_["from_pyb_import_CarTrack"] = "from pyb import CarTrack\n"
  pythonGenerator.definitions_[`tim_in_init`] = `tim_in = InTimer()\n`
  pythonGenerator.definitions_[`carTrack_init`] = `carTrack = CarTrack()\n`
  pythonGenerator.definitions_[`tTrackFunc`] = `def  tTrack(speed, t):
  tim_in.setZero()
  while not ((tim_in.current()) > t):
    carTrack.trackPow(speed)
  carTrack.stopTask()\n`

  return `tTrack(${speed}, ${t})\n`
}

/* 积木：路口循迹(关联tTrack)*/
blockInit("pyb_crossTrack", {
  message0: "设置以动力值%1循迹%2个%3路口 (冲出路口时间: %4)",
  args0: [
    { type: "input_value", name: "SPEED", check: "Number"},
    { type: "input_value", name: "COUNT", check: "Number"},
    { type: "field_dropdown", name: "CROSSTYPE", options: [["左或右", "cross"], ["左", "left"], ["右", "right"]] },
    { type: "input_value", name: "T", check: "Number"},
  ]
})

pythonGenerator.forBlock['pyb_crossTrack'] = function (block) {
  const speed = pythonGenerator.valueToCode(block, 'SPEED', pythonGenerator.ORDER_ATOMIC) || 60
  const count = pythonGenerator.valueToCode(block, 'COUNT', pythonGenerator.ORDER_ATOMIC) || 1
  const crossType = block.getFieldValue('CROSSTYPE')
  const t = pythonGenerator.valueToCode(block, 'T', pythonGenerator.ORDER_ATOMIC) || 0.5
  pythonGenerator.definitions_["from_pyb_import_InTimer"] = "from pyb import InTimer\n"
  pythonGenerator.definitions_["from_pyb_import_CarTrack"] = "from pyb import CarTrack\n"
  pythonGenerator.definitions_[`tim_in_init`] = `tim_in = InTimer()\n`
  pythonGenerator.definitions_[`carTrack_init`] = `carTrack = CarTrack()\n`
  pythonGenerator.definitions_[`tTrackFunc`] = `def tTrack(speed, t):
  tim_in.setZero()
  while not ((tim_in.current()) > t):
    carTrack.trackPow(speed)
  carTrack.stopTask()\n`
  pythonGenerator.definitions_[`crossTrackFunc`] = `def crossTrack(speed, count, crossType, t):
  num = 0
  while not (num == count) :
    carTrack.trackPowRoad(speed, crossType)
    while not carTrack.taskok():
      pass
    tTrack(speed, t)
    num += 1\n`

  return `crossTrack(${speed}, ${count}, '${crossType}', ${t})\n`
}

/* 积木: 路口转弯 (关联moveByT)*/
blockInit("pyb_crossTurn", {
  message0: "设置以动力值%1%2%3个路口 (预转弯时间: %4秒,  停止位置: %5)",
  args0: [
    { type: "input_value", name: "SPEED", check: "Number"},
    { type: "field_dropdown", name: "DIR", options: [["左转", "2"], ["右转", "3"]] },
    { type: "input_value", name: "COUNT", check: "Number"},
    { type: "input_value", name: "T", check: "Number"},
    { type: "field_dropdown", name: "STOPPOS", options: [["黑线中间", "stopMid"], ["黑线左侧", "stopLeft"], ["黑线右侧", "stopRight"]] },
  ]
})

pythonGenerator.forBlock['pyb_crossTurn'] = function (block) {
  const pinArr = ["A0", "A2", "A4", "A6", "B0", "C0", "C2", "C4"]
  const speed = pythonGenerator.valueToCode(block, 'SPEED', pythonGenerator.ORDER_ATOMIC) || 60
  const dir = block.getFieldValue('DIR')
  const count = pythonGenerator.valueToCode(block, 'COUNT', pythonGenerator.ORDER_ATOMIC) || 1
  const t = pythonGenerator.valueToCode(block, 'T', pythonGenerator.ORDER_ATOMIC) || 1
  const stopPos = block.getFieldValue('STOPPOS')
  pythonGenerator.definitions_[`from_pyb_import_ADC`] = `from pyb import ADC\n`
  pythonGenerator.definitions_[`from_time_import_sleep_ms`] = `from time import sleep_ms\n`
  pythonGenerator.definitions_["from_pyb_import_DCMotor"] = "from pyb import DCMotor\n"
  pythonGenerator.definitions_[`dc_motor1_init`] = `dc_motor1 = DCMotor(1)\n`
  pythonGenerator.definitions_[`dc_motor2_init`] = `dc_motor2 = DCMotor(2)\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g2)+1}_init`] = `adc${pinArr.indexOf(g2)+1} = ADC('${g2}')\n`
  pythonGenerator.definitions_[`adc${pinArr.indexOf(g3)+1}_init`] = `adc${pinArr.indexOf(g3)+1} = ADC('${g3}')\n`
  pythonGenerator.definitions_[`moveByTFunc`] = `def moveByT (speed, dir, t, flag=True):
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
  if flag:
    dc_motor1.setDirPower("forward", 0)
    dc_motor2.setDirPower("forward", 0)\n`
  pythonGenerator.definitions_[`crossTurn`] = `def crossTurn(speed, dir, count, t, stopPos, adcMidL, adcMidR, threshold):
  num = 0
  while not (num == count) :
    moveByT(speed, dir, t, False)
    if stopPos == "stopMid": # 停黑线中间
      while not ((adcMidL.read() < threshold+100) and (adcMidR.read() < threshold+100)):
        pass
    elif stopPos == "stopLeft": 
      if dir == 2: # 左转停黑线左侧
        while not (adcMidR.read() < threshold-100):
          pass
      else: # 右转停黑线左侧
        while not (adcMidR.read() < threshold+100):
          pass
    else:
      if dir == 2: # 左转停黑线右侧
        while not (adcMidL.read() < threshold+100):
          pass
      else: # 右转停黑线左侧
        while not (adcMidL.read() < threshold-100):
          pass
    num += 1
  moveByT(0, 0, 0) # 停止\n`  

  return `crossTurn(${speed}, ${dir}, ${count}, ${t}, '${stopPos}', adc${pinArr.indexOf(g2)+1}, adc${pinArr.indexOf(g3)+1}, ${threshold})\n`
}