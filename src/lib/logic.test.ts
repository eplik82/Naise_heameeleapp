/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ALL_CATEGORIES, SUGGESTIONS } from '../data/suggestions';
import { notificationDates, pickSequence, pickSuggestion, planReminderDate, RECENT_LIMIT } from './logic';

test('kõigil soovitustel on unikaalne id', () => {
  const ids = new Set(SUGGESTIONS.map((s) => s.id));
  assert.equal(ids.size, SUGGESTIONS.length);
});

test('igas kategoorias on soovitusi', () => {
  for (const c of ALL_CATEGORIES) {
    assert.ok(SUGGESTIONS.some((s) => s.category === c), c);
  }
});

test('soovitus tuleb ainult lubatud kategooriatest', () => {
  for (let i = 0; i < 50; i++) {
    const s = pickSuggestion(SUGGESTIONS, ['lilled', 'kultuur'], []);
    assert.ok(s && ['lilled', 'kultuur'].includes(s.category));
  }
});

test('ilma kategooriateta soovitust ei tule', () => {
  assert.equal(pickSuggestion(SUGGESTIONS, [], []), undefined);
});

test('hiljutised soovitused ei kordu ja kategooria vaheldub', () => {
  const seq = pickSequence(SUGGESTIONS, ALL_CATEGORIES, [], 40);
  assert.equal(seq.length, 40);
  for (let i = 1; i < seq.length; i++) {
    const window = seq.slice(Math.max(0, i - RECENT_LIMIT), i).map((s) => s.id);
    assert.ok(!window.includes(seq[i].id), `kordus kohal ${i}`);
    assert.notEqual(seq[i].category, seq[i - 1].category, `sama kategooria kohal ${i}`);
  }
});

test('ühe kategooria korral leitakse ikka soovitus', () => {
  const seq = pickSequence(SUGGESTIONS, ['lilled'], [], 10);
  assert.equal(seq.length, 10);
  for (let i = 1; i < seq.length; i++) assert.notEqual(seq[i].id, seq[i - 1].id);
});

test('teavituste ajad: täna, kui kellaaeg pole veel möödas', () => {
  const now = new Date(2026, 9, 10, 8, 0);
  const dates = notificationDates(now, 3, 10, 30, 3);
  assert.deepEqual(
    dates.map((d) => [d.getDate(), d.getHours(), d.getMinutes()]),
    [[10, 10, 30], [13, 10, 30], [16, 10, 30]],
  );
});

test('teavituste ajad: homme, kui kellaaeg on möödas', () => {
  const now = new Date(2026, 9, 10, 12, 0);
  const [first, second] = notificationDates(now, 7, 10, 0, 2);
  assert.equal(first.getDate(), 11);
  assert.equal(second.getDate(), 18);
});

test('plaani meeldetuletus päev enne kell 9', () => {
  const now = new Date(2026, 9, 10, 12, 0);
  const d = planReminderDate(new Date(2026, 9, 17, 19, 0), 1, now);
  assert.ok(d);
  assert.deepEqual([d.getDate(), d.getHours()], [16, 9]);
});

test('samal päeval varajase plaani meeldetuletus on tund enne', () => {
  const now = new Date(2026, 9, 10, 6, 0);
  const d = planReminderDate(new Date(2026, 9, 10, 8, 0), 0, now);
  assert.ok(d);
  assert.deepEqual([d.getDate(), d.getHours()], [10, 7]);
});

test('minevikus meeldetuletust ei ajastata', () => {
  const now = new Date(2026, 9, 10, 12, 0);
  assert.equal(planReminderDate(new Date(2026, 9, 10, 18, 0), 1, now), undefined);
});
