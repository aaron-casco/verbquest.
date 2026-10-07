import test from 'node:test';import assert from 'node:assert/strict';import {normalisePreferences} from './preferences.js';
test('Personal preferences default to English and keep independent clamped volumes',()=>{assert.deepEqual(normalisePreferences(),{language:'en',music:8,sound:100});assert.deepEqual(normalisePreferences({language:'es',music:0,sound:100}),{language:'es',music:0,sound:100});assert.deepEqual(normalisePreferences({language:'xx',music:500,sound:-2}),{language:'en',music:100,sound:0});});

test('Previously saved audio choices are preserved after changing defaults',()=>{assert.deepEqual(normalisePreferences({language:'es',music:12,sound:25}),{language:'es',music:12,sound:25});});
