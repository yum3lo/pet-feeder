import sys
import os
import json
import argparse
import numpy as np
import cv2
from sklearn.model_selection import train_test_split
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.optimizers import Adam

def load_photos(photos_dir, user_id):
  """
  Load photos from photos_dir/user_{user_id}/pet_{pet_id}/*.jpg
  Returns X (images), y (labels), class_names (pet_id strings)
  """
  user_dir = os.path.join(photos_dir, f"user_{user_id}")
  if not os.path.exists(user_dir):
    return None, None, None

  X, y, class_names = [], [], []
  class_map = {}

  # always background class first
  bg_dir = os.path.join(user_dir, "background")
  if os.path.exists(bg_dir):
    class_map[0] = "background"
    class_names.append("background")
    for img_file in os.listdir(bg_dir):
      img = cv2.imread(os.path.join(bg_dir, img_file))
      if img is not None:
        img = cv2.resize(img, (224, 224))
        X.append(img)
        y.append(0)

  # adding each pet
  idx = len(class_names)
  for folder in sorted(os.listdir(user_dir)):
    if folder == "background" or not folder.startswith("pet_"):
      continue
    pet_id = folder.replace("pet_", "")
    class_map[idx] = pet_id
    class_names.append(pet_id)

    pet_dir = os.path.join(user_dir, folder)
    for img_file in os.listdir(pet_dir):
      img = cv2.imread(os.path.join(pet_dir, img_file))
      if img is not None:
        img = cv2.resize(img, (224, 224))
        X.append(img)
        y.append(idx)
    idx += 1

  return np.array(X), np.array(y), class_names

def build_model(num_classes):
  base = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
  )
  base.trainable = False

  x = base.output
  x = GlobalAveragePooling2D()(x)
  x = Dropout(0.3)(x)
  x = Dense(128, activation="relu")(x)
  x = Dropout(0.2)(x)
  output = Dense(num_classes, activation="softmax")(x)

  model = Model(inputs=base.input, outputs=output)
  model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
  )
  return model, base

def main():
  parser = argparse.ArgumentParser()
  parser.add_argument("--user_id", required=True)
  parser.add_argument("--models_dir", required=True)
  parser.add_argument("--photos_dir", required=True)
  args = parser.parse_args()

  user_id = args.user_id
  models_dir = args.models_dir
  photos_dir = args.photos_dir

  X, y, class_names = load_photos(photos_dir, user_id)

  if X is None or len(X) < 10:
    print(json.dumps({
      "success": False,
      "error": "Not enough photos to train."
    }))
    sys.exit(1)

  if len(class_names) < 2:
    print(json.dumps({
      "success": False,
      "error": "Need at least one pet and background class."
    }))
    sys.exit(1)

  num_classes = len(class_names)

  # normalizing
  X = X.astype("float32") / 127.5 - 1
  y_pet = to_categorical(y, num_classes)

  X_train, X_test, y_train, y_test = train_test_split(
    X, y_pet, test_size=0.2, random_state=42
  )

  model, base = build_model(num_classes)

  # phase 1 - training head only
  model.fit(X_train, y_train, epochs=5, batch_size=8,
          validation_data=(X_test, y_test), verbose=0)

  # phase 2 - fine-tuning last 30 layers
  base.trainable = True
  for layer in base.layers[:-30]:
    layer.trainable = False

  model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
  )
  model.fit(X_train, y_train, epochs=10, batch_size=8,
          validation_data=(X_test, y_test), verbose=0)

  loss, accuracy = model.evaluate(X_test, y_test, verbose=0)

  # saving model
  os.makedirs(os.path.join(models_dir, f"user_{user_id}"), exist_ok=True)
  model_path = os.path.join(models_dir, f"user_{user_id}", "model.h5")
  labels_path = os.path.join(models_dir, f"user_{user_id}", "labels.json")

  model.save(model_path, save_format="h5")
  with open(labels_path, "w") as f:
    json.dump(class_names, f)

  print(json.dumps({
    "success": True,
    "accuracy": round(float(accuracy), 4),
    "numClasses": num_classes,
    "classNames": class_names,
    "modelPath": model_path
  }))

if __name__ == "__main__":
  main()