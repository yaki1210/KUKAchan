import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const versionsDir = join(root, "versions");
const indexPath = join(versionsDir, "index.json");

const TRACKED = [
  "src/components/assistant/AssistantModel.tsx",
  "src/components/assistant/geom.ts",
  "src/components/assistant/materials.ts",
  "src/components/studio/Studio.tsx",
  "src/components/studio/StudioOverlay.tsx",
  "src/lib/studio-store.ts",
];

function usage() {
  console.log(`MIMI model versions

  node scripts/model-version.mjs list
  node scripts/model-version.mjs snap <id> --name "名称" [--notes "..."] [--stage "02-上色"] [--preview path]
  node scripts/model-version.mjs restore <id> --yes
`);
}

function loadIndex() {
  if (!existsSync(indexPath)) {
    return { lastSnapshot: null, nextProposed: null, versions: [] };
  }
  return JSON.parse(readFileSync(indexPath, "utf8"));
}

function saveIndex(index) {
  mkdirSync(versionsDir, { recursive: true });
  writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--yes") args.yes = true;
    else if (a.startsWith("--") && argv[i + 1] && !argv[i + 1].startsWith("--")) {
      args[a.slice(2)] = argv[++i];
    } else if (!a.startsWith("--")) {
      args._.push(a);
    }
  }
  return args;
}

function copyTracked(fromRoot, toRoot) {
  for (const rel of TRACKED) {
    const src = join(fromRoot, rel);
    if (!existsSync(src)) continue;
    const dest = join(toRoot, rel.replaceAll("\\", "/").split("/").pop());
    copyFileSync(src, dest);
  }
}

function copySnapshotToSrc(id) {
  const dir = join(versionsDir, id);
  if (!existsSync(dir)) throw new Error(`version not found: ${id}`);
  for (const rel of TRACKED) {
    const name = rel.replaceAll("\\", "/").split("/").pop();
    const src = join(dir, name);
    if (!existsSync(src)) continue;
    copyFileSync(src, join(root, rel));
  }
}

function cmdList() {
  const index = loadIndex();
  const rows = index.versions ?? [];
  if (!rows.length) {
    console.log("no snapshots yet");
    return;
  }
  for (const v of rows) {
    const mark = v.id === index.lastSnapshot ? "*" : " ";
    console.log(`${mark} ${v.id.padEnd(16)} ${v.stage ?? ""}  ${v.name ?? ""}`);
  }
  if (index.nextProposed) console.log(`\nnext proposed: ${index.nextProposed}`);
}

function cmdSnap(args) {
  const id = args._[1];
  if (!id) throw new Error("snap requires <id>, e.g. v3-panels");
  if (!/^v[\w.-]+$/.test(id)) throw new Error("id must look like v3-panels");

  const dir = join(versionsDir, id);
  mkdirSync(dir, { recursive: true });
  copyTracked(root, dir);

  if (args.preview) {
    const preview = resolve(root, args.preview);
    if (!existsSync(preview)) throw new Error(`preview not found: ${args.preview}`);
    copyFileSync(preview, join(dir, "preview.png"));
  }

  const meta = {
    id,
    name: args.name ?? id,
    savedAt: new Date().toISOString(),
    stage: args.stage ?? "",
    notes: args.notes ?? "",
    files: TRACKED.map((rel) => rel.replaceAll("\\", "/").split("/").pop()).filter((name) =>
      existsSync(join(dir, name)),
    ),
  };
  writeFileSync(join(dir, "VERSION.json"), JSON.stringify(meta, null, 2) + "\n");

  const index = loadIndex();
  index.versions = (index.versions ?? []).filter((v) => v.id !== id);
  index.versions.push({
    id,
    name: meta.name,
    stage: meta.stage,
    savedAt: meta.savedAt,
    notes: meta.notes,
  });
  index.lastSnapshot = id;
  saveIndex(index);
  console.log(`saved ${id} -> versions/${id}/`);
}

function cmdRestore(args) {
  const id = args._[1];
  if (!id) throw new Error("restore requires <id>");
  if (!args.yes) throw new Error(`restore overwrites src. Re-run with --yes to restore ${id}`);
  copySnapshotToSrc(id);
  const index = loadIndex();
  index.lastSnapshot = id;
  saveIndex(index);
  console.log(`restored ${id} into src/`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];

try {
  if (cmd === "list") cmdList();
  else if (cmd === "snap") cmdSnap(args);
  else if (cmd === "restore") cmdRestore(args);
  else {
    usage();
    if (cmd) process.exit(1);
  }
} catch (err) {
  console.error(String(err instanceof Error ? err.message : err));
  process.exit(1);
}
