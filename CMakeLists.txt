cmake_minimum_required(VERSION 3.14)

project(SysProgCLI CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

# For Windows: Prevents common linking errors (CRT mismatch)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Source Files Definition (Focusing on File Handling)
# Define the source directory for headers
target_include_directories(gtest_main BEFORE PUBLIC src)

# Implementation files needed
set(APP_IMPLEMENTATIONS
    src/OSFileHandler.cpp 
)

# Test files (FileHandlerTests only)
set(TEST_SOURCES
    tests/FileHandlerTests.cpp
)

# Building the Test Runner Executable
# Create the executable that combines implementation and test sources
add_executable(tests_runner ${APP_IMPLEMENTATIONS} ${TEST_SOURCES})

# Link the necessary libraries
target_link_libraries(tests_runner 
    # gtest_main provides the main() function for the tests
    PRIVATE gtest_main 
    
    PRIVATE stdc++fs
    
    PRIVATE stdc++
)

# Enable automatic GTest discovery and run tests with CTest
include(GoogleTest)
gtest_discover_tests(tests_runner)