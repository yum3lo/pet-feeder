import board
import busio
import adafruit_vl53l0x
import time

i2c = busio.I2C(board.SCL, board.SDA)
sensor = adafruit_vl53l0x.VL53L0X(i2c)

print("Reading distances. Press Ctrl+C to stop.\n")

try:
    while True:
        distance_mm = sensor.range
        print(f"Distance: {distance_mm}mm ({distance_mm/10:.1f}cm)")
        time.sleep(0.2)

except KeyboardInterrupt:
    print("\nDone.")