import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class BandsBandSongsController extends Controller {
  @tracked showAddSong = true;
  @tracked title = '';
  @tracked sortBy = 'title';

  @service catalog;

  get sortedSongs() {
    let sortBy = this.sortBy;
    let isDescendingSort = false;
    if (sortBy.charAt(0) === '-') {
      sortBy = this.sortBy.slice(1);
      isDescendingSort = true;
    }
    return [...this.model.songs].sort((song1, song2) => {
      if (song1[sortBy] < song2[sortBy]) {
        return isDescendingSort ? 1 : -1;
      }
      if (song1[sortBy] > song2[sortBy]) {
        return isDescendingSort ? -1 : 1;
      }
      return 0;
    });
  }

  @action
  async updateRating(song, rating) {
    this.catalog.update('song', song, { rating });
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }
  @action
  async saveSong() {
    let song = await this.catalog.create(
      'song',
      { title: this.title },
      { band: { data: { id: this.model.id, type: 'bands' } } },
    );

    this.model.songs = [...this.model.songs, song];
    this.title = '';
    this.showAddSong = true;
  }
  @action
  cancel() {
    this.title = '';
    this.showAddSong = true;
  }
}
