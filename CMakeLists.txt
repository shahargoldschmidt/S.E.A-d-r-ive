cmake_minimum_required(VERSION 3.14)
project(SysProgCLI CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# --- 1. הגדרת GoogleTest ---
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# --- 2. תלויות מערכת ---
find_package(Threads REQUIRED)

# --- 3. הגדרת תיקיות ---
include_directories(src)

# --- 4. הגדרת קבוצות קבצים (מתוך התמונות ששלחת) ---

# קבצי הלוגיקה של השרת (משותף לשרת ולטסטים)
set(SERVER_SOURCES
    src/App.cpp
    src/ClientHandler.cpp
    src/TCPMenu.cpp
    src/OSFileHandler.cpp
    src/RLEStrategy.cpp
    src/AddFileCommand.cpp
    src/DeleteCommand.cpp
    src/GetCommand.cpp
    src/SearchCommand.cpp
)

# קבצי הלוגיקה של הלקוח
set(CLIENT_SOURCES
    src/ConsoleMenu.cpp
)

# קבצי הטסטים (מתוך תיקיית tests)
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

# --- 5. יצירת קבצי ההרצה (Executables) ---

# א. השרת (Server)
add_executable(server_app
    src/server_main.cpp
    ${SERVER_SOURCES}
)
target_link_libraries(server_app PRIVATE stdc++fs Threads::Threads)

# ב. הלקוח (Client)
add_executable(client_app
    src/ClientCpp.cpp
    ${CLIENT_SOURCES}
)
target_link_libraries(client_app PRIVATE stdc++fs)

# ג. מריץ הטסטים (Tests Runner)
add_executable(tests_runner
    ${SERVER_SOURCES}
    ${CLIENT_SOURCES}
    ${TEST_SOURCES}
)
target_link_libraries(tests_runner PRIVATE gtest_main stdc++fs Threads::Threads)

# --- 6. הפעלת זיהוי הטסטים ---
include(GoogleTest)
gtest_discover_tests(tests_runner)