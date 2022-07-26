/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

type DBGame = {
  id?: string; // id
  name: string; // 名称
  tags: string[]; // 标签
  cover?: string; // 封面
  author?: string; // 作者
  description?: string; // 描述
  data: string; // 数据
  type: string; // 类型
  md5: string; // md5
  version: string; // 版本
};

type Size = {
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};