export default class Player {
  static readonly player1_base_url = 'https://www.2embed.to/embed/tmdb/';

  static readonly player2_base_url = 'https://dbgo.fun/';

  static readonly player3_base_url = 'databasegdriveplayer.co/player.php?';

  static moviePlayerUrl = (id: number, player: number): string => {
    switch (player) {
      case 1:
        return `${this.player1_base_url}movie?id=${id}`;
      case 2:
        return `${this.player2_base_url}imdb.php?id=${id}`;
      case 3:
        return `http://${this.player3_base_url}tmdb=${id}`;
      default:
        return `${this.player1_base_url}movie?id=${id}`;
    }
  };

  static tvPlayerUrl = (id: number, player: number, season: number, episode?: number): string => {
    switch (player) {
      case 1:
        return `${this.player1_base_url}tv?id=${id}&s=${season}&e=${episode}`;
      case 2:
        return `${this.player2_base_url}tv-imdb.php?id=${id}&s=${season}`;
      case 3:
        return `http://series.${this.player3_base_url}type=series&tmdb=${id}&season=${season}&episode=${episode}`;
      default:
        return `${this.player1_base_url}tv?id=${id}&s=1&e=1`;
    }
  };
}
