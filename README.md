# S.E.A-d-r-ive
1. Open the terminal from the relevant folder
2. Make sure the Docker software is running
3. Build + Run containers: docker-compose up --build -d
4. Run tests: docker exec -it my_server /app/build/tests_runner
5. Run C++ client: docker exec -it client_cpp /app/build/client_app my_server 5555
6. Run Python client: docker exec -it client_py python3 /app/clientPy.py my_server 5555

# Answers to the Questions:
1. Did the fact that command names changed require you to touch code that was supposed to be "closed for modification but open for extension"?
   Answer: No. The App class holds a map where the keys are the command names. The App logic simply looks up the command based on the user's input. Changing a command's name (from "add" to "post") only requires updating the initialization code where the map is built, without modifying the App::run logic itself.
2. Did the fact that new commands were added require you to touch code that was supposed to be "closed for modification but open for extension"?
   Answer: No. To add a new command, you simply create a new class that implements the ICommand interface and add it to the command map during initialization. The App class iterates through the map and executes commands polymorphically, so it does not need to know about the new specific classes.
