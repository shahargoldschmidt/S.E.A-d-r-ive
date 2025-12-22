#ifndef THREADPOOL_H
#define THREADPOOL_H

#include <vector>
#include <thread>
#include <queue>
#include <functional>
#include <mutex>
#include <condition_variable>

class ThreadPool {
private:
    std::vector<std::thread> workers;                 // Worker threads in the pool
    std::queue<std::function<void()>> tasks;          // Queue of submitted tasks

    std::mutex queueMutex;                            // Synchronizes access to the task queue
    std::condition_variable condition;                // Notifies workers when tasks are available
    bool stop;                                        // Indicates whether the pool is shutting down

public:
    ThreadPool(size_t threads);                       // Create a thread pool with a fixed number of threads
    void submit(std::function<void()> task);          // Add a task to the queue
    ~ThreadPool();                                    // Graceful shutdown: stop workers and join all threads
};

#endif // THREADPOOL_H
