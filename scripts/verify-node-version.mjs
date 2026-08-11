const major = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);

if (!Number.isFinite(major) || major < 24 || major >= 25) {
  console.error(
    `Unsupported Node.js version ${process.versions.node}. Use Node 24 LTS.`
  );
  process.exit(1);
}

console.log(`Node.js ${process.versions.node} is supported.`);
