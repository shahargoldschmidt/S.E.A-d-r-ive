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
file(GLOB APP_IMPLEMENTATIONS "src/*.cpp")
list(REMOVE_ITEM APP_IMPLEMENTATIONS "${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp")  # Exclude main.cpp

# Gather all test source files
file(GLOB TEST_SOURCES "tests/*.cpp")

# Main application executable
add_executable(app_runner
    src/main.cpp
    ${APP_IMPLEMENTATIONS}
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
