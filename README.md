## Installation & Run
Start the server and storage containers: docker-compose up --build

## Examples - for linux 
1. Create a User: 
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "123", "email": "alice@test.com", "name": "Alice"}'
   <img width="1903" height="471" alt="image" src="https://github.com/user-attachments/assets/d5a5464b-5e8b-4a00-8725-8221edd36f76" />



2. Create a Folder: Replace <USER_ID> with the ID received in step 1
curl -i -X POST http://localhost:3000/api/files \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"name": "MyDocs", "type": "folder"}'
   <img width="1260" height="278" alt="image" src="https://github.com/user-attachments/assets/5e8c0c32-41da-4097-8196-5711a264de5a" />


3. Upload a File:  Replace <USER_ID> with the ID received in step 1
curl -i -X POST http://localhost:3000/api/files \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"name": "notes.txt", "type": "file", "content": "Hello World"}'
   <img width="1257" height="331" alt="image" src="https://github.com/user-attachments/assets/78c73c77-1704-4a88-a5f0-373165590f14" />


4. Move File to Folder: Replace <USER_ID>, <FOLDER_ID> and <FILE_ID> with the IDs you get in steps 1,2 and 3
curl -i -X PATCH http://localhost:3000/api/files/<FILE_ID> \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"parentId": "<FOLDER_ID>"}'
   <img width="1918" height="393" alt="image" src="https://github.com/user-attachments/assets/f70910ea-0080-4a0e-9de8-dc11a7534dbb" />


5. Rename a File: Replace <USER_ID> and <FILE_ID> with the IDs you get in steps 1 and 3
curl -i -X PATCH http://localhost:3000/api/files/<FILE_ID> \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"name": "new_name.txt"}'
   <img width="1883" height="304" alt="image" src="https://github.com/user-attachments/assets/1b2e1d8b-ad7d-42e2-8927-c2793fa58b77" />


6. Get File Details: 
curl -i -X GET http://localhost:3000/api/files/<FILE_ID> \
  -H "user-id: <USER_ID>"
<img width="1917" height="494" alt="image" src="https://github.com/user-attachments/assets/0007e754-5d77-40f9-82ad-d092cb8e7fb4" />


7. Search content:
curl -i -X GET http://localhost:3000/api/search/Hello \
  -H "user-id: <USER_ID>"
<img width="1895" height="395" alt="image" src="https://github.com/user-attachments/assets/81df9d9f-5b2d-4e2a-be4c-ed9643bc0094" />

8. Get permissions of a file:
curl -i -X GET http://localhost:3000/api/files/<FILE_ID>/permissions \
  -H "user-id: <USER_ID>"
<img width="1915" height="444" alt="image" src="https://github.com/user-attachments/assets/8110b2c5-5b99-40b9-915d-cca94e1d8743" />

   
9. Delete a File:
curl -i -X DELETE http://localhost:3000/api/files/<FILE_ID> \
  -H "user-id: <USER_ID>"
<img width="1904" height="258" alt="image" src="https://github.com/user-attachments/assets/208c3f88-2f22-4dc9-a065-23521c2bef4f" />

   
**Note for Windows Users:** The examples follow Linux/WSL syntax. If using PowerShell or CMD, you may need to replace single quotes (`'`) with double quotes (`"`) and escape internal JSON quotes.
