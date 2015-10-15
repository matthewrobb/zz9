import test from 'blue-tape';
import matcher from '../../src/server/tasks/EpisodeMatcher';

test('EpisodeMatcher - any should return true', (t) => {
  t.plan(4);
  t.ok(matcher.match({quality: 'any'}, {quality: null}));
  t.ok(matcher.match({quality: 'any'}, {quality: 480}));
  t.ok(matcher.match({quality: 'any'}, {quality: 720}));
  t.ok(matcher.match({quality: 'any'}, {quality: 1080}));
});

test('EpisodeMatcher - match 1080', (t) => {
  t.plan(1);
  t.ok(matcher.match({quality: '1080'}, {quality: 1080}));
});


test('EpisodeMatcher - match 720', (t) => {
  t.plan(1);
  t.ok(matcher.match({quality: '720'}, {quality: 720}));
});

test('EpisodeMatcher - match HD', (t) => {
  t.plan(1);
  t.ok(matcher.match({quality: 'hd'}, {isHD: true}));
});

test('EpisodeMatcher - match SD', (t) => {
  t.plan(1);
  t.ok(matcher.match({quality: 'sd'}, {isHD: false}));
});

test('EpisodeMatcher - no match', (t) => {
  t.plan(5);
  t.notOk(matcher.match({quality: '1080'}, {quality: 720}));
  t.notOk(matcher.match({quality: '720'}, {quality: 1080}));
  t.notOk(matcher.match({quality: '720'}, {quality: 480}));
  t.notOk(matcher.match({quality: 'HD'}, {isHD: false}));
  t.notOk(matcher.match({quality: 'SD'}, {isHD: true}));
});
