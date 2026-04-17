import cv2
import time

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("ERROR: Could not open camera.")
    exit(1)

# Discard first 30 frames to let auto-exposure settle
print("Warming up camera...")
for i in range(30):
    cap.read()

print("Capturing image...")
ret, frame = cap.read()

if not ret:
    print("ERROR: Failed to capture frame.")
    cap.release()
    exit(1)

cv2.imwrite("test_capture.jpg", frame)
print("Image saved.")
cap.release()