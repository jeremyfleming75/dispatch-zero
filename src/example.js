import { getLoad, listLoads, saveLoad } from "./index.js";

async function main() {
  // Requires Firebase env vars (see .env.example)
  const id = await saveLoad({
    userId: "demo-user",
    name: "first load",
    data: { hello: "world", createdFrom: "src/example.js" },
  });

  console.log("Saved load id:", id);

  const loaded = await getLoad(id);
  console.log("Reloaded:", loaded);

  const recent = await listLoads({ userId: "demo-user", limit: 10 });
  console.log("Recent loads:", recent.map((l) => ({ id: l.id, name: l.name })));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

