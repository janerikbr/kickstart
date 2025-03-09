import prompts from "prompts";
import * as fs from "node:fs/promises"; // Use node:fs/promises for async functions
import { execa } from "execa";
import * as path from "node:path";

async function kickstart() {
  try {
    // 1. Prompt for Project Name
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "Enter project name:",
      validate: (value) => (value ? true : "Project name is required"),
    });

    const projectName = response.projectName;

    // Calculate the project directory one level up
    const projectDir = path.resolve(process.cwd(), "..", projectName); // Go up one level

    // 2. Confirm Overwrite (if directory exists)
    if (await exists(projectDir)) {
      const overwriteResponse = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `Directory "${projectName}" already exists in the parent directory. Overwrite?`,
        initial: false,
      });

      if (!overwriteResponse.overwrite) {
        console.log("Initialization cancelled.");
        return;
      }

      await remove(projectDir); // Delete existing directory
    }

    // 3. Copy Files
    console.log(`Creating project "${projectName}" in ${projectDir}...`);
    await copy(process.cwd(), projectDir); // Copy boilerplate to new directory

    // 4. Modify Content
    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJson = await readJson(packageJsonPath);
    packageJson.name = projectName;
    await writeJson(packageJsonPath, packageJson, 2);

    // 5. Delete `.git` folder
    await remove(path.join(projectDir, ".git"));

    // 6. Install Dependencies
    console.log("Installing dependencies...");
    await execa("pnpm", ["install"], { cwd: projectDir }); // Or npm install / yarn install

    console.log(`Project "${projectName}" created successfully!`);
    console.log(`cd ../${projectName} and start hacking!`); // Adjusted instructions

    // 7. Uninstall Dependencies and Remove Script
    console.log("Cleaning up...");
    await execa("pnpm", ["uninstall", "prompts", "execa"], {
      cwd: projectDir,
    }); //Uninstall deps

    try {
      await remove(path.resolve(projectDir, "kickstart.js"));
    } catch (e) {}
    try {
      await remove(path.resolve(projectDir, "kickstart.ts"));
    } catch (e) {
      //Do nothing
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

kickstart();

// Helper function to check if a directory exists
async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

// Helper function to remove a directory recursively (async)
async function remove(path: string): Promise<void> {
  await fs.rm(path, { recursive: true, force: true }); // force: true avoids errors if the file doesn't exist
}

// Helper function to copy a directory recursively (async)
async function copy(src: string, dest: string): Promise<void> {
  await fs.cp(src, dest, { recursive: true });
}

// Helper function to read a JSON file (async)
async function readJson(filePath: string): Promise<any> {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

// Helper function to write a JSON file (async)
async function writeJson(
  filePath: string,
  data: any,
  spaces: number = 2,
): Promise<void> {
  const json = JSON.stringify(data, null, spaces);
  await fs.writeFile(filePath, json, "utf-8");
}
