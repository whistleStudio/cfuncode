/* 大师兄类目积木功能 */
/* 步骤：1 customToolbox/toolbox.json添加; 2 xxxstock.js添加 */

import * as Blockly from 'blockly/core';
import {pythonGenerator, Order} from 'blockly/python';
import themeJson from "../assets/theme/theme.json"
import { javascriptGenerator } from 'blockly/javascript';
import { customBlockProps, blockInit } from './customBlockInit';

const dsxColor = themeJson.categoryStyles.dsx.colour 
customBlockProps.colour = dsxColor

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
blockInit("dsx_start", {
  message0: "开源大师兄程序",
  previousStatement: undefined
})

pythonGenerator.forBlock['dsx_start'] = function (block, generator) {
  // pythonGenerator.definitions_[`dsx_start`] = `#python-dsx\n`
  return ``
}
javascriptGenerator.forBlock['dsx_start'] = function (block, generator) {
  // pythonGenerator.definitions_[`dsx_start`] = `#python-dsx\n`
  return ``
}

/* 积木：数字输出 */
blockInit("dsx_digitalWrite", {
  message0: "设置引脚%1输出%2电平",
  args0: [
    { type: "field_dropdown", name: "PIN", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] },
    { type: "field_dropdown", name: "STA", options: [['高', "1"], ['低', "0"]] }
  ]
})

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
  return `spWrite(255,85,129,${pin},0,0,0,${sta})\n`
}

/* 积木：PWM输出 */
blockInit("dsx_pwmOut", {
  message0: "设置引脚%1输出PWM波 (占空比%2, 频率%3)",
  args0: [
    { type: "field_dropdown", name: "PIN", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] },
    { type: "input_value", name: "DUTY", check: "Number"},
    { type: "input_value", name: "FREQ", check: "Number"}
  ]
})

pythonGenerator.forBlock['dsx_pwmOut'] = function (block) {
  const pin = block.getFieldValue('PIN')
  const duty = pythonGenerator.valueToCode(block, 'DUTY', pythonGenerator.ORDER_ATOMIC) || '50'
  const freq = pythonGenerator.valueToCode(block, 'FREQ', pythonGenerator.ORDER_ATOMIC) || '10000'
  pythonGenerator.definitions_["from_machine_import_PWM"] = "from machine import PWM\n"
  pythonGenerator.definitions_[`pin${pin}_init_pwm`] = `pwm${pin} = PWM(${pin})\n`
  return `pwm${pin}.out(${duty}, ${freq})\n`
}
javascriptGenerator.forBlock['dsx_pwmOut'] = function (block) {
  const pin = block.getFieldValue('PIN')
  const duty = javascriptGenerator.valueToCode(block, 'DUTY', javascriptGenerator.ORDER_ATOMIC) || '50'
  const freq = javascriptGenerator.valueToCode(block, 'FREQ', javascriptGenerator.ORDER_ATOMIC) || '10000'
  return `spPwmWrite(${pin}, ${freq}, ${duty})\n`
}

