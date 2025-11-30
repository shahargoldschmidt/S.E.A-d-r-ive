import socket
import sys

def main():
    # Check arguments
    if len(sys.argv) < 3:
        print("Usage: python3 client.py <ip> <port>")
        return

    server_ip = sys.argv[1]
    server_port = int(sys.argv[2])

    # Create socket and connect
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        sock.connect((server_ip, server_port))
        while True:
            # Get input from user
            try:
                message = input() 
            except EOFError:
                break

            # Add newline and send
            sock.sendall((message + '\n').encode())
            # Receive response
            response = sock.recv(4096)

            if not response:
                print("Server disconnected.")
                break

            # converts bytes to string and print respons
            # end='' prevents double newlines
            print(response.decode(), end='')

    except ConnectionRefusedError:
        print("Error: Could not connect to server.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        sock.close()

if __name__ == "__main__":
    main()