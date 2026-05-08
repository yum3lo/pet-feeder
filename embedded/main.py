import time
import threading
import signal
import sys

from config import DEVICE_ID, topics
from mqtt_client import MQTTClient
from sensors.motor import Motor
from sensors.load_cell import create_load_cells
from sensors.distance_sensor import DistanceSensor
from sensors.camera import Camera
from feeding.feeding_controller import FeedingController

TOPICS = topics(DEVICE_ID)

def sensor_loop(distance_sensor, camera, mqtt_client, feeding_controller):
    print("[SENSOR THREAD] Starting.")

    last_detection_time = 0
    DETECTION_COOLDOWN_SECONDS = 5

    while True:
        try:
            # pausing detection while pet is eating
            if feeding_controller.eating_in_progress or feeding_controller.capturing_photos:
                time.sleep(0.2)
                continue

            if distance_sensor.is_pet_detected():
                if not mqtt_client.detection_enabled:
                    time.sleep(0.2)
                    continue

                now = time.time()
                if now - last_detection_time < DETECTION_COOLDOWN_SECONDS:
                    time.sleep(0.2)
                    continue

                last_detection_time = now
                print("[SENSOR THREAD] Movement detected - capturing image.")

                image_b64 = camera.capture_base64()
                if image_b64 is None:
                    time.sleep(0.2)
                    continue

                mqtt_client.publish_movement_image(image_b64)

            time.sleep(0.2)

        except Exception as e:
            print(f"[SENSOR THREAD] Error: {e}")
            time.sleep(1)


def sensor_reporting_loop(container_load_cell, mqtt_client):
    while True:
        try:
            container_w = container_load_cell.get_weight()
            mqtt_client.publish_container_weight(container_w)
        except Exception as e:
            print(f"[SENSOR REPORTING] Error: {e}")
        time.sleep(30)


def main():
    print(f"[MAIN] Starting Smart Pet Feeder - device: {DEVICE_ID}")

    # initializing hardware
    tray_load_cell, container_load_cell = create_load_cells()
    distance_sensor = DistanceSensor()
    camera = Camera()
    motor = Motor()

    # temporary placeholder so the lambda can reference it before assignment
    feeding_controller_ref = [None]

    # initializing MQTT
    mqtt_client = MQTTClient(
        on_dispense=lambda pet_id, grams: feeding_controller_ref[0].handle_dispense_command(pet_id, grams),
        on_capture_photos=lambda pet_id, dur: feeding_controller_ref[0].handle_capture_photos(pet_id, dur),
    )

    feeding_controller = FeedingController(
        motor=motor,
        tray_load_cell=tray_load_cell,
        container_load_cell=container_load_cell,
        camera=camera,
        distance_sensor=distance_sensor,
        mqtt_client=mqtt_client,
    )
    feeding_controller_ref[0] = feeding_controller

    mqtt_client.connect()

    print("[MAIN] Waiting for MQTT connection...")
    for _ in range(30):
        if mqtt_client.connected:
            break
        time.sleep(1)
    else:
        print("[MAIN] Could not connect to MQTT broker. Exiting.")
        sys.exit(1)

    threading.Thread(
        target=sensor_loop,
        args=(distance_sensor, camera, mqtt_client, feeding_controller),
        daemon=True,
        name="SensorThread"
    ).start()

    threading.Thread(
        target=sensor_reporting_loop,
        args=(container_load_cell, mqtt_client),
        daemon=True,
        name="SensorReportingThread"
    ).start()

    print("[MAIN] All threads started. Running.")

    def shutdown(sig, frame):
        print("\n[MAIN] Shutting down...")
        mqtt_client.disconnect()
        camera.release()
        motor.cleanup()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    while True:
        time.sleep(1)


if __name__ == "__main__":
    main()