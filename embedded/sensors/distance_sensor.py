import time
import board
import busio
import adafruit_vl53l0x
from config import MIN_DETECTION_MM, MAX_DETECTION_MM

class DistanceSensor:
    def __init__(self):
        i2c = busio.I2C(board.SCL, board.SDA)
        self.sensor = adafruit_vl53l0x.VL53L0X(i2c)
        print("[DISTANCE] Ready.")

    def get_distance_mm(self):
        return self.sensor.range

    def is_pet_detected(self):
        distance = self.get_distance_mm()
        return MIN_DETECTION_MM <= distance <= MAX_DETECTION_MM