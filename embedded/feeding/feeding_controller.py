import time
import threading

class FeedingController:
    def __init__(self, motor, tray_load_cell, container_load_cell,
                 camera, distance_sensor, mqtt_client):
        self.motor = motor
        self.tray = tray_load_cell
        self.container = container_load_cell
        self.camera = camera
        self.distance_sensor = distance_sensor
        self.mqtt = mqtt_client
        self._feeding_lock = threading.Lock()
        self.eating_in_progress = False
        self.capturing_photos = False
        self.eating_in_progress = False
        self.awaiting_recognition = False
        self._processed_log_ids = set()

        # recognition result is set by mqtt callback
        self._recognition_result = {"petId": None}
        self._recognition_event = threading.Event()

    def on_recognition_result(self, pet_id, confidence):
        """Called by MQTT client when backend sends recognition response."""
        self._recognition_result["petId"] = pet_id
        self._recognition_result["confidence"] = confidence
        self._recognition_event.set()

    def handle_dispense_command(self, scheduled_pet_id, portion_grams, log_id=None):
        """Called when backend sends a scheduled or manual dispense command."""
        if log_id is not None and log_id in self._processed_log_ids:
            print(f"[FEEDING] Duplicate dispense (logId={log_id}) -> ignoring.")
            return
        if log_id is not None:
            self._processed_log_ids.add(log_id)

        if not self._feeding_lock.acquire(blocking=False):
            print("[FEEDING] Already dispensing - ignoring duplicate command.")
            return

        try:
            print(f"[FEEDING] Dispense for pet={scheduled_pet_id}, "
                  f"portion={portion_grams}g")

            # checking container level
            container_weight = self.container.get_weight()
            if container_weight < portion_grams:
                print("[FEEDING] Not enough food in container.")
                self.mqtt.publish_error(
                    "LOW_FOOD",
                    f"Container has {container_weight}g, need {portion_grams}g"
                )
                return

            # recording tray weight before dispensing
            weight_before = self.tray.get_weight()

            # dispensing
            dispensed_g = self.motor.dispense(portion_grams, self.tray)

            # disabling distance sensor while pet is eating
            self.eating_in_progress = True
            print("[FEEDING] Eating in progress - distance sensor paused.")

            # wait for stable weight (pet finished eating)
            stable_weight = self.tray.wait_for_stable_weight()

            # calculating consumption
            consumed_g = max(0, round(weight_before + dispensed_g - stable_weight, 1))
            leftover_g = max(0, round(stable_weight - weight_before, 1))

            print(f"[FEEDING] Consumed: {consumed_g}g, Leftover: {leftover_g}g")

            # re-enabling distance sensor
            self.eating_in_progress = False
            print("[FEEDING] Eating done - distance sensor re-enabled.")

            print("[FEEDING] Waiting for pet recognition...")
            self._recognition_event.clear()
            self.awaiting_recognition = True

            recognised = self._recognition_event.wait(timeout=15)
            self.awaiting_recognition = False

            if recognised:
                actual_pet_id = self._recognition_result["petId"]
                print(f"[FEEDING] Recognised: {actual_pet_id}")
            else:
                print("[FEEDING] No recognition within timeout.")
                actual_pet_id = scheduled_pet_id

            self.mqtt.publish_feeding_result(
                scheduled_pet_id=scheduled_pet_id,
                actual_pet_id=actual_pet_id,
                dispensed_g=dispensed_g,
                consumed_g=consumed_g,
                leftover_g=leftover_g,
            )

        except Exception as e:
            print(f"[FEEDING] Error: {e}")
            self.mqtt.publish_error("DISPENSE_ERROR", str(e))
            self.eating_in_progress = False
            self.awaiting_recognition = False

        finally:
            self._feeding_lock.release()

    def handle_capture_photos(self, pet_id, duration_seconds):
        """Called when backend requests training photo capture."""
        self.capturing_photos = True
        try:
            print(f"[FEEDING] Capturing training photos for pet {pet_id}...")
            photos = self.camera.capture_training_photos(pet_id, duration_seconds)
            self.mqtt.publish_training_photos(pet_id, photos)
        finally:
            self.capturing_photos = False