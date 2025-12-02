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
3. Did the fact that the command output changed require you to touch code that was supposed to be "closed for modification but open for extension"?
   Answer: Yes. This required a refactor. In Exercise 1, our commands accepted a std::ostream& in their constructor and wrote output directly to it. This created a Tight     Coupling between the commands and the concept of C++ Streams. When moving to Exercise 2, this design prevented us from sending data over TCP sockets (which are not std::ostreams). To fix this, we modify the ICommand interface to return a std::string instead of void. This required changing the code in The Command classes and in the App class to capture and this return value. Returning a string decouples the command from the output mechanism, making it good whether data is sent to a console, a socket, or a log file. This shifts the responsibility of handling the output to the App and IMenu, ensuring the command logic remains pure and compliant with the Open/Closed Principle.
4. Did the fact that input/output comes from sockets instead of the console require you to touch code that need to be "closed for modification but open for extension"?
   Answer: No. Thanks to the Dependency Inversion Principle, the App class depends on the IMenu abstraction rather than concrete implementations. In Exercise 1, App worked with ConsoleMenu and in Exercise 2, we created a new class TCPMenu (Extension). We injected this new menu into the App. The code inside App::run remained completely unchanged because it calls the generic methods menu->getInput() and menu->respond(), completely unaware of whether the data is coming from a local keyboard or a network packet.
