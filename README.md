## Installation & Run
Start the server and storage containers: docker-compose up --build

## Examples
1. Create a User: 
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "123", "email": "alice@test.com", "name": "Alice"}'

2. Create a Folder: Replace <USER_ID> with the ID received in step 1
curl -i -X POST http://localhost:3000/api/files \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"name": "MyDocs", "type": "folder"}'

3. Upload a File:  Replace <USER_ID> with the ID received in step 1
curl -i -X POST http://localhost:3000/api/files \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"name": "notes.txt", "type": "file", "content": "Hello World"}'

4. Move File to Folder: Replace <USER_ID>, <FOLDER_ID> and <FILE_ID> with the IDs you get in steps 1,2 and 3
curl -i -X PATCH http://localhost:3000/api/files/<FILE_ID> \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"parentId": "<FOLDER_ID>"}'

5. Rename a File: Replace <USER_ID> and <FILE_ID> with the IDs you get in steps 1 and 3
curl -i -X PATCH http://localhost:3000/api/files/<FILE_ID> \
  -H "Content-Type: application/json" \
  -H "user-id: <USER_ID>" \
  -d '{"name": "new_name.txt"}'

6. Get File Details: 
curl -i -X GET http://localhost:3000/api/files/<FILE_ID> \
  -H "user-id: <USER_ID>"

7. Delete a File:
curl -i -X DELETE http://localhost:3000/api/files/<FILE_ID> \
  -H "user-id: <USER_ID>"

