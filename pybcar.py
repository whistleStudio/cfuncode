""" moveByT 按时间非巡线基础运动"""
# from pyb import DCMotor
# from time import sleep_ms

# dc_motor1 = DCMotor(1)
# dc_motor2 = DCMotor(2)

# def moveByT (speed, dir, t, flag=True):
#   global dc_motor1, dc_motor2
#   if dir == 0:
#     dc_motor1.setDirPower("forward", speed)
#     dc_motor2.setDirPower("forward", speed)
#   elif dir == 1:
#     dc_motor1.setDirPower("reverse", speed)
#     dc_motor2.setDirPower("reverse", speed)
#   elif dir == 2:
#     dc_motor1.setDirPower("reverse", speed)
#     dc_motor2.setDirPower("forward", speed)
#   else:
#     dc_motor1.setDirPower("forward", speed)
#     dc_motor2.setDirPower("reverse", speed)
#   sleep_ms(int(t * 1000))
#   if flag:
#     dc_motor1.setDirPower("forward", 0)
#     dc_motor2.setDirPower("forward", 0)

""" grayTest 灰度测试 (adc_1,2,3,4 动态获取， 与setGray有关)"""
# from pyb import OLED
# from pyb import ADC
# from time import sleep_ms
# oled= OLED()

# def  grayTest(adc_1, adc_2, adc_3, adc_4):
#   oled.clear()
#   oled.displayNum(1,  1, "big", "forward", adc_1.read())
#   oled.displayNum(17, 1, "big", "forward", adc_2.read())
#   oled.displayNum(33, 1, "big", "forward", adc_3.read())
#   oled.displayNum(49, 1, "big", "forward", adc_4.read())
#   sleep_ms(int(0.5 * 1000))
  


""" tTrack 按时循迹 """
# from pyb import InTimer
# from pyb import CarTrack

# tim_in = InTimer()
# carTrack = CarTrack()

# def  tTrack(speed, t):
#   tim_in.setZero()
#   while not ((tim_in.current()) > t):
#     carTrack.trackPow(speed)
#   carTrack.stopTask()


""" crossTrack 路口循迹 """
# from pyb import InTimer
# from pyb import CarTrack

# tim_in = InTimer()
# carTrack = CarTrack()

# def  tTrack(speed, t):
#   tim_in.setZero()
#   while not ((tim_in.current()) > t):
#     carTrack.trackPow(speed)
#   carTrack.stopTask()

# def  crossTrack(speed, count, crossType, t):
#   num = 0
#   while not (num == count) :
#     carTrack.trackPowRoad(speed, crossType)
#     while not carTrack.taskok():
#       pass
#     tTrack(speed, t)
#     num += 1

""" crossTurn 路口转弯 (adcMidL, adcMidR, threshold与setGray有关)"""
from pyb import DCMotor
from time import sleep_ms
from pyb import ADC

dc_motor1 = DCMotor(1)
dc_motor2 = DCMotor(2)

def moveByT (speed, dir, t, flag=True):
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
    dc_motor2.setDirPower("forward", 0)

def crossTurn(speed, dir, count, t, stopPos, adcMidL, adcMidR, threshold):
  num = 0
  while not (num == count) :
    moveByT(speed, dir, t, False)
    if stopPos == "stopMid": # 停黑线中间
      while not ((adcMidL.read() < threshold-50) and (adcMidR.read() < threshold-50)):
        pass
    elif stopPos == "stopLeft": 
      if dir == 2: # 左转停黑线左侧
        while not (adcMidR.read() < threshold-100):
          pass
      else: # 右转停黑线左侧
        while not (adcMidR.read() < threshold-50):
          pass
    else:
      if dir == 2: # 左转停黑线右侧
        while not (adcMidL.read() < threshold-50):
          pass
      else: # 右转停黑线左侧
        while not (adcMidL.read() < threshold-100):
          pass
    num += 1
  moveByT(0, 0, 0) # 停止