## Installation & Run
Start the server and storage containers: docker-compose up --build

## Examples - for linux 
1. Create a User: 
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "123", "email": "alice@test.com", "name": "Alice"}'
   <img width="1338" height="189" alt="image" src="https://github.com/user-attachments/assets/11ed18e3-f8b1-4bba-a09e-83eb5d612c93" />


3. Create a Folder: Replace <USER_ID> with the ID received in step 1
curl -i -X POST http://localhost:3000/api/files \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"name": "MyDocs", "type": "folder"}'

4. Upload a File:  Replace <USER_ID> with the ID received in step 1
curl -i -X POST http://localhost:3000/api/files \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"name": "notes.txt", "type": "file", "content": "Hello World"}'

5. Move File to Folder: Replace <USER_ID>, <FOLDER_ID> and <FILE_ID> with the IDs you get in steps 1,2 and 3
curl -i -X PATCH http://localhost:3000/api/files/<FILE_ID> \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"parentId": "<FOLDER_ID>"}'

6. Rename a File: Replace <USER_ID> and <FILE_ID> with the IDs you get in steps 1 and 3
curl -i -X PATCH http://localhost:3000/api/files/<FILE_ID> \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"name": "new_name.txt"}'

7. Get File Details: 
curl -i -X GET http://localhost:3000/api/files/<FILE_ID> \
  -H "user-id: <USER_ID>"

8. Delete a File:
curl -i -X DELETE http://localhost:3000/api/files/<FILE_ID> \
  -H "user-id: <USER_ID>"

9. Search content:
curl -i -X GET http://localhost:3000/api/search/Hello \
  -H "user-id: <USER_ID>"

10. Get permissions of a file:
curl -i -X GET http://localhost:3000/api/files/<FILE_ID>/permissions \
  -H "user-id: <USER_ID>"

**Note for Windows Users:** The examples follow Linux/WSL syntax. If using PowerShell or CMD, you may need to replace single quotes (`'`) with double quotes (`"`) and escape internal JSON quotes.
