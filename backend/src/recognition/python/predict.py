import sys
import os
import json
import argparse
import base64
import numpy as np
import cv2
from tensorflow.keras.models import load_model

CONFIDENCE_THRESHOLD = 0.70

def main():
  parser = argparse.ArgumentParser()
  parser.add_argument("--user_id", required=True)
  parser.add_argument("--models_dir", required=True)
  args = parser.parse_args()

  image_b64 = sys.stdin.read().strip()

  model_path = os.path.join(args.models_dir, f"user_{args.user_id}", "model.h5")
  labels_path = os.path.join(args.models_dir, f"user_{args.user_id}", "labels.json")

  if not os.path.exists(model_path) or not os.path.exists(labels_path):
    print(json.dumps({
      "success": False,
      "error": "Model not found for this user."
    }))
    sys.exit(0)

  # loading model and labels
  model = load_model(model_path, compile=False)
  with open(labels_path) as f:
    class_names = json.load(f)

  # decoding image
  try:
    img_bytes = base64.b64decode(image_b64)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224))
    img = img.astype("float32") / 127.5 - 1
    img = np.expand_dims(img, axis=0)
  except Exception as e:
    print(json.dumps({"success": False, "error": f"Image decode error: {str(e)}"}))
    sys.exit(0)

  # running inference
  predictions = model.predict(img, verbose=0)
  predicted_idx = int(np.argmax(predictions))
  confidence = float(predictions[0][predicted_idx])
  predicted_label = class_names[predicted_idx]

  if confidence < CONFIDENCE_THRESHOLD or predicted_label == "background":
    print(json.dumps({
      "success": True,
      "petId": None,
      "label": "background",
      "confidence": confidence
    }))
  else:
    print(json.dumps({
      "success": True,
      "petId": predicted_label,
      "label": predicted_label,
      "confidence": confidence
    }))

if __name__ == "__main__":
  main()