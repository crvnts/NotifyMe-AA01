##Vehicle Detection with YOLOv4 (TensorFlow2)

To install, 
    pip install -r requirements.txt

Download YOLOv4 weights from AlexeyAB/darknet repository
https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights

Weights were converted into TensorFlow weights

    convert-darknet-weights yolov4.weights -o yolov4.h5
The weights must be converted prior to running program