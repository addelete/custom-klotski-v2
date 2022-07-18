import { defineStore } from 'pinia';
import service from '../service';

type GameStoreState = {
  games: DBGame[];
}

export const useGameStore = defineStore('game', {
  state: () => ({
    games: [],
  } as GameStoreState),
  actions: {
    async loadGameList() {
      const games = await service.getGameList();
      this.games = games;
    }
  }
});
