# S.E.A-d-r-ive
1. Open the terminal from the relevant folder
2. Make sure the Docker software is running
3. Enter the command to build an image: docker build -t my_project_final .
4. Image to demonstrate construction: <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ddde73be-7286-42b3-9094-71d3fd87afd0" />
5.Enter the command to run the tests: docker run --rm my_project_final /app/build/tests_runner
6. <img width="1920" height="1080" alt="צילום מסך 2025-11-20 221449" src="https://github.com/user-attachments/assets/2e2cdd6d-5457-4bfd-86d6-32caabb1c3e0" />
   <img width="1920" height="1080" alt="צילום מסך 2025-11-20 221511" src="https://github.com/user-attachments/assets/228375be-5c42-4123-9799-95bd3747ac5e" />
   <img width="1920" height="1080" alt="צילום מסך 2025-11-20 221604" src="https://github.com/user-attachments/assets/326b0bfe-0ed6-42d8-ab5d-3c24b289cf8a" />
   <img width="1920" height="1080" alt="צילום מסך 2025-11-20 221612" src="https://github.com/user-attachments/assets/6159d34f-9315-4bc2-b9b1-52c543a7078c" />
8. Enter the command to run and open the folder where the files will be saved (outside the image from the From the path of the environment variable): docker run -it --rm -v "$(pwd)/results:/app/data_files" my_project_final /app/build/app_runner 
9. Make sure the folder has been created and the fill was created too after the adde command before searching (it coulde take few secounds)
   <img width="1920" height="1080" alt="צילום מסך 2025-11-20 215159" src="https://github.com/user-attachments/assets/faf53cf0-7a8a-49cd-8989-1460aae3100a" />
   <img width="1920" height="1080" alt="צילום מסך 2025-11-20 220536" src="https://github.com/user-attachments/assets/db3179b2-42d5-4ab4-8a67-4c4eae0354fb" />
   <img width="1663" height="1058" alt="צילום מסך 2025-11-20 215940" src="https://github.com/user-attachments/assets/f0726686-1f9a-402c-b42c-a6d30fc977d8" />
   <img width="1637" height="1063" alt="צילום מסך 2025-11-20 220511" src="https://github.com/user-attachments/assets/b8234e2d-2eb9-42e4-a96c-7472646fc515" />
10. That's all, hope you enjoyed


