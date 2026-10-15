const { readFileSync } = require('fs');
const { join } = require('path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const users = readFileSync(join(__dirname, '../src/auth-ms/users/users.controller.ts'), 'utf8');
const roles = readFileSync(join(__dirname, '../src/auth-ms/roles/roles.controller.ts'), 'utf8');
const guard = readFileSync(join(__dirname, '../src/auth/guards/roles.guard.ts'), 'utf8');

describe('RolesGuard active role', () => {
  it('checks the active role name, not any assigned role', () => {
    assert.match(guard, /headers\['x-active-role'\]/);
    assert.match(guard, /role\.id/);
    assert.match(guard, /role\.name/);
    assert.equal(guard.includes('userRoleNames.includes'), false);
  });
});

describe('admin HTTP gate', () => {
  it('protects users and roles with ADMIN', () => {
    assert.match(users, /HasRoles/);
    assert.match(users, /Roles\.ADMIN/);
    assert.match(users, /RolesGuard/);
    assert.equal(users.includes('@Public()'), false);
    assert.match(roles, /HasRoles/);
    assert.match(roles, /Roles\.ADMIN/);
    assert.match(roles, /RolesGuard/);
  });
});
