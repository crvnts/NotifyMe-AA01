import tensorflow as tf

from tf2_yolov4.anchors import YOLOV4_ANCHORS
from tf2_yolov4.model import YOLOv4
import json
import cv2
import numpy as np
import requests
from PIL import Image
from io import BytesIO
import os
#################################################
def load_image_to_tensor(file):
    # load image
    image = tf.io.read_file(file)
    # detect format (JPEG, PNG, BMP, or GIF) and converts to Tensor:
    image = tf.io.decode_image(image)
    return image

def resize_image(image):
    # Resize the output_image:
    image = tf.image.resize(image, (HEIGHT, WIDTH))
    # Add a batch dim:
    images = tf.expand_dims(image, axis=0)/255
    return images

def trained_yolov4_model():
    # load trained yolov4 model
    model = YOLOv4(
        input_shape=(HEIGHT, WIDTH, 3),
        anchors=YOLOV4_ANCHORS,
        num_classes=80,
        training=False,
        yolo_max_boxes=100,
        yolo_iou_threshold=0.5,
        yolo_score_threshold=0.30,
    ) 
    model.load_weights('../yolov4.h5')
    return model

def detected_photo(boxes, scores, classes, detections,image,input_photo):
    boxes = (boxes[0] * [WIDTH, HEIGHT, WIDTH, HEIGHT]).astype(int)
    scores = scores[0]
    classes = classes[0].astype(int)
    detections = detections[0]

    CLASSES = [
        'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck',
        'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench',
        'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra',
        'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
        'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove',
        'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork',
        'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli',
        'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant',
        'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard',
        'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book',
        'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
    ]

    objects ={}
    obj_counter = 1
    image_cv = image.numpy()

    for (xmin, ymin, xmax, ymax), score, class_idx in zip(boxes, scores, classes):

        if score > 0:
            if class_idx == 2 or class_idx == 5 or class_idx == 7:         # show bounding box only to the "car,bus,truck" class

                #### Draw a rectangle ##################
                # convert from tf.Tensor to numpy
                cv2.rectangle(image_cv, (int(xmin), int(ymin)), (int(xmax), int(ymax)), (0,255,0), thickness= 2)
                # Add detection text to the prediction
                text = CLASSES[class_idx] + ': {0:.2f}'.format(score)
                cv2.putText(image_cv, text, (int(xmin), int(ymin) - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)
                bounding_box = {
                    'xmin': int(xmin),
                    'ymin': int(ymin),
                    'xmax': int(xmax),
                    'ymax': int(ymax)
                }
                objects[f'Object{" "+str(obj_counter)}, bounding box'] = bounding_box
                obj_counter  += 1
    # Save to name of file
    with open(input_photo+'_Objects.txt', "w") as bboxFile:
        bboxFile.write(json.dumps(objects, ensure_ascii=False))

    return image_cv

def proccess_frame(photo, model, input_photo):
    images = resize_image(photo)
    boxes, scores, classes, detections = model.predict(images)
    result_img = detected_photo(boxes, scores, classes, detections,images[0],input_photo)
    return result_img

def Car_detection_single_photo(input_photo):
    my_image = load_image_to_tensor(input_photo)
    #Get trained yolov4 model
    yolo_model = trained_yolov4_model()
    image = proccess_frame(my_image, yolo_model,input_photo)
    image= cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return image

def calculate_roi_area(roi_coordinates):
    # Calculate area of the ROI defined by three points
    x1, y1 = roi_coordinates[0]
    x2, y2 = roi_coordinates[1]
    x3, y3 = roi_coordinates[2]
    
    area = abs((x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2)) / 2)
    return area

