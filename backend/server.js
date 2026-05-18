import app from "./src/app.js";
import http from "node:http";

async function main() {
  const PORT = process.env.PORT || 8000;
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`server is litening on http://localhost:${PORT}`);
  });
}

main();
