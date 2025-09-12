import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Kiln1155Module", (m) => {
  const baseURI = "ipfs://bafybeigibb4ce5dahgzrnuq2etx6yueod5popsdlo657d2lw3u2mtdml64/";
  const kiln1155 = m.contract("Kiln1155", [baseURI]);

  // m.call(kiln1155, "claim", [0, 1n]);

  return { kiln1155 };
});
