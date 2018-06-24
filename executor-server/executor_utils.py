import docker
import os
import shutil
import uuid

from executor_config import *
from docker.errors import APIError, ContainerError, ImageNotFound

# connect to docker backend server
client = docker.from_env()

def load_image():
  try:
    # get local image
    client.images.get(IMAGE_NAME)
    print("Image exists locally")
  except ImageNotFound:
    print("image not found locally, loading from docker hub")
    client.images.pull(IMAGE_NAME)
  except APIError:
    print("Cannot connect to docker")
    return
  print("image loaded")

def make_dir(dir):
  try:
    print (dir)
    os.mkdir(dir)
  except OSError:
    print("cannot create dir")

def execute(code, lang):
  result = {'build': None, 'run': None, 'error': None}
  # uuid generates an unique identifier code
  source_file_parent_dir_name = uuid.uuid4()
  # source_file_host_dir is where we store and run the user code
  source_file_host_dir ="%s/%s" % (TEMP_BUILD_DIR, source_file_parent_dir_name)
  # source_file_guest_dir is where we will execute the user code
  source_file_guest_dir = "/test/%s" % (source_file_parent_dir_name)
  # make the directory for the user
  make_dir(source_file_host_dir)

  print (source_file_host_dir)
  print (source_file_guest_dir)

  # write user code into the folder we just created
  with open("%s/%s" % (source_file_host_dir, SOURCE_FILE_NAMES[lang]), 'w') as source_file:
    source_file.write(code)

  # build source file
  try:
    client.containers.run(
      image = IMAGE_NAME,
      command = "%s %s" % (BUILD_COMMANDS[lang], SOURCE_FILE_NAMES[lang]),
      volumes = {source_file_host_dir: {'bind': source_file_guest_dir, 'mode': 'rw'}},
      working_dir = source_file_guest_dir
    )
    print ('source built')
    result['build'] = 'OK'
  except ContainerError as e:
    result['build'] = str(e.stderr, 'utf-8')
    shutil.rmtree(source_file_host_dir)
    return result

  # run executable
  try:
    log = client.containers.run(
      image = IMAGE_NAME,
      command = '%s %s' % (EXECUTE_COMMANDS[lang], BINARY_NAMES[lang]),
      volumes = {source_file_host_dir: {'bind': source_file_guest_dir, 'mode': 'rw'}},
      working_dir=source_file_guest_dir
    )
    log = str(log, 'utf-8')
    print('log: ', log)
    result['run'] = log
  except ContainerError as e:
    result['run'] = str(e.stderr, 'utf-8')
    shutil.rmtree(source_file_host_dir)
    return result

  shutil.rmtree(source_file_host_dir)
  return result
