const Module = require("node:module");
const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "server-only") {
    return {};
  }
  const loaded = originalLoad.call(this, request, parent, isMain);
  if (
    typeof request === "string" &&
    request.endsWith("metadata.min.json") &&
    loaded &&
    typeof loaded === "object" &&
    !("countries" in loaded) &&
    loaded.default &&
    typeof loaded.default === "object"
  ) {
    return loaded.default;
  }
  return loaded;
};
