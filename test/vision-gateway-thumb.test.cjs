const { readFileSync } = require('fs');
const { join } = require('path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const src = readFileSync(join(__dirname, '../src/mai-core-ms/vision/vision.gateway.ts'), 'utf8');

describe('vision gateway thumb size', () => {
  it('defaults thumbs to 480 and allows 960', () => {
    assert.match(src, /thumbMaxWidth: 480/);
    assert.match(src, /Math\.min\(960/);
  });
});
