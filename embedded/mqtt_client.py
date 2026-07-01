import paho.mqtt.client as mqtt
import ssl
import json
import time
from config import (
    MQTT_BROKER_URL, MQTT_PORT,
    MQTT_USERNAME, MQTT_PASSWORD,
    DEVICE_ID, topics
)

TOPICS = topics(DEVICE_ID)


class MQTTClient:
    def __init__(self, on_dispense=None, on_capture_photos=None, on_recognition_result=None):
        self.on_dispense = on_dispense
        self.on_capture_photos = on_capture_photos
        self.on_recognition_result = on_recognition_result
        self.detection_enabled = False  # disabled until model is trained
        self.connected = False

        self.client = mqtt.Client(client_id=DEVICE_ID, clean_session=False)
        self.client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
        self.client.tls_set(tls_version=ssl.PROTOCOL_TLS)
        self.client.will_set(
            TOPICS["heartbeat"],
            json.dumps({"status": "offline"}),
            qos=1,
            retain=True,
        )

        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message

    def connect(self):
        print(f"[MQTT] Connecting to {MQTT_BROKER_URL}:{MQTT_PORT}...")
        self.client.connect(MQTT_BROKER_URL, MQTT_PORT, keepalive=60)
        self.client.loop_start()

    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self.connected = True
            print("[MQTT] Connected.")
            client.publish(TOPICS["heartbeat"], json.dumps({"status": "online"}), qos=1, retain=True)
            client.subscribe(TOPICS["dispense"], qos=0)
            client.subscribe(TOPICS["capture_photos"], qos=0)
            client.subscribe(TOPICS["recognition_result"], qos=0)
            client.subscribe(TOPICS["detection"], qos=0)
            print("[MQTT] Subscribed to command topics.")
        else:
            print(f"[MQTT] Connection failed with code {rc}.")

    def _on_disconnect(self, client, userdata, rc):
        self.connected = False
        print(f"[MQTT] Disconnected (rc={rc}). Will auto-reconnect...")

    def _on_message(self, client, userdata, msg):
        topic = msg.topic
        try:
            payload = json.loads(msg.payload.decode("utf-8"))
        except json.JSONDecodeError:
            print(f"[MQTT] Could not parse message on {topic}")
            return

        print(f"[MQTT] Message received on {topic}: {payload}")

        if topic == TOPICS["dispense"]:
            pet_id = payload.get("petId")
            portion_grams = payload.get("portionGrams")
            if pet_id and portion_grams and self.on_dispense:
                self.on_dispense(pet_id, portion_grams)

        elif topic == TOPICS["capture_photos"]:
            pet_id = payload.get("petId")
            duration = payload.get("durationSeconds", 8)
            if pet_id is not None and self.on_capture_photos:
                self.on_capture_photos(pet_id, duration)

        elif topic == TOPICS["recognition_result"]:
            pet_id = payload.get("petId")
            confidence = payload.get("confidence", 0.0)
            if self.on_recognition_result:
                self.on_recognition_result(pet_id, confidence)

        elif topic == TOPICS["detection"]:
            self.detection_enabled = payload.get("enabled", False)
            print(f"[MQTT] Detection {'enabled' if self.detection_enabled else 'disabled'}.")

    def publish(self, topic, payload, qos=1):
        if not self.connected:
            print(f"[MQTT] Not connected - cannot publish to {topic}")
            return
        message = json.dumps(payload)
        self.client.publish(topic, message, qos=qos)

    def publish_feeding_result(self, scheduled_pet_id, dispensed_g, consumed_g, leftover_g):
        self.publish(TOPICS["feeding_result"], {
            "scheduledPetId": scheduled_pet_id,
            "dispensedGrams": dispensed_g,
            "consumedGrams": consumed_g,
            "leftoverGrams": leftover_g,
        })

    def publish_movement_image(self, image_b64):
        self.publish(TOPICS["movement_image"], {
            "image": image_b64,
        })

    def publish_training_photos(self, pet_id, photos_b64_list):
        BATCH_SIZE = 5
        total = len(photos_b64_list)
        for i in range(0, total, BATCH_SIZE):
            batch = photos_b64_list[i:i + BATCH_SIZE]
            self.publish(TOPICS["training_photos"], {
                "petId": pet_id,
                "photos": batch,
                "batchIndex": i,
                "totalBatches": total,
            })
            time.sleep(1)
        print(f"[MQTT] Sent {total} training photos.")

    def publish_container_weight(self, weight_g):
        self.publish(TOPICS["container_weight"], {
            "weightGrams": weight_g,
        }, qos=0)


    def publish_error(self, error_code, message):
        self.publish(TOPICS["error"], {
            "errorCode": error_code,
            "message": message,
        })

    def disconnect(self):
        self.client.publish(TOPICS["heartbeat"], json.dumps({"status": "offline"}), qos=1, retain=True)
        time.sleep(0.2)
        self.client.loop_stop()
        self.client.disconnect()