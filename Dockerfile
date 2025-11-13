FROM gcc:latest

# Install cmake and gtest
RUN apt-get update && \
    apt-get install -y cmake build-essential libgtest-dev

# Copy everything into the container
WORKDIR /app
COPY . .

# Build
RUN mkdir -p build
WORKDIR /app/build
RUN cmake .. && make

# Run tests as default command
CMD ["./runTests"]
