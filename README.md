Vertical Scaling Shortcomings:
1. Ugly way to spawn multiple Node.js processes.
2. Have to keep track of each process and how they are performing.
3. Spawning a process is much more heavyweight than the multithreading itself.
4. Can't run the node.js process on the same port, so we'll have to take care of the port conflicts too!
5. Best for multi-threaded languages like Rust, Java, C++, Go.
