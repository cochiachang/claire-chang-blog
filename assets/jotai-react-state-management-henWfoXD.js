var e=`---
title: Jotai 如何在 React 中管理共享狀態
description: 介紹 Jotai atom、useAtom、useAtomValue、useSetAtom 與適合使用的 React 狀態管理情境。
date: 2024-07-25
category: 前端開發
tags: [Jotai, React, 狀態管理, JavaScript]
readingTime: 6 分鐘
image: /images/tech/hero_jotai-react-state-management.webp
imageAlt: 螢幕顯示 React 標誌與程式碼，象徵 Jotai atom 管理共享狀態
---


# Jotai 如何在 React 中管理共享狀態

Jotai 是一個以 atom 為核心的 React 狀態管理函式庫，適合需要共享狀態、避免 prop drilling、又不想導入大型狀態框架的前端專案。Jotai 的基本心智模型接近 React state，但 atom 可以被多個元件讀取與更新。

## Jotai 是什麼？

Jotai 是 primitive and flexible state management for React。Jotai 透過 atom 定義狀態單位，讓元件用 hook 讀取或更新狀態。

Atom 可以想成「可被 React 元件訂閱的狀態設定」。Jotai 官方文件說明，\`atom()\` 建立的是 atom config，實際值存在 store 中，只有被 \`useAtom\` 等 hook 使用後才會進入狀態管理流程。

Jotai 適合下列情境：

- 多個兄弟元件需要共享狀態。
- 狀態邏輯不大，但 prop drilling 已經造成維護負擔。
- 想把 derived state 拆成可組合的小單位。
- 需要比 Context 更細緻地控制元件重渲染。

## Jotai 的核心概念是什麼？

Jotai 的核心概念是 atom 與 hook。Atom 定義狀態，\`useAtom\`、\`useAtomValue\`、\`useSetAtom\` 決定元件如何讀寫狀態。

最基本的 atom 定義方式如下：

\`\`\`javascript
import { atom } from "jotai";

const countAtom = atom(0);
const countryAtom = atom("Japan");
const citiesAtom = atom(["Tokyo", "Kyoto", "Osaka"]);

const animeAtom = atom([
  {
    title: "Ghost in the Shell",
    year: 1995,
    watched: true,
  },
  {
    title: "Serial Experiments Lain",
    year: 1998,
    watched: false,
  },
]);
\`\`\`

Atom 不一定只能放 primitive value，也可以放陣列、物件或 derived atom。需要注意的是，atom 依物件參照判斷身份，因此不要在 render 過程中無記憶化地建立 atom，否則可能造成不必要的重渲染或迴圈。

## 什麼時候使用 useAtom？

同一個元件需要同時讀取與更新 atom 時，使用 \`useAtom\` 最直覺。\`useAtom\` 回傳 \`[value, setter]\`，使用方式接近 React 的 \`useState\`。

原文範例整理如下：

\`\`\`javascript
import { useAtom } from "jotai";

const AnimeApp = () => {
  const [anime, setAnime] = useAtom(animeAtom);

  return (
    <>
      <ul>
        {anime.map((item) => (
          <li key={item.title}>{item.title}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          setAnime((anime) => [
            ...anime,
            {
              title: "Cowboy Bebop",
              year: 1998,
              watched: false,
            },
          ]);
        }}
      >
        Add Cowboy Bebop
      </button>
    </>
  );
};
\`\`\`

這種寫法適合小型互動元件，例如表單、列表操作、開關狀態或簡單的使用者偏好設定。

## 什麼時候使用 useAtomValue 與 useSetAtom？

元件只需要讀取 atom 時使用 \`useAtomValue\`，只需要更新 atom 時使用 \`useSetAtom\`。拆開讀寫可以減少不必要的重渲染。

Jotai 官方文件也建議，當 atom values 只被讀取或寫入時，用 separate hooks 最佳化 re-render。下面是將原文範例拆成列表、按鈕與進度元件的寫法：

\`\`\`javascript
import { useAtomValue, useSetAtom } from "jotai";

const AnimeList = () => {
  const anime = useAtomValue(animeAtom);

  return (
    <ul>
      {anime.map((item) => (
        <li key={item.title}>{item.title}</li>
      ))}
    </ul>
  );
};

const AddAnime = () => {
  const setAnime = useSetAtom(animeAtom);

  return (
    <button
      onClick={() => {
        setAnime((anime) => [
          ...anime,
          {
            title: "Cowboy Bebop",
            year: 1998,
            watched: false,
          },
        ]);
      }}
    >
      Add Cowboy Bebop
    </button>
  );
};
\`\`\`

如果 \`AddAnime\` 不需要讀取 \`animeAtom\`，使用 \`useSetAtom\` 可以讓新增按鈕不因列表資料變化而重渲染。

## Jotai 和 Context 的差別在哪裡？

Jotai 比 React Context 更適合細粒度共享狀態。Context 適合傳遞全域設定，Jotai 適合把狀態拆成可獨立訂閱的 atom。

簡單判斷方式如下：

| 需求 | 較適合工具 |
|---|---|
| 主題、語系、登入者等低頻變更設定 | React Context |
| 多個元件共享且頻繁變動的值 | Jotai |
| 狀態需要 derived atom 組合 | Jotai |
| 大型非同步資料快取 | React Query 或其他資料層工具 |

Jotai 不會取代所有狀態管理工具。若資料主要來自 API，仍應區分「server state」與「client UI state」。

## 常見問題

### Jotai 適合大型 React 專案嗎？

Jotai 可以用在大型 React 專案，但需要建立清楚的 atom 命名與檔案組織規則。狀態很多時，應避免把所有 atom 放在同一個檔案。

### Jotai 和 Zustand 哪個比較好？

Jotai 偏 atom-based，適合把狀態拆成小單位。Zustand 偏 store-based，適合集中管理一組狀態與 actions。

### \`useAtom\` 會造成效能問題嗎？

\`useAtom\` 本身不是問題，但只需要寫入 atom 的元件若使用 \`useAtom\`，就會訂閱該 atom 的值。此時改用 \`useSetAtom\` 通常更好。

### Atom 可以在元件內建立嗎？

Atom 可以在元件內建立，但必須使用 \`useMemo\`、\`useRef\` 或其他方式保持參照穩定。每次 render 都建立新 atom 可能造成無限迴圈。

### Jotai 需要 Provider 嗎？

簡單使用 Jotai 時可以不手動加 Provider。需要自訂 store、隔離 scope 或測試狀態時，再使用 Provider 會更清楚。

## 參考資料

- Jotai official documentation: <https://jotai.org/>
- Jotai atom documentation: <https://jotai.org/docs/core/atom>
- Jotai useAtom documentation: <https://jotai.org/docs/core/use-atom>

## 延伸閱讀

- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取](/post/insert-flash-in-browser-settings)：同樣聚焦 JavaScript，可接著比較不同情境的做法。
- [JavaScript H.264 解碼器介紹 – Broadway](/post/javascript-h264-decoder-broadway)：同樣聚焦 JavaScript，可接著比較不同情境的做法。
- [PixiJS 如何控制 loading page 與載入進度](/post/pixi-loading-page-control)：同樣聚焦 JavaScript，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28，依原始 Jotai 介紹整理為可發布的 GEO 技術文章。

`;export{e as default};