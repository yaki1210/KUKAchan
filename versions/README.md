# MIMI 模型版本

工作区：`E:\project\KUKAchan`  
远程：`https://github.com/yaki1210/KUKAchan`（默认只在本地提交，不自动推送）

## 两层版本

| 层 | 用途 |
|---|---|
| `versions/vN-*/` | 模型快照。改形体/材质前先打一份，坏了能还原。 |
| `git` | 全仓库历史。快照脚本只拷贝模型相关文件。 |

`src/components/assistant/` 永远是正在改的工作副本。不要直接改 `versions/` 里的代码。

## 命令

```bash
npm run version:list
npm run version:snap -- v3-panels --name "分件与橙带" --stage "02-上色" --notes "板缝+环带" --preview screenshots/foo.png
npm run version:restore -- v2-paint --yes
```

快照文件：

- `AssistantModel.tsx` `geom.ts` `materials.ts`
- `Studio.tsx` `StudioOverlay.tsx` `studio-store.ts`
- `VERSION.json`，可选 `preview.png`

## 目录

见 `index.json`。建模优化顺序见 `ROADMAP.md`。
