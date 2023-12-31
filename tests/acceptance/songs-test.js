import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | songs', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  test('Sort songs in various ways', async function (assert) {
    let band = this.server.create('band', { name: 'Them Crooked Vultures' });
    this.server.create('song', {
      title: 'Mind Eraser, No Chaser',
      rating: 2,
      band,
    });
    this.server.create('song', { title: 'Elephants', rating: 4, band });
    this.server.create('song', {
      title: 'Spinning in Daffodils',
      rating: 5,
      band,
    });
    this.server.create('song', { title: 'New Fang', rating: 3, band });
    await visit('/');
    await click('[data-test-rr=band-link]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Elephants',
        'The first song is the one that comes first in the alphabet',
      );
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText(
        'Spinning in Daffodils',
        'The last song is the one that comes last in the alphabet',
      );

    assert.ok(
      currentURL().includes('s=-title'),
      'The sort query param appears in the URL with the correct value',
    );

    await click('[data-test-rr=sort-by-title-desc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Spinning in Daffodils',
        'The first song is the one that comes last in the alphabet',
      );
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText(
        'Elephants',
        'The last song is the one that comes first in the alphabet',
      );

    assert.ok(
      currentURL().includes('s=rating'),
      'The sort query param appears in the URL with the correct value',
    );
    await click('[data-test-rr=sort-by-rating-asc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText('Mind Eraser, No Chaser', 'The first song is the lowest rated');
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText('Spinning in Daffodils', 'The last song is the highest rated');
    await click('[data-test-rr=sort-by-rating-desc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText('Spinning in Daffodils', 'The first song is the highest rated');
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText('Mind Eraser, No Chaser', 'The last song is the lowest rated');

    assert.ok(
      currentURL().includes('s=rating'),
      'The sort query param appears in the URL with the correct value',
    );
  });
});
