cmake_minimum_required(VERSION 3.14)

project(SysProgCLI CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# === Include project headers ===
include_directories(src)

file(GLOB APP_IMPLEMENTATIONS "src/*.cpp")
file(GLOB TEST_SOURCES "tests/*.cpp")

# === אפליקציה ראשית ===
add_executable(app_runner
    ${APP_IMPLEMENTATIONS}
)

# === טסטים ===
add_executable(tests_runner
    ${APP_IMPLEMENTATIONS}
    ${TEST_SOURCES}
)

# === Link libraries ===
target_link_libraries(app_runner PRIVATE stdc++fs)
target_link_libraries(tests_runner PRIVATE gtest_main stdc++fs)

# === GTest auto-discovery ===
include(GoogleTest)
gtest_discover_tests(tests_runner)
