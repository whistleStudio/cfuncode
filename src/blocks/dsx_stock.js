/* 大师兄类目积木功能 */
/* 步骤：1 customToolbox/toolbox.json添加; 2 xxxstock.js添加 */

import * as Blockly from 'blockly/core';
import {pythonGenerator, Order} from 'blockly/python';
import themeJson from "../assets/theme/theme.json"
import { javascriptGenerator } from 'blockly/javascript';

const dsxColor = themeJson.categoryStyles.dsx.colour 

function addBlockSta (th, {pre=true, next=true, tip="", inline=true, oType=null, colour=dsxColor}={}) {
  if (pre) th.setPreviousStatement(true, null)
  if (next) th.setNextStatement(true, null)
  if (inline) th.setInputsInline(true)
  if (oType) th.setOutput(true, oType)
  th.setColour(colour)
  th.setTooltip(tip)
  th.setHelpUrl("");
}

/* 积木：大师兄程序头 */
Blockly.Blocks['dsx_start'] = {
  init: function () {
    this.appendDummyInput()
        .appendField('开源大师兄程序')
    this.setNextStatement(true, null)
    this.setColour(dsxColor)
  },
}

pythonGenerator.forBlock['dsx_start'] = function (block, generator) {
  // pythonGenerator.definitions_[`dsx_start`] = `#python-dsx\n`
  return ``
}
javascriptGenerator.forBlock['dsx_start'] = function (block, generator) {
  // pythonGenerator.definitions_[`dsx_start`] = `#python-dsx\n`
  return ``
}

/* 积木：数字输出 */
Blockly.Blocks['dsx_digitalWrite'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("设置引脚")
    this.appendDummyInput("PIN")
      .appendField(new Blockly.FieldDropdown([
        ['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],
        ['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]
      ]), "PIN") //添加下拉选择框
    this.appendDummyInput()
      .appendField("输出")
    this.appendDummyInput("STA")
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
          ['高', "1"],
          ['低', "0"]
      ]), "STA")//添加下拉选择框
    this.appendDummyInput()
      .appendField("电平")
    addBlockSta(this)
  }
}

pythonGenerator.forBlock['dsx_digitalWrite'] = function (block) {
  const pin = block.getFieldValue('PIN');
  const sta = block.getFieldValue('STA');
  pythonGenerator.definitions_["from_machine_import_Pin"] = "from machine import Pin\n"
  pythonGenerator.definitions_[`pin${pin}_init_out`] = `pin${pin} = Pin(${pin},"out")\n`
  return `pin${pin}.digitalWrite(${sta})\n`
}

javascriptGenerator.forBlock['dsx_digitalWrite'] = function (block) {
  const pin = block.getFieldValue('PIN');
  const sta = block.getFieldValue('STA');
  return `spWrite("255,85,129,${pin},0,0,0,${sta}")\n`
  // return `spWrite("aaaaa")\n`
}

/* 积木：PWM输出 */
Blockly.Blocks['dsx_pwmOut'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("设置引脚")
    this.appendDummyInput("PIN")
      .appendField(new Blockly.FieldDropdown([
        ['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],
        ['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]
      ]), "PIN") //添加下拉选择框
    this.appendDummyInput()
      .appendField("输出PWM波 (占空比")
    this.appendValueInput("DUTY")
      .setCheck("Number")
    this.appendDummyInput()
      .appendField(", 频率")
    this.appendValueInput("FREQ")
      .setCheck("Number")
    this.appendDummyInput()
      .appendField(")")
    addBlockSta(this)
  }
}

pythonGenerator.forBlock['dsx_pwmOut'] = function (block) {
  const pin = block.getFieldValue('PIN')
  const duty = pythonGenerator.valueToCode(block, 'DUTY', pythonGenerator.ORDER_ATOMIC) || '50'
  const freq = pythonGenerator.valueToCode(block, 'FREQ', pythonGenerator.ORDER_ATOMIC) || '10000'
  pythonGenerator.definitions_["from_machine_import_PWM"] = "from machine import PWM\n"
  pythonGenerator.definitions_[`pin${pin}_init_pwm`] = `pwm${pin} = PWM(${pin})\n`
  return `pwm${pin}.out(${duty}, ${freq})\n`
}

/* 积木: 数字输入 */
Blockly.Blocks['dsx_digitalRead'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("读取引脚")
    this.appendDummyInput("PIN")
      .appendField(new Blockly.FieldDropdown([
        ['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],
        ['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]
      ]), "PIN") //添加下拉选择框
    this.appendDummyInput()
      .appendField("的数字电平")
    addBlockSta(this, {pre: false, next: false, oType: "Boolean"})
  }
};

pythonGenerator.forBlock['cf_extend_aivision_faceIDAvailable'] = function (block) {
  const pin = block.getFieldValue('PIN')
  pythonGenerator.definitions_["from_machine_import_Pin"] = "from machine import Pin\n"
  pythonGenerator.definitions_[`pin${pin}_init_in`] = `pin${pin} = Pin(${pin},"in")\n`

  return [`pin${pin}.digitalRead()`, pythonGenerator.ORDER_ATOMIC];
};

/* 积木: 模拟输入 */
Blockly.Blocks['dsx_analogRead'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("读取引脚")
    this.appendDummyInput("PIN")
      .appendField(new Blockly.FieldDropdown([
        ['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],
        ['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]
      ]), "PIN") //添加下拉选择框
    this.appendDummyInput()
      .appendField("的模拟量")
    addBlockSta(this, {pre: false, next: false, oType: "Number"})
  }
};

pythonGenerator.forBlock['dsx_analogRead'] = function (block) {
  const pin = block.getFieldValue('PIN')
  pythonGenerator.definitions_["from_machine_import_ADC"] = "from machine import ADC\n"
  pythonGenerator.definitions_[`adc${pin}_init`] = `adc${pin} = ADC(${pin})\n`
  
  return [`adc${pin}.read()`, pythonGenerator.ORDER_ATOMIC];
};

/* 积木: 系统时间 */
Blockly.Blocks['dsx_sysTime'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("读取系统运行时间 (毫秒)")
    addBlockSta(this, {pre: false, next: false, oType: "Number"})
  }
};

pythonGenerator.forBlock['dsx_sysTime'] = function (block) {
  pythonGenerator.definitions_["import_time"] = "import time\n"

  return [`time.sysTime()\n`, pythonGenerator.ORDER_ATOMIC];
};