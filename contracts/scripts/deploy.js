import { network } from "hardhat";

async function main() {
  console.log("🚀 Memulai deploy ke Arc testnet...\n");

  // Buat koneksi ke network
  const { ethers } = await network.connect();

  // Ambil deployer wallet
  const [deployer] = await ethers.getSigners();
  console.log("📦 Deploy menggunakan wallet:", deployer.address);

  // ── 1. Deploy ProfileRegistry ──
  console.log("\n1️⃣  Deploy ProfileRegistry...");
  const profileRegistry = await ethers.deployContract("ProfileRegistry");
  await profileRegistry.waitForDeployment();
  const profileRegistryAddress = await profileRegistry.getAddress();
  console.log("✅ ProfileRegistry deployed ke:", profileRegistryAddress);

  // ── 2. Deploy FeedContract ──
  console.log("\n2️⃣  Deploy FeedContract...");
  const feedContract = await ethers.deployContract("FeedContract", [profileRegistryAddress]);
  await feedContract.waitForDeployment();
  const feedContractAddress = await feedContract.getAddress();
  console.log("✅ FeedContract deployed ke:", feedContractAddress);

  // ── 3. Deploy TipContract ──
  // Alamat USDC di Arc testnet — kita update nanti setelah dapat info dari Arc
  const USDC_ADDRESS = "0x0000000000000000000000000000000000000000";
  console.log("\n3️⃣  Deploy TipContract...");
  const tipContract = await ethers.deployContract("TipContract", [
    profileRegistryAddress,
    feedContractAddress,
    USDC_ADDRESS,
  ]);
  await tipContract.waitForDeployment();
  const tipContractAddress = await tipContract.getAddress();
  console.log("✅ TipContract deployed ke:", tipContractAddress);

  // ── Ringkasan ──
  console.log("\n🎉 Semua contract berhasil di-deploy!\n");
  console.log("📋 Simpan address ini — dibutuhkan untuk frontend:");
  console.log("─────────────────────────────────────────────────");
  console.log("ProfileRegistry :", profileRegistryAddress);
  console.log("FeedContract    :", feedContractAddress);
  console.log("TipContract     :", tipContractAddress);
  console.log("─────────────────────────────────────────────────");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});