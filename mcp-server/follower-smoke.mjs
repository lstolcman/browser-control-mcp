import fs from "node:fs";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const secret = fs
  .readFileSync(path.join(process.env.USERPROFILE, ".config", "opencode", "browser-control.secret"), "utf8")
  .trim();

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["C:/dev/projects/github/browser-control-mcp/mcp-server/dist/server.js"],
  env: { ...process.env, EXTENSION_PORT: "10423", EXTENSION_SECRET: secret },
  stderr: "pipe",
});

const client = new Client({ name: "follower-smoke", version: "1.0.0" });
await client.connect(transport);
await new Promise((r) => setTimeout(r, 1500));
const tools = await client.listTools();
const result = await client.callTool({ name: "get-list-of-open-tabs", arguments: { limit: 2 } });
console.log(JSON.stringify({
  toolCount: tools.tools.length,
  firstTool: tools.tools[0]?.name,
  call: result.content?.[0]?.text?.slice(0, 300),
}, null, 2));
await client.close();
