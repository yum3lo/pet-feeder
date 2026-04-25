import paho.mqtt.client as mqtt
import ssl
import time
from dotenv import load_dotenv
import os

load_dotenv()

BROKER = os.getenv("MQTT_BROKER_URL")
PORT = int(os.getenv("MQTT_PORT", 8883))
USERNAME = os.getenv("MQTT_USERNAME")
PASSWORD = os.getenv("MQTT_PASSWORD")

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected successfully.")
        client.subscribe("test/ping")
        client.publish("test/ping", "hello from pi", qos=1)
    else:
        print(f"Connection failed with code {rc}")

def on_message(client, userdata, msg):
    print(f"Message received: {msg.payload.decode()}")

client = mqtt.Client(client_id="test_client", clean_session=True)
client.username_pw_set(USERNAME, PASSWORD)
client.tls_set(tls_version=ssl.PROTOCOL_TLS)
client.on_connect = on_connect
client.on_message = on_message

print(f"Connecting to {BROKER}:{PORT}...")
client.connect(BROKER, PORT, keepalive=60)
client.loop_start()

time.sleep(5)
client.loop_stop()
client.disconnect()
print("Done.")