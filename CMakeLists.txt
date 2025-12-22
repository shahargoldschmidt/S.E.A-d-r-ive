cmake_minimum_required(VERSION 3.14)
project(SysProgCLI CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# GoogleTest Setup
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

#  Dependencies 
find_package(Threads REQUIRED)

# Include Directories 
include_directories(src)

# Server Logic Files
set(SERVER_SOURCES
    src/App.cpp
    src/ThreadPool.cpp
    src/ClientHandler.cpp
    src/TCPMenu.cpp
    src/OSFileHandler.cpp
    src/RLEStrategy.cpp
    src/AddFileCommand.cpp
    src/DeleteCommand.cpp
    src/GetCommand.cpp
    src/SearchCommand.cpp
    
)

# Client Logic Files
set(CLIENT_SOURCES
    src/ConsoleMenu.cpp
)

# Server Application
add_executable(server_app
    src/server_main.cpp
    ${SERVER_SOURCES}
)
target_link_libraries(server_app PRIVATE stdc++fs Threads::Threads)

# Client Application
add_executable(client_app
    src/ClientCpp.cpp
    ${CLIENT_SOURCES}
)
target_link_libraries(client_app PRIVATE stdc++fs)

# Tests
set(TEST_SOURCES
    tests/AddFileCommandTests.cpp
    tests/ConsoleMenuTest.cpp
    tests/DeleteCommandTest.cpp
    tests/FileHandlerTests.cpp
    tests/GetCommandTest.cpp
    tests/SearchCommandTest.cpp
    tests/ServerTest.cpp
    tests/TCPMenuTest.cpp
    tests/TestApp.cpp
)

# Test Runner
add_executable(tests_runner
    ${SERVER_SOURCES}
    ${CLIENT_SOURCES}
    ${TEST_SOURCES}
)

target_link_libraries(tests_runner PRIVATE
    gtest_main
    stdc++fs
    Threads::Threads
)

include(GoogleTest)
gtest_discover_tests(tests_runner)