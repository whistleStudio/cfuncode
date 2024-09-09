""" moveByT """
# from pyb import DCMotor
# from time import sleep_ms

# dc_motor1 = DCMotor(1)
# dc_motor2 = DCMotor(2)

# def moveByT (speed, dir, t):
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
#   sleep_ms(t * 1000)
#   dc_motor1.setDirPower("forward", 0)
#   dc_motor2.setDirPower("forward", 0)

""" grayTest """
from pyb import OLED
from pyb import ADC
from time import sleep_ms
oled= OLED()
adc1 = ADC("A0")
adc2 = ADC("A2")
adc3 = ADC("A4")
adc4 = ADC("A6")

def  grayTest():
  oled.clear()
  oled.displayNum(1,1,"big","forward",adc1.read())
  oled.displayNum(17,1,"big","forward",adc2.read())
  oled.displayNum(33,1,"big","forward",adc3.read())
  oled.displayNum(49,1,"big","forward",adc4.read())
  sleep_ms(int(0.5 * 1000))
  



