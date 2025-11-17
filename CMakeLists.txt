cmake_minimum_required(VERSION 3.10)
project(SearchCommandTests)
set(CMAKE_CXX_STANDARD 11)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(runTests
    ConsoleMenuTest.cpp   
    ConsoleMenu.cpp       
)


target_include_directories(runTests PRIVATE
    .
)

target_link_libraries(runTests gtest_main)

include(GoogleTest)
gtest_discover_tests(runTests)
