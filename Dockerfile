FROM gcc:11

# Install tools
RUN apt-get update && apt-get install -y cmake git python3

# Set up work directory
COPY . /app
WORKDIR /app

# Create data directory
ENV MY_FILE_PATH="/app/data_files"
RUN mkdir -p ${MY_FILE_PATH}

# Build the project
RUN mkdir build
WORKDIR /app/build
RUN cmake .. && make

# Default command: Run the server
CMD ["./server_app", "5555"]