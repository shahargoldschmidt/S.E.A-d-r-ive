cmake_minimum_required(VERSION 3.10)
project(GetCommandTests)
set(CMAKE_CXX_STANDARD 11)

# ---- Fetch GoogleTest ----
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# ---- Include directories (HEADERS live here!) ----
include_directories(
    ${CMAKE_SOURCE_DIR}       # root folder
    ${CMAKE_SOURCE_DIR}/src   # if src exists
    ${CMAKE_SOURCE_DIR}/tests # if tests include headers
)

# ---- Build test executable ----
add_executable(runTests
    GetCommandTest.cpp
    GetCommand.cpp
    RLEStrategy.cpp
    OSFileHandler.cpp
)


target_link_libraries(runTests gtest_main)

include(GoogleTest)
gtest_discover_tests(runTests)
