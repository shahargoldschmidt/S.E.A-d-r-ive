#include "ThreadPool.h"

// Constructor: create a fixed number of worker threads
ThreadPool::ThreadPool(size_t threads) : stop(false) {
    for (size_t i = 0; i < threads; ++i) {
        workers.emplace_back([this]() {
            while (true) {
                std::function<void()> task;

                {
                    // Lock queue and wait for a task or shutdown signal
                    std::unique_lock<std::mutex> lock(this->queueMutex);
                    this->condition.wait(lock, [this] {
                        return this->stop || !this->tasks.empty();
                    });

                    // Shutdown: exit thread
                    if (this->stop && this->tasks.empty())
                        return;

                    // Pop next task
                    task = std::move(this->tasks.front());
                    this->tasks.pop();
                }

                // Execute the task
                task();
            }
        });
    }
}

// Add a task to the queue
void ThreadPool::submit(std::function<void()> task) {
    {
        std::unique_lock<std::mutex> lock(queueMutex);
        tasks.emplace(std::move(task));
    }
    condition.notify_one(); // Wake one worker
}

// Destructor: signal shutdown and join all threads
ThreadPool::~ThreadPool() {
    {
        std::unique_lock<std::mutex> lock(queueMutex);
        stop = true;
    }
    condition.notify_all(); // Wake all workers

    for (std::thread &worker : workers)
        worker.join(); // Wait for all workers to finish
}