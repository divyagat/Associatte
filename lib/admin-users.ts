import { promises as fs } from 'fs';
import path from 'path';
import {
  Permissions,
  sanitizePermissions,
  DEFAULT_EMPLOYEE_PERMISSIONS,
} from './admin-permissions';

/**
 * Employee account store.
 *
 * Employees are limited admin users whose access is controlled per-section
 * (see `permissions`). They're persisted to `data/admin-users.json` alongside
 * the other file-based data. Passwords are stored in plaintext to match the
 * existing simple admin scheme — fine for an internal tool, but swap for
 * hashing if this ever goes public.
 */
export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  permissions: Permissions;
  createdAt: string;
}

/** Employee shape that is safe to send to the client (no password). */
export type SafeEmployee = Omit<Employee, 'password'>;

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'admin-users.json');

async function readUsers(): Promise<Employee[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    // Backfill permissions for records saved before per-section access existed.
    return data.map((u: any) => ({
      ...u,
      permissions: u.permissions
        ? sanitizePermissions(u.permissions)
        : DEFAULT_EMPLOYEE_PERMISSIONS,
    }));
  } catch (error: any) {
    if (error?.code === 'ENOENT') return [];
    console.error('❌ Failed to read admin-users.json:', error.message);
    return [];
  }
}

async function writeUsers(users: Employee[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

const strip = ({ password, ...rest }: Employee): SafeEmployee => rest;

export async function getEmployees(): Promise<SafeEmployee[]> {
  const users = await readUsers();
  return users.map(strip);
}

/** Returns the matching employee (incl. password) or null — used at login. */
export async function findEmployeeByCredentials(
  email: string,
  password: string,
): Promise<Employee | null> {
  const users = await readUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  );
  return match || null;
}

export async function createEmployee(data: {
  name: string;
  email: string;
  password: string;
  permissions?: unknown;
}): Promise<SafeEmployee> {
  const name = data.name?.trim();
  const email = data.email?.trim().toLowerCase();
  const password = data.password;

  if (!name || !email || !password) {
    throw new Error('Name, email and password are all required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address');
  }
  if (password.length < 4) {
    throw new Error('Password must be at least 4 characters');
  }

  const permissions =
    data.permissions !== undefined
      ? sanitizePermissions(data.permissions)
      : DEFAULT_EMPLOYEE_PERMISSIONS;

  const users = await readUsers();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error('An employee with this email already exists');
  }

  const employee: Employee = {
    id: (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`),
    name,
    email,
    password,
    permissions,
    createdAt: new Date().toISOString(),
  };

  users.unshift(employee);
  await writeUsers(users);
  return strip(employee);
}

/** Update an existing employee's name and/or permissions. Returns the updated record or null. */
export async function updateEmployee(
  id: string,
  data: { name?: string; permissions?: unknown },
): Promise<SafeEmployee | null> {
  const users = await readUsers();
  const employee = users.find((u) => u.id === id);
  if (!employee) return null;

  if (typeof data.name === 'string') {
    const name = data.name.trim();
    if (!name) throw new Error('Name cannot be empty');
    employee.name = name;
  }
  if (data.permissions !== undefined) {
    employee.permissions = sanitizePermissions(data.permissions);
  }

  await writeUsers(users);
  return strip(employee);
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const users = await readUsers();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length) return false;
  await writeUsers(next);
  return true;
}