/* 积木: 数字输入 */
blockInit("dsx_digitalRead", {
  message0: "读取引脚%1的数字电平",
  args0: [{ type: "field_dropdown", name: "PIN", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] }],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_digitalRead'] = function (block) {
  const pin = block.getFieldValue('PIN')
  pythonGenerator.definitions_["from_machine_import_Pin"] = "from machine import Pin\n"
  pythonGenerator.definitions_[`pin${pin}_init_in`] = `pin${pin} = Pin(${pin},"in")\n`

  return [`pin${pin}.digitalRead()`, pythonGenerator.ORDER_ATOMIC];
};
javascriptGenerator.forBlock['dsx_digitalRead'] = function (block) {
  const pin = block.getFieldValue('PIN')

  return [`spRead("tag_uint8", 255,85,1,${pin},0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: 模拟输入 */
blockInit("dsx_analogRead", {
  message0: "读取引脚%1的模拟量",
  args0: [{ type: "field_dropdown", name: "PIN", options: [['1', "1"], ['2', "2"], ['13', "13"], ['14', "14"], ['20', "20"]] }],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_analogRead'] = function (block) {
  const pin = block.getFieldValue('PIN')
  pythonGenerator.definitions_["from_machine_import_ADC"] = "from machine import ADC\n"
  pythonGenerator.definitions_[`adc${pin}_init`] = `adc${pin} = ADC(${pin})\n`

  return [`adc${pin}.read()`, pythonGenerator.ORDER_ATOMIC];
}
javascriptGenerator.forBlock['dsx_analogRead'] = function (block) {
  const pin = block.getFieldValue('PIN')

  return [`spRead("tag_short", 255,85,2,${pin},0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: 系统时间 */
blockInit("dsx_sysTime", {
  message0: "读取系统运行时间 (毫秒)",
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_sysTime'] = function (block) {
  pythonGenerator.definitions_["import_time"] = "import time\n"

  return [`time.sysTime()\n`, pythonGenerator.ORDER_ATOMIC];
}
javascriptGenerator.forBlock['dsx_sysTime'] = function (block) {

  return [`spRead("tag_int", 255,85,10,0,0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* ------------ 传感器 ------------ */
/* 积木: 板载按键 */
blockInit("dsx_keyabRead", {
  message0: "读取板载%1按键是否按下",
  args0: [{ type: "field_dropdown", name: "KEY", options: [["A", "A"], ["B", "B"]] }],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Boolean"
})

pythonGenerator.forBlock['dsx_keyabRead'] = function (block) {
  const key = block.getFieldValue('KEY')
  pythonGenerator.definitions_["from_machine_import_Key"] = "from machine import Key\n"
  pythonGenerator.definitions_[`keyab_init`] = `keyab = Key()\n`

  return [`keyab.read${key}()`, pythonGenerator.ORDER_ATOMIC];
}
javascriptGenerator.forBlock['dsx_keyabRead'] = function (block) {
  const key = block.getFieldValue('KEY')

  if (key == "A") return [`spRead("tag_boardKey", 255,85,1,5,0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
  else return [`spRead("tag_boardKey", 255,85,1,11,0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: 板载光距 */
blockInit("dsx_ltrRead", {
  message0: "读取板载光距传感器的%1",
  args0: [{ type: "field_dropdown", name: "OPT", options: [["靠进度", "靠进度"], ["光强值", "光强值"]] }],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_ltrRead'] = function (block) {
  const opt = block.getFieldValue('OPT')
  pythonGenerator.definitions_["from_machine_import_ltr553"] = "from machine import ltr553\n"
  pythonGenerator.definitions_[`ltr_init`] = `ltr = ltr553()\n`

  if (opt == "靠进度") return [`ltr.readps()`, pythonGenerator.ORDER_ATOMIC]
  else return [`ltr.readals()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_ltrRead'] = function (block) {
  const opt = block.getFieldValue('OPT')

  if (opt == "靠进度") return [`spRead("tag_short", 255,85,42,0,0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
  else return [`spRead("tag_short", 255,85,42,1,0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: 板载温湿度 */
blockInit("dsx_aht20Read", {
  message0: "读取板载AHT20传感器的%1",
  args0: [{ type: "field_dropdown", name: "OPT", options: [["温度值", "温度值"], ["湿度值", "湿度值"]] }],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_aht20Read'] = function (block) {
  const opt = block.getFieldValue('OPT')
  pythonGenerator.definitions_["from_machine_import_AHT20"] = "from machine import AHT20\n"
  pythonGenerator.definitions_[`aht20_init`] = `aht20 = AHT20()\n`
  if (opt == "温度值") return [`aht20.readtemp()`, pythonGenerator.ORDER_ATOMIC]
  else return [`aht20.readhumi()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_aht20Read'] = function (block) {
  const opt = block.getFieldValue('OPT')
  if (opt == "温度值") return [`spRead("tag_uint8", 255,85,16,1,0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
  else return [`spRead("tag_uint8", 255,85,16,2,0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: 板载语音识别 */
blockInit("dsx_asrRead", {
  message0: "读取板载语音识别模块的识别码",
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_asrRead'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_ASR"] = "from machine import ASR\n"
  pythonGenerator.definitions_[`asr_init`] = `asr = ASR()\n`
  return [`asr.read()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_asrRead'] = function (block) {
  return [`spRead("tag_uint8", 255,85,48,0,0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木：板载陀螺仪 */
blockInit("dsx_lis3dhRead", {
  message0: "读取板载陀螺仪的%1轴值",
  args0: [{ type: "field_dropdown", name: "AXIS", options: [["X", "X"], ["Y", "Y"], ["Z", "Z"]] }],

  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_lis3dhRead'] = function (block) {
  const axis = block.getFieldValue('AXIS')
  pythonGenerator.definitions_["from_machine_import_LIS3DH"] = "from machine import LIS3DH\n"
  pythonGenerator.definitions_[`lis3dh_init`] = `lis3dh = LIS3DH()\n`
  return [`lis3dh.readangle${axis}()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_lis3dhRead'] = function (block) {
  const axis = block.getFieldValue('AXIS')
  let axisV = 1
  if (axis == "Y") axisV = 2
  else if (axis == "Z") axisV = 3
  return [`spRead("tag_int8", 255,85,55,${axisV},0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木：pm25 */
blockInit("dsx_pm25Read", {
  message0: "读取数字引脚%1,  模拟引脚%2上的PM2.5传感器数值",
  args0: [
    { type: "field_dropdown", name: "DPIN", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] },
    { type: "field_dropdown", name: "APIN", options: [['1', "1"], ['2', "2"], ['13', "13"], ['14', "14"], ['20', "20"]] }
  ],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_pm25Read'] = function (block) {
  const dpin = block.getFieldValue('DPIN')
  const apin = block.getFieldValue("APIN")
  pythonGenerator.definitions_["from_machine_import_PM25"] = "from machine import PM25\n"
  pythonGenerator.definitions_[`pm25_${dpin}${apin}_init`] = `pm${dpin}${apin} = PM25(${dpin}, ${apin})\n`
  return [`pm${dpin}${apin}.read()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_pm25Read'] = function (block) {
  const dpin = block.getFieldValue('DPIN')
  const apin = block.getFieldValue("APIN")
  return [`spRead("tag_short", 255,85,13,${dpin},${apin},0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木：水温 */
blockInit("dsx_ds18b20Read", {
  message0: "读取引脚%1水温传感器数值",
  args0: [
    { type: "field_dropdown", name: "PIN", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] },
  ],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_ds18b20Read'] = function (block) {
  const pin = block.getFieldValue('PIN')
  pythonGenerator.definitions_["from_machine_import_Ds18b20"] = "from machine import Ds18b20\n"
  pythonGenerator.definitions_[`ds18b20_${pin}_init`] = `ds18b20_${pin} = Ds18b20(${pin})\n`
  return [`ds18b20_${pin}.readtemp()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_ds18b20Read'] = function (block) {
  const pin = block.getFieldValue('PIN')
  return [`spRead("tag_short", 255,85,15,${pin},0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: DHT11温湿度 */
blockInit("dsx_dht11Read", {
  message0: "读取引脚%1DHT11传感器%2",
  args0: [
    { type: "field_dropdown", name: "PIN", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] },
    { type: "field_dropdown", name: "OPT", options: [["温度值", "温度值"], ["湿度值", "湿度值"]]}
  ],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_dht11Read'] = function (block) {
  const pin = block.getFieldValue('PIN')
  const opt = block.getFieldValue('OPT')
  pythonGenerator.definitions_["from_machine_import_DHT11"] = "from machine import DHT11\n"
  pythonGenerator.definitions_[`dht11_${pin}_init`] = `dht11_${pin}= DHT11(${pin})\n`
  
  if (opt == "温度值") return [`dht11_${pin}.readTem()`, pythonGenerator.ORDER_ATOMIC]
  else return [`dht11_${pin}.readHum()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_dht11Read'] = function (block) {
  const pin = block.getFieldValue('PIN')
  const opt = block.getFieldValue('OPT')
  let optV = opt=="温度值" ? 11 : 12
  return [`spRead("tag_float", 255,85,${optV},${pin},0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: 称重 */
blockInit("dsx_weighRead", {
  message0: "读取SCK:引脚%1,  DT:引脚%2上称重传感器的值",
  args0: [
    { type: "field_dropdown", name: "SCK", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] },
    { type: "field_dropdown", name: "DT", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] },
  ],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_weighRead'] = function (block) {
  const sck = block.getFieldValue('SCK')
  const dt = block.getFieldValue('DT')
  pythonGenerator.definitions_["from_machine_import_Weigh"] = "from machine import Weigh\n"
  pythonGenerator.definitions_[`weigh${sck}${dt}_init`] = `weigh${sck}${dt} = Weigh(${sck}, ${dt})\n`
  return [`weigh${sck}${dt}.read()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_weighRead'] = function (block) {
  const sck = block.getFieldValue('SCK')
  const dt = block.getFieldValue('DT')
  return [`spRead("tag_short", 255,85,14,${sck},${dt},0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: 颜色识别 */
blockInit("dsx_colorRead", {
  message0: "读取编号%1颜色识别传感器的值",
  args0: [
    { type: "field_dropdown", name: "ID", options: [['1', "1"], ['2', "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]] }
  ],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_colorRead'] = function (block) {
  const id = block.getFieldValue('ID')
  pythonGenerator.definitions_["from_machine_import_Color"] = "from machine import Color\n"
  pythonGenerator.definitions_[`col${id}_init`] = `col${id} = Color(${id})\n`
  return [`col${id}.readColor()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_colorRead'] = function (block) {
  const id = block.getFieldValue('ID')
  return [`spRead("tag_uint8", 255,85,49,${id},0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: 超声波测距 */
blockInit("dsx_ultrasonicRead", {
  message0: "读取T:引脚%1,  E:引脚%2上的超声波测距传感器的值",
  args0: [
    { type: "field_dropdown", name: "T", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] },
    { type: "field_dropdown", name: "E", options: [['1', "1"], ['2', "2"], ['5', "5"], ['8', "8"], ['11', "11"], ['12', "12"],['13', "13"], ['14', "14"], ['15', "15"], ['19', "19"], ['20', "20"]] }
  ],
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_ultrasonicRead'] = function (block) {
  const t = block.getFieldValue('T'), e = block.getFieldValue('E')
  pythonGenerator.definitions_["from_machine_import_Ultrasonic"] = "from machine import Ultrasonic\n"
  pythonGenerator.definitions_[`ultr${t}${e}_init`] = `ultr${t}${e} = Ultrasonic(${t}, ${e})\n`
  return [`ultr${t}${e}.readDistance()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_ultrasonicRead'] = function (block) {
  const t = block.getFieldValue('T'), e = block.getFieldValue('E') // 高4位T, 低4位E
  let p = (t << 4) + e
  return [`spRead("tag_float", 255,85,49,${p},0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* 积木: IC射频 */
blockInit("dsx_rfidRead", {
  message0: "读取射频IC卡的编号",
  previousStatement: undefined,
  nextStatement: undefined,
  output: "Number"
})

pythonGenerator.forBlock['dsx_rfidRead'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_RFID"] = "from machine import RFID\n"
  pythonGenerator.definitions_[`rfid_init`] = `rfid = RFID()\n`
  return [`rfid.readCode()`, pythonGenerator.ORDER_ATOMIC]
}
javascriptGenerator.forBlock['dsx_rfidRead'] = function (block) {
  return [`spRead("tag_int", 255,85,52,0,0,0,0,0)`, javascriptGenerator.ORDER_ATOMIC]
}

/* -------------- 显示 --------------- */
/* 积木: 屏显字符 */
blockInit("dsx_oledStr", {
  message0: "屏幕位置x:%1、y:%2显示字符%3( 模式: %4)",
  args0: [
    { type: "input_value", name: "X", check: "Number"},
    { type: "input_value", name: "Y", check: "Number"},
    { type: "input_value", name: "CTX", check: "String"},
    { type: "field_dropdown", name: "OPT", options: [['大字正显', '大字正显'], ['小字正显', '小字正显'], ['大字反显', '大字反显'],  ['小字反显', '小字反显']] },
  ],
  tooltip: "以屏幕左上角为坐标原点，x正半轴为左至右，y正半轴为上至下；长度不超过17个字符"
})

pythonGenerator.forBlock['dsx_oledStr'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_OLED"] = "from machine import OLED\n"
  pythonGenerator.definitions_[`oled_init`] = `oled= OLED()\n`
  const x = pythonGenerator.valueToCode(block, 'X', pythonGenerator.ORDER_ATOMIC) || 0, y = pythonGenerator.valueToCode(block, 'Y', pythonGenerator.ORDER_ATOMIC) || 0, ctx = pythonGenerator.valueToCode(block, 'CTX', pythonGenerator.ORDER_ATOMIC) || "hello", 
  opt = block.getFieldValue('OPT')
  let opt1 = "big", opt2 = "forward"
  switch (opt) {
    case "小字正显": opt1 = "small"; break;
    case "大字反显": opt2 = "reverse"; break;
    case "小字反显": opt1 = "small"; opt2 = "reverse"; break;
  }
  return `oled.displayStr(${x}, ${y}, '${opt1}', '${opt2}', ${ctx})\n`
}
javascriptGenerator.forBlock['dsx_oledStr'] = function (block) {
  const x = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC) || 0, y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC) || 0, ctx = javascriptGenerator.valueToCode(block, 'CTX', javascriptGenerator.ORDER_ATOMIC) || "hello", 
  opt = block.getFieldValue('OPT')
  let optV = 17
  switch (opt) {
    case "小字正显": optV = 1; break;
    case "大字反显": optV = 16; break;
    case "小字反显": optV = 0; break;
  }
  return `spOledStrWrite(${x}, ${y}, ${optV}, ${ctx})\n`
}

/* 积木: 屏显数字 */
blockInit("dsx_oledNum", {
  message0: "屏幕位置x:%1、y:%2显示数值%3( 模式: %4)",
  args0: [
    { type: "input_value", name: "X", check: "Number"},
    { type: "input_value", name: "Y", check: "Number"},
    { type: "input_value", name: "NUM", check: "Number"},
    { type: "field_dropdown", name: "OPT", options: [['大字正显', '大字正显'], ['小字正显', '小字正显'], ['大字反显', '大字反显'],  ['小字反显', '小字反显']] },
  ],
  tooltip: "以屏幕左上角为坐标原点，x正半轴为左至右，y正半轴为上至下"
})

pythonGenerator.forBlock['dsx_oledNum'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_OLED"] = "from machine import OLED\n"
  pythonGenerator.definitions_[`oled_init`] = `oled= OLED()\n`
  const x = pythonGenerator.valueToCode(block, 'X', pythonGenerator.ORDER_ATOMIC) || 0, y = pythonGenerator.valueToCode(block, 'Y', pythonGenerator.ORDER_ATOMIC) || 0, num = pythonGenerator.valueToCode(block, 'NUM', pythonGenerator.ORDER_ATOMIC) || 123.4, 
  opt = block.getFieldValue('OPT')
  let opt1 = "big", opt2 = "forward"
  switch (opt) {
    case "小字正显": opt1 = "small"; break;
    case "大字反显": opt2 = "reverse"; break;
    case "小字反显": opt1 = "small"; opt2 = "reverse"; break;
  }
  return `oled.displayNum(${x}, ${y}, '${opt1}', '${opt2}', ${num})\n`
}
javascriptGenerator.forBlock['dsx_oledNum'] = function (block) {
  const x = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC) || 0, y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC) || 0, num = javascriptGenerator.valueToCode(block, 'NUM', javascriptGenerator.ORDER_ATOMIC) || 123.4, 
  opt = block.getFieldValue('OPT')
  let optV = 17
  switch (opt) {
    case "小字正显": optV = 1; break;
    case "大字反显": optV = 16; break;
    case "小字反显": optV = 0; break;
  }
  return `spOledNumWrite(${x},${y},${optV},${num})\n`
}

/* 积木: 屏显汉字 */
blockInit("dsx_oledCh", {
  message0: "屏幕位置x:%1、y:%2显示中文%3( 模式: %4)",
  args0: [
    { type: "input_value", name: "X", check: "Number"},
    { type: "input_value", name: "Y", check: "Number"},
    { type: "input_value", name: "CTXCH", check: "String"},
    { type: "field_dropdown", name: "OPT", options: [['正显', 'forward'], ['反显', 'reverse']] },
  ],
  tooltip: "以屏幕左上角为坐标原点，x正半轴为左至右，y正半轴为上至下；长度不超过13个汉字"
})

pythonGenerator.forBlock['dsx_oledCh'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_OLED"] = "from machine import OLED\n"
  pythonGenerator.definitions_[`oled_init`] = `oled= OLED()\n`
  const x = pythonGenerator.valueToCode(block, 'X', pythonGenerator.ORDER_ATOMIC) || 0, y = pythonGenerator.valueToCode(block, 'Y', pythonGenerator.ORDER_ATOMIC) || 0, ctxCh = pythonGenerator.valueToCode(block, 'CTXCH', pythonGenerator.ORDER_ATOMIC) || '你好', 
  opt = block.getFieldValue('OPT')
  return `oled.displayChinese(${x}, ${y}, '${opt}', ${ctxCh})\n`
}
javascriptGenerator.forBlock['dsx_oledCh'] = function (block) {
  const x = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC) || 0, y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC) || 0, ctxCh = javascriptGenerator.valueToCode(block, 'CTXCH', javascriptGenerator.ORDER_ATOMIC) || '你好', 
  opt = block.getFieldValue('OPT')
  let optV = Number(opt == "forward")
  return `spOledChWrite(${x}, ${y}, ${optV}, ${ctxCh})\n`
}

/* 积木: 显示生效 */
blockInit("dsx_oledEnable", {
  message0: "生效屏显内容",
})

pythonGenerator.forBlock['dsx_oledEnable'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_OLED"] = "from machine import OLED\n"
  pythonGenerator.definitions_[`oled_init`] = `oled= OLED()\n`
  return `oled.enableDisplay()`
}
javascriptGenerator.forBlock['dsx_oledEnable'] = function (block) {
  return `spWrite(255,85,173,0,0,0,0,0)\n`
}

/* 积木: 清屏 */
blockInit("dsx_oledClear", {
  message0: "清空屏显内容",
})

pythonGenerator.forBlock['dsx_oledClear'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_OLED"] = "from machine import OLED\n"
  pythonGenerator.definitions_[`oled_init`] = `oled= OLED()\n`
  return `oled.clear()\n`
}
javascriptGenerator.forBlock['dsx_oledClear'] = function (block) {
  return `spWrite(255,85,172,0,0,0,0,0)\n`
}

/* ------------ 放音 ------------- */
/* 积木: 蜂鸣器发声 */
blockInit("dsx_buzzer", {
  message0: "设置板载蜂鸣器以音调%1发声",
  args0: [{ type: "field_dropdown", name: "TUNE", options: [['E7', 'E7'], ['F7', 'F7'], ['G7', 'G7'], ['A7', 'A7'], ['B7', 'B7'], ['C8', 'C8'], ['D8', 'D8']] },],
})

pythonGenerator.forBlock['dsx_buzzer'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_Buzzer"] = "from machine import Buzzer\n"
  pythonGenerator.definitions_[`buzzer_init`] = `buzzer = Buzzer()\n`
  const tune = block.getFieldValue('TUNE')
  return `buzzer.tone('${tune}')\n`
}
const tuneTab = {E7: 2637, F7: 2794, G7: 3136, A7: 3520, B7: 3951, C8: 4186, D8: 4699}
javascriptGenerator.forBlock['dsx_buzzer'] = function (block) {
  const tune = block.getFieldValue('TUNE')
  const t = unsignedShortToByte2(tuneTab[tune])
  return `spWrite(255,85,132,0,${t[0]},${t[1]},0,0)\n`
}

/* 积木：蜂鸣器关闭 */
blockInit("dsx_buzzerClose", {
  message0: "设置板载蜂鸣器关闭",
})
pythonGenerator.forBlock['dsx_buzzerClose'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_Buzzer"] = "from machine import Buzzer\n"
  pythonGenerator.definitions_[`buzzer_init`] = `buzzer = Buzzer()\n`
  return `buzzer.close()\n`
}
javascriptGenerator.forBlock['dsx_buzzerClose'] = function (block) {
  return `spWrite(255,85,132,255,0,0,0,0)\n`
}

/* 积木: 语音合成模式设置 */
var optArr = Array(17).fill(0).map((v, i) => String(i))
blockInit("dsx_ttsSet", {
  message0: "设置语音合成前景音量:%1,  背景音量:%2,  语速:%3",
  args0: [
    { type: "field_dropdown", name: "FOREVOL", options: genOpt(optArr)},
    { type: "field_dropdown", name: "BACKVOL", options: genOpt(optArr)},
    { type: "field_dropdown", name: "SPEED", options: genOpt(Array(6).fill(0).map((v,i)=>String(i)))}
  ],
  tooltip: "前景音量影响播放文本音量；背景音量影响背景乐音量"
})

pythonGenerator.forBlock['dsx_ttsSet'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_TTS"] = "from machine import TTS\n"
  pythonGenerator.definitions_[`tts_init`] = `tts = TTS()\n`
  const foreVol = block.getFieldValue('FOREVOL'), backVol = block.getFieldValue('BACKVOL'), speed = block.getFieldValue('SPEED')
  return `tts.setMode(${foreVol}, ${backVol}, ${speed})\n`
}
javascriptGenerator.forBlock['dsx_ttsSet'] = function (block) {
  const foreVol = block.getFieldValue('FOREVOL'), backVol = block.getFieldValue('BACKVOL'), speed = block.getFieldValue('SPEED')
  return `spWrite(255,85,141,1,0,${foreVol},${backVol},${speed})\n`
}

/* 积木: mp3播放模式 */
blockInit("dsx_mp3PlayMode", {
  message0: "设置MP3播放模式为%1",
  args0: [{ type: "field_dropdown", name: "MODE", options: [["播放/暂停", "1"], ["停止", "2"], ["下一首", "3"], ["上一首", "4"]] }],
})

pythonGenerator.forBlock['dsx_mp3PlayMode'] = function (block) {
  pythonGenerator.definitions_["from_machine_import_MP3Player"] = "from machine import MP3Player\n"
  pythonGenerator.definitions_[`mp3_init`] = `mp3 = MP3Player()\n`
  const mode = block.getFieldValue('MODE')
  return `mp3.setPlayMode(${mode})\n`
}
javascriptGenerator.forBlock['dsx_mp3PlayMode'] = function (block) {
  const mode = block.getFieldValue('MODE')
  return `spWrite(255,85,151,1,${mode},0,0,0)\n`
}

