cmake_minimum_required(VERSION 3.14)  # Minimum required CMake version

project(SysProgCLI CXX)  # Project name

set(CMAKE_CXX_STANDARD 17)             # Use C++17 standard
set(CMAKE_CXX_STANDARD_REQUIRED ON)    # Require the standard

# Fetch GoogleTest library 
include(FetchContent)  # Include module for downloading external content

FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)  # Force GoogleTest to use shared C runtime (Windows)
FetchContent_MakeAvailable(googletest)  # Download and prepare GoogleTest if not already available

# Include project headers
include_directories(src)  # Add 'src' folder to the include path

# Gather all implementation source files
set(APP_IMPLEMENTATIONS
    src/AddFileCommand.cpp
    src/App.cpp
    src/ConsoleMenu.cpp
    src/GetCommand.cpp
    src/OSFileHandler.cpp
    src/RLEStrategy.cpp
    src/SearchCommand.cpp
)

# Main application executable
add_executable(app_runner
    src/main.cpp
    ${APP_IMPLEMENTATIONS}
)

# Gather all test source files
set(TEST_SOURCES
    tests/AddFileCommandTests.cpp
    tests/ConsoleMenuTest.cpp
    tests/FileHandlerTests.cpp
    tests/GetCommandTest.cpp
    tests/RLEtest.cpp
    tests/SearchCommandTest.cpp
    tests/TestApp.cpp
)


# Test executable
add_executable(tests_runner
    ${APP_IMPLEMENTATIONS}
    ${TEST_SOURCES}
)

# Link required libraries
target_link_libraries(app_runner PRIVATE stdc++fs)            # Link C++ filesystem library
target_link_libraries(tests_runner PRIVATE gtest_main stdc++fs)  # Link GoogleTest main and filesystem

# GoogleTest auto-discovery of tests 
include(GoogleTest)
gtest_discover_tests(tests_runner)
