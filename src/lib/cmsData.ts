import fs from "fs";
import path from "path";
import os from "os";

const isVercel = process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const storageDir = isVercel ? os.tmpdir() : path.join(process.cwd(), "src", "data");
const cmsFilePath = path.join(storageDir, "hospitalCmsData.json");
const seedCmsPath = path.join(process.cwd(), "src", "data", "hospitalCmsData.json");

let inMemoryCmsData: any = null;

function ensureInitialized() {
  try {
    if (!fs.existsSync(cmsFilePath)) {
      if (fs.existsSync(seedCmsPath)) {
        const seed = fs.readFileSync(seedCmsPath, "utf8");
        fs.writeFileSync(cmsFilePath, seed, "utf8");
      }
    }
  } catch (e) {
    console.warn("Storage init warning, using memory:", e);
  }
}

export async function getCmsData(): Promise<any> {
  if (inMemoryCmsData) return inMemoryCmsData;

  try {
    ensureInitialized();
    if (fs.existsSync(cmsFilePath)) {
      const data = JSON.parse(fs.readFileSync(cmsFilePath, "utf8"));
      inMemoryCmsData = data;
      return data;
    }
  } catch (err) {
    console.error("Error reading cms data:", err);
  }

  try {
    if (fs.existsSync(seedCmsPath)) {
      const seed = JSON.parse(fs.readFileSync(seedCmsPath, "utf8"));
      inMemoryCmsData = seed;
      return seed;
    }
  } catch (e) {
    console.error(e);
  }

  return { hospitalProfile: {}, announcements: [], seoSettings: {} };
}

export async function saveCmsData(data: any): Promise<boolean> {
  inMemoryCmsData = data;
  try {
    ensureInitialized();
    fs.writeFileSync(cmsFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.warn("CMS write warning (using memory):", err);
    return true;
  }
}
