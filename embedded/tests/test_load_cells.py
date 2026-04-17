import RPi.GPIO as GPIO
import time
from hx711 import HX711

TRAY_DT = 5
TRAY_SCK = 6
CONTAINER_DT = 27
CONTAINER_SCK = 17

def setup_hx711(dt_pin, sck_pin):
    hx = HX711(dt_pin, sck_pin)
    hx.set_reading_format("MSB", "MSB")
    hx.set_reference_unit(1)
    hx.reset()
    hx.tare()
    return hx

def get_raw_average(hx, times=10):
    readings = []
    for _ in range(times):
        val = hx.get_weight(5)
        readings.append(val)
        time.sleep(0.1)
    return sum(readings) / len(readings)

print("=== LOAD CELL CALIBRATION ===")
print("Setting up tray load cell (200g)...")
tray_hx = setup_hx711(TRAY_DT, TRAY_SCK)

print("Setting up container load cell (750g)...")
container_hx = setup_hx711(CONTAINER_DT, CONTAINER_SCK)

print("\nBoth load cells tared")
print("Place a known weight on the TRAY load cell and press Enter...")
input()

raw_tray = get_raw_average(tray_hx)
known_weight = float(input(f"Raw reading: {raw_tray:.1f}. Enter the actual weight in grams: "))
tray_reference_unit = raw_tray / known_weight
print(f"Tray reference unit: {tray_reference_unit:.4f}")

print("\nPlace a known weight on the CONTAINER load cell and press Enter...")
input()

raw_container = get_raw_average(container_hx)
known_weight_c = float(input(f"Raw reading: {raw_container:.1f}. Enter the actual weight in grams: "))
container_reference_unit = raw_container / known_weight_c
print(f"Container reference unit: {container_reference_unit:.4f}")

print("\n=== LIVE WEIGHING TEST ===")
print("Setting calibrated reference units...")
tray_hx.set_reference_unit(tray_reference_unit)
tray_hx.tare()
container_hx.set_reference_unit(container_reference_unit)
container_hx.tare()

print("Reading weights every second. Press Ctrl+C to stop.\n")
try:
    while True:
        tray_w = tray_hx.get_weight(5)
        container_w = container_hx.get_weight(5)
        print(f"Tray: {tray_w:.1f}g | Container: {container_w:.1f}g")
        tray_hx.power_down()
        tray_hx.power_up()
        container_hx.power_down()
        container_hx.power_up()
        time.sleep(1)
except KeyboardInterrupt:
    print("\nDone.")
finally:
    GPIO.cleanup()