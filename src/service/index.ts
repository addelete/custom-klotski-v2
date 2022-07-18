import browser from './browser';

interface Service {
  getGameList(): Promise<DBGame[]>;
  setGame(game: DBGame): Promise<DBGame>;
}

const service = {
  browser,
}[import.meta.env.VITE_PLATFORM as string] as Service

export default service;
