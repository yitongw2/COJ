import os

# get current directory
CURRENT_DIR = os.path.dirname(os.path.relpath(__file__))
IMAGE_NAME = 'yitongw2/executor'

# store the code in tmp folder
TEMP_BUILD_DIR = "%s/tmp/" % CURRENT_DIR
CONTAINER_NAME = "%s:latest" % IMAGE_NAME

# file names, bin names, build names and exe names
SOURCE_FILE_NAMES = {
    "java": "Example.java",
    "python": "example.py"
}
BINARY_NAMES = {
    "java": "Example",
    "python": "example.py"
}
BUILD_COMMANDS = {
    "java": "javac",
    "python": "python3"
}
EXECUTE_COMMANDS = {
    "java": "java",
    "python": "python3"
}
