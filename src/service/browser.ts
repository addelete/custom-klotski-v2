/**
 * 浏览器模式专用服务
 */

import { message } from 'ant-design-vue';
import localforage from 'localforage';
import { nanoid } from 'nanoid';



export default {
  /**
   * 获取游戏列表
   * @returns
   */
  async getGameList(): Promise<DBGame[]> {
    return (await localforage.getItem<DBGame[]>('gameList')) || [];
  },

  /**
   *
   * @param game 保存游戏
   * @returns
   */
  async setGame(game: DBGame): Promise<DBGame> {
    // 查询当前游戏列表
    const games = await this.getGameList();
    // 通过MD5查询当前游戏是否存在
    const checkUniqIndex = games.findIndex((g) => g.md5 === game.md5);
    // 定义如有重复的游戏时的报错
    const throwUniqError = () => {
      message.error('相同布局已存在');
      throw new Error('相同布局已存在');
    };

    // 如果存在则更新，否则添加
    if (game.id) {
      const index = games.findIndex((g) => g.id === game.id); // 判断是否真实存在此id的游戏
      if (index > -1) {
        // 如果存在则更新
        if (checkUniqIndex !== -1 && checkUniqIndex !== index) {
          // 如果要保存的时候发现和别的游戏MD5相同，则报错
          throwUniqError();
        }
        // 更新并返回
        games[index] = game;
        await localforage.setItem('gameList', games);
        return game;
      }
    }

    // 如果不存在则添加

    if (checkUniqIndex !== -1) {
      // 如果要保存的时候发现和别的游戏MD5相同，则报错
      throwUniqError();
    }
    game.id = nanoid();
    games.push(game);
    await localforage.setItem('gameList', games);
    return game;
  },
};