def calculate_roi_coordinates(bounding_boxes_data):
    if not bounding_boxes_data:
        return None

    all_x_coordinates = []
    all_y_coordinates = []

    # Parse bounding box data and collect all x and y coordinates
    for object_data in bounding_boxes_data.values():
        xmin = object_data["xmin"]
        ymin = object_data["ymin"]
        xmax = object_data["xmax"]
        ymax = object_data["ymax"]

        all_x_coordinates.extend([xmin, xmax])
        all_y_coordinates.extend([ymin, ymax])

    # Find extreme points
    min_x = min(all_x_coordinates)
    max_x = max(all_x_coordinates)
    min_y = min(all_y_coordinates)
    max_y = max(all_y_coordinates)
    
    
    if (len(bounding_boxes_data) <= 20): 
        min_y = max(0,min_y-(0.1*min_y))
        max_y = min(768,max_y+(0.1*(max_y)))
    # Define ROI points: 2 at min y and 1 at max y
    roi_coordinates = [
        (min_x, min_y),  # Bottom-left
        (max_x, min_y),  # Bottom-right
        ((min_x + max_x) / 2, max_y)  # Top-middle
    ]

    return roi_coordinates

def calculate_intersection_area(box, roi):
    # Calculate the intersection area between a bounding box and the ROI
    x_min = max(box[0], roi[0][0])
    y_min = max(box[1], roi[0][1])
    x_max = min(box[2], roi[1][0])
    y_max = min(box[3], roi[2][1])

    if x_max <= x_min or y_max <= y_min:
        return 0
    else:
        return (x_max - x_min) * (y_max - y_min)

def calculate_coverage_and_total_area(bounding_boxes_data, roi_coordinates):
    total_area_covered = 0
    for object_data in bounding_boxes_data.values():
        box = (object_data["xmin"], object_data["ymin"], object_data["xmax"], object_data["ymax"])
        intersection_area = calculate_intersection_area(box, roi_coordinates)
        total_area_covered += intersection_area

    roi_area = calculate_roi_area(roi_coordinates)
    coverage_percentage = (total_area_covered / roi_area) * 100 if roi_area > 0 else 0

    return total_area_covered, coverage_percentage

def read_bounding_boxes_from_txt(file_path):
    try:
        with open(file_path, 'r') as file:
            bounding_boxes_data = json.load(file)
        return bounding_boxes_data
    except FileNotFoundError:
        print("File not found.")
        return None
    except json.JSONDecodeError:
        print("Error decoding JSON.")
        return None
#######   main   ####################################################################

if __name__ == "__main__":
    WIDTH, HEIGHT = (1024, 768)
    url = "https://511on.ca/map/Cctv/loc21--2"

    # Send a GET request to the URL
    response = requests.get(url)

    # Check if request was successful
    if response.status_code == 200:
        # Read the content of the response as bytes
        image_bytes = BytesIO(response.content)
    
        # Open the image using PIL
        image = Image.open(image_bytes)

        # Display the image
        image_path = "image.jpg"
        image.save(image_path)    
    else:
        print("Failed to retrieve the image. Status code:", response.status_code)
    imagefile = 'image.jpg'
    ####    Detect Cars on a single photo ####
    output_image = Car_detection_single_photo(imagefile)
    # Show resulted photo
    cv2.imshow('output_image', output_image)
    # Save photo
    cv2.imwrite(imagefile+'_object_detected.jpg', output_image*255)
    os.remove(image_path)
    """ file_path = "../photos/test4.jpg_Objects.txt"  # Path to the .txt file containing bounding box data
    bounding_boxes_data = read_bounding_boxes_from_txt(file_path)
    if bounding_boxes_data:
        roi_coordinates = calculate_roi_coordinates(bounding_boxes_data)
        print("ROI coordinates:", roi_coordinates)
        print("ROI Area: ", calculate_roi_area(roi_coordinates))
        print("ROI Area/Total Area: ",calculate_roi_area(roi_coordinates)*100/(WIDTH * HEIGHT))

    total_area_covered, coverage_percentage = calculate_coverage_and_total_area(bounding_boxes_data, roi_coordinates)

    print("Total area covered within ROI:", total_area_covered)
    print("Coverage percentage:", coverage_percentage) """