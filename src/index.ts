// this is how vertical scaling could be done
import express, { Request, Response } from "express";
import cluster from "cluster";
import os from "os";
import { log } from "console";

const totalCPUs = os.cpus().length;

const PORT = 8000;

if (cluster.isPrimary) {
  log(`Number of CPUS is ${totalCPUs}`);
  log(`Primary ${process.pid} is running.`);

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    log(`worker ${worker.process.pid} went down.`);
    log(`let's fork another one!`);
    cluster.fork();
    // or you can exit the parent process itself by using: process.exit(1);
  });
} else {
  const app = express();

  app.get("/", async (req: Request, res: Response) => {
    return res.json({ message: "Hello World" }).status(200);
  });

  app.get("/api/:n", async (req: Request, res: Response) => {
    let n: number = parseInt(req.params.n);

    if (n / 10 > Number.MAX_SAFE_INTEGER / 10) n = Number.MAX_SAFE_INTEGER;
    let count = 0;
    for (let i = 0; i < n; i++) {
      count += i;
    }
    return res.json({ message: `count: ${count}, pid= ${process.pid}` });
  });

  app.listen(PORT, () => {
    console.log("Server is up and running at: http://localhost:" + PORT);
  });
}
