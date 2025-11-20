# S.E.A-d-r-ive
1. Open the terminal from the relevant folder
2. Make sure the Docker software is running
3. Enter the command to build an image: docker build -t my_project_final .
4. Image to demonstrate construction: <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ddde73be-7286-42b3-9094-71d3fd87afd0" />
5. Enter the command to run and open the folder where the files will be saved (outside the image from the From the path of the environment variable): docker run -it --rm -v "$(pwd)/results:/app/data_files" my_project_final /app/build/app_runner
7.  # Make sure the folder has been created and press Enter to run the software.
8.  Enter the command to run the tests: docker run --rm -v "$(pwd)/results:/app/data_files" my_project_final /app/build/tests_runner


