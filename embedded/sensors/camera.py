import cv2
import time
import base64
import json
from config import CAMERA_WARMUP_FRAMES, TRAINING_CAPTURE_SECONDS

class Camera:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            raise RuntimeError("[CAMERA] Could not open camera.")
        self._warmup()
        print("[CAMERA] Ready.")

    def _warmup(self):
        """Discard first N frames to let auto-exposure settle."""
        print(f"[CAMERA] Warming up ({CAMERA_WARMUP_FRAMES} frames)...")
        for _ in range(CAMERA_WARMUP_FRAMES):
            self.cap.read()

    def capture_frame(self):
        """Capture a single frame. Returns the frame as a numpy array."""
        ret, frame = self.cap.read()
        if not ret:
            print("[CAMERA] Failed to capture frame.")
            return None
        return frame

    def capture_jpeg_bytes(self):
        """Capture a single frame and return it as JPEG bytes."""
        frame = self.capture_frame()
        if frame is None:
            return None
        _, buffer = cv2.imencode(".jpg", frame)
        return buffer.tobytes()

    def capture_base64(self):
        """Capture a single frame and return as base64 string for MQTT."""
        jpeg_bytes = self.capture_jpeg_bytes()
        if jpeg_bytes is None:
            return None
        return base64.b64encode(jpeg_bytes).decode("utf-8")

    def capture_training_photos(self, pet_id, duration_seconds=None):
        """
        Capture as many frames as possible for training_duration seconds.
        Returns list of base64-encoded JPEG strings tagged with pet_id.
        """
        if duration_seconds is None:
            duration_seconds = TRAINING_CAPTURE_SECONDS

        self._warmup()

        print(f"[CAMERA] Capturing training photos for pet {pet_id} "
              f"for {duration_seconds}s...")
        photos = []
        end_time = time.time() + duration_seconds

        while time.time() < end_time:
            b64 = self.capture_base64()
            if b64:
                photos.append(b64)

        print(f"[CAMERA] Captured {len(photos)} training photos.")
        return photos

    def release(self):
        self.cap.release()
        print("[CAMERA] Released.")
