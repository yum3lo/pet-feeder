import os
from dotenv import load_dotenv

load_dotenv()

MQTT_BROKER_URL = os.getenv("MQTT_BROKER_URL")
MQTT_PORT = int(os.getenv("MQTT_PORT", 8883))
MQTT_USERNAME = os.getenv("MQTT_USERNAME")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")

DEVICE_ID = os.getenv("DEVICE_ID", "feeder_01")

# Pin numbers
MOTOR_PIN = 22   # GPIO22, pin 15

TRAY_LOADCELL_DT = 5   # GPIO5, pin 29
TRAY_LOADCELL_SCK = 6   # GPIO6, pin 31

CONTAINER_LOADCELL_DT = 27   # GPIO27, pin 13
CONTAINER_LOADCELL_SCK = 17   # GPIO17, pin 11

TRAY_LOADCELL_REFERENCE_UNIT = 3978.9479
CONTAINER_LOADCELL_REFERENCE_UNIT = -4137.6555

# Distance sensor
MIN_DETECTION_MM = 130
MAX_DETECTION_MM = 320

# Feeding
STABLE_WEIGHT_DURATION_SECONDS = 60
STABLE_WEIGHT_POLL_INTERVAL_SECONDS = 2
STABLE_WEIGHT_TOLERANCE_GRAMS = 2
LOW_FOOD_THRESHOLD_GRAMS = 100

# Camera
CAMERA_WARMUP_FRAMES = 30
TRAINING_CAPTURE_SECONDS = 8

# MQQT topics
def topics(device_id):
    return {
        # Backend -> Pi (commands)
        "dispense":         f"feeder/{device_id}/commands/dispense",
        "capture_photos":   f"feeder/{device_id}/commands/capture_photos",
        "detection": f"feeder/{device_id}/commands/detection",

        # Pi -> Backend (results)
        "feeding_result":   f"feeder/{device_id}/results/feeding",
        "training_photos":  f"feeder/{device_id}/results/photos",

        # Pi -> Backend (data)
        "movement_image":   f"feeder/{device_id}/data/movement_image",
        "container_weight": f"feeder/{device_id}/data/container_weight",

        # Backend -> Pi (recognition response)
        "recognition_result": f"feeder/{device_id}/results/recognition",

        # Status
        "heartbeat":        f"feeder/{device_id}/status/heartbeat",
        "error":            f"feeder/{device_id}/status/error",
    }