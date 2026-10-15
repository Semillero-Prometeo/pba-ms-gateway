const { readFileSync } = require('fs');
const { join } = require('path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const schema = readFileSync(join(__dirname, '../prisma/schema.prisma'), 'utf8');

describe('gateway Roles enum', () => {
  it('has only ADMIN and USER and email 120', () => {
    const block = schema.slice(schema.indexOf('enum Roles'), schema.indexOf('enum DocumentTypes'));
    assert.equal(block.includes('STUDENT'), false);
    assert.equal(block.includes('TEACHER'), false);
    assert.match(schema, /email\s+String\s+@unique\s+@db\.VarChar\(120\)/);
  });
});
