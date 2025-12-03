FROM gcc:11

# Install CMake, Git, and Python3
RUN apt-get update && apt-get install -y cmake git python3

# Set working directory inside container
COPY . /app
WORKDIR /app

# Setup data directory
ENV MY_FILE_PATH="/app/data_files"
RUN mkdir -p ${MY_FILE_PATH}

# Build the C++ project
RUN mkdir build
WORKDIR /app/build
RUN cmake .. && make

# Copy the python client script from src to the root app folder for easy access
RUN cp /app/src/ClientPy.py /app/client.py

# Default command runs the server
CMD ["./server_app", "5555"]