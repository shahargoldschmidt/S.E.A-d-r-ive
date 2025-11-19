FROM gcc:11

RUN apt-get update && apt-get install -y cmake git

COPY . /app
WORKDIR /app

ENV MY_FILE_PATH="/app/data_files"
RUN mkdir -p ${MY_FILE_PATH}

RUN mkdir build
WORKDIR /app/build

RUN cmake .. && make

CMD ["./app_runner"]
