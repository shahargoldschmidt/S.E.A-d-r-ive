# S.E.A-d-r-ive
1. Open the terminal from the relevant folder
2. Make sure the Docker software is running
3. Build + Run containers: docker-compose up --build -d
4. Run tests: docker exec -it my_server /app/build/tests_runner
   ![תמונה של WhatsApp‏ 2025-12-07 בשעה 18 31 56_ae5c6e0f](https://github.com/user-attachments/assets/8bc0dff3-d9c0-47ad-8a7f-1775ff63e1c4)
6. Run C++ client: docker exec -it client_cpp /app/build/client_app my_server 5555
7. Run Python client: docker exec -it client_py python3 /app/src/ClientPy.py my_server 5555
   ![תמונה של WhatsApp‏ 2025-12-07 בשעה 18 46 45_f9ccb9e1](https://github.com/user-attachments/assets/306c7da6-7b2a-40b8-8edf-f7906ff76d63)


# Answers for the Questions:
1. Did the fact that command names changed require you to touch code that was supposed to be "closed for modification but open for extension"?
   Answer: No. The App class holds a map where the keys are the command names. The App logic simply looks up the command based on the user's input. Changing a command's nameonly required updating the initialization code where the map is built, without modifying the App logic itself.
2. Did the fact that new commands were added require you to touch code that was supposed to be "closed for modification but open for extension"?
   Answer: No. To add a new command, we simply create a new class that implements the ICommand interface and add it to the command map in the beggining. The App class iterates through the map and executes commands polymorphically, so it does know about the new specific classes.
3. Did the fact that the command output changed require you to touch code that was supposed to be "closed for modification but open for extension"?
   Answer: Yes. In Exercise 1, our commands accepted a std::ostream& in their constructor and wrote output directly to it. In this exercise, this prevented us from sending data over sockets. To fix this, we modified the ICommand interface to return a string instead of void. This required changing the code in The Command classes and in the App class to capture and this return value. This helped to decouple the commands Logic from the IO stream..
4. Did the fact that input/output comes from sockets instead of the console require you to touch code that need to be "closed for modification but open for extension"?
   Answer: No. the App class depends on the IMenu abstraction rather than concrete implementations. In Exercise 1, App worked with ConsoleMenu and in this exercise, we created a new class TCPMenu  .We injected this new menu into the App. The code inside App: remained completely unchanged because it calls the generic methods menu->getInput() and menu->respond(), completely unaware of where the data is coming from..
