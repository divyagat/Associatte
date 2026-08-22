// lib/blob-store.ts
import fs from 'fs/promises';
import path from 'path';

/**
 * Reads and parses a JSON file from the project root.
 * Returns null if the file doesn't exist (e.g., first run).
 */
export async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(fileContents) as T;
  } catch (error: any) {
    // If file doesn't exist yet, return null gracefully
    if (error.code === 'ENOENT') {
      return null;
    }
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

/**
 * Writes data to a JSON file, creating directories if they don't exist.
 */
export async function writeJson<T>(filePath: string, data: T): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    
    // Ensure the directory exists before writing (e.g., creates 'data/' folder)
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}