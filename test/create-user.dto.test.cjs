const { readFileSync } = require('fs');
const { join } = require('path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const dto = readFileSync(
  join(__dirname, '../src/auth-ms/users/dto/create-user.dto.ts'),
  'utf8',
);

describe('gateway CreateUserDto', () => {
  it('requires password and role_ids', () => {
    assert.match(dto, /password: string/);
    assert.match(dto, /role_ids/);
    assert.match(dto, /ArrayMinSize\(1\)/);
  });
});
