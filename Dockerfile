FROM gcc:latest

# Install cmake and gtest dependencies
RUN apt-get update && \
    apt-get install -y cmake build-essential libgtest-dev

# Working directory
WORKDIR /app

# Copy all project files into the container
COPY . .

# Build directory
RUN mkdir -p build
WORKDIR /app/build

# Configure + compile
RUN cmake .. && make

# Run tests by default
CMD ["./runTests"]
