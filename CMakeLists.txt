cmake_minimum_required(VERSION 3.10)

project(RLEProject)
set(CMAKE_CXX_STANDARD 11)

# --- Fetch GoogleTest ---
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# --- Add your source files ---
set(SOURCES
    RLEStrategy.cpp
)

set(HEADERS
    RLEStrategy.h
    ICompressor.h
)

# --- Add the test executable ---
add_executable(runTests
    RLEtest.cpp   # ⬅⬅⬅ VERY IMPORTANT!!
    ${SOURCES}
    ${HEADERS}
)

target_link_libraries(runTests gtest_main)

include(GoogleTest)
gtest_discover_tests(runTests)
