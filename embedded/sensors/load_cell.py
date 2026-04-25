import time
from hx711 import HX711
from config import (
    TRAY_LOADCELL_DT, TRAY_LOADCELL_SCK,
    CONTAINER_LOADCELL_DT, CONTAINER_LOADCELL_SCK,
    TRAY_LOADCELL_REFERENCE_UNIT, CONTAINER_LOADCELL_REFERENCE_UNIT,
    STABLE_WEIGHT_DURATION_SECONDS,
    STABLE_WEIGHT_POLL_INTERVAL_SECONDS,
    STABLE_WEIGHT_TOLERANCE_GRAMS
)

class LoadCell:
    def __init__(self, dt_pin, sck_pin, reference_unit, name="LoadCell"):
        self.name = name
        self.hx = HX711(dt_pin, sck_pin)
        self.hx.set_reading_format("MSB", "MSB")
        self.hx.set_reference_unit(reference_unit)
        self.hx.reset()
        self.hx.tare()
        print(f"[{self.name}] Ready.")

    def get_weight(self, readings=5):
        weight = self.hx.get_weight(readings)
        self.hx.power_down()
        self.hx.power_up()
        return max(0, round(weight, 1))

    def tare(self):
        self.hx.tare()
        print(f"[{self.name}] Tared.")

    def wait_for_stable_weight(self):
        """
        Poll until weight is stable for STABLE_WEIGHT_DURATION_SECONDS.
        Returns the stable weight reading.
        """
        print(f"[{self.name}] Waiting for stable weight...")
        stable_start = None
        last_weight = self.get_weight()

        while True:
            time.sleep(STABLE_WEIGHT_POLL_INTERVAL_SECONDS)
            current_weight = self.get_weight()
            delta = abs(current_weight - last_weight)

            if delta <= STABLE_WEIGHT_TOLERANCE_GRAMS:
                if stable_start is None:
                    stable_start = time.time()
                elif time.time() - stable_start >= STABLE_WEIGHT_DURATION_SECONDS:
                    print(f"[{self.name}] Stable at {current_weight}g")
                    return current_weight
            else:
                # Weight changed — reset the stability timer
                stable_start = None

            last_weight = current_weight


def create_load_cells():
    tray = LoadCell(
        TRAY_LOADCELL_DT,
        TRAY_LOADCELL_SCK,
        TRAY_LOADCELL_REFERENCE_UNIT,
        name="TrayLoadCell"
    )
    container = LoadCell(
        CONTAINER_LOADCELL_DT,
        CONTAINER_LOADCELL_SCK,
        CONTAINER_LOADCELL_REFERENCE_UNIT,
        name="ContainerLoadCell"
    )
    return tray, container