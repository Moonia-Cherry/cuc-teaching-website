# 接口：获取视频列表

- **方法**：`GET`

- **路径**：`/api/video`

- **描述**：返回系统中可访问的视频条目列表。该接口当前设计为一次返回全部视频（适用于视频量少的场景）。如视频量增长，建议改为支持分页（`page`/`limit`）与后端搜索。

## 返回字段说明（`Video`）

```ts
export interface Video {
  id: string; // 唯一 id（必需）
  title: string; // 显示标题（必需）
  url: string; // 可直接用于 <video src="..."> 的 URL（必需）
  poster: string; // 封面图片 URL 或 base64 字符串（建议由后端在上传后生成并返回；若无可为空字符串）
  filename?: string; // 原始文件名（可选）
}
```

`VideoListResponse`：

```ts
export interface VideoListResponse {
  code: number;
  data: Video[];
  message?: string;
}
```

---

## 成功响应示例（HTTP 200）

```json
{
  "code": 0,
  "data": [
    {
      "id": "abc123",
      "title": "00.计算思维导论",
      "url": "https://cdn.example.com/videos/00.%E8%AE%A1%E7%AE%97%E6%80%9D%E7%BB%B4%E5%AF%BC%E8%AE%BA.mp4",
      "poster": "https://cdn.example.com/posters/00.png",
      "filename": "00.计算思维导论.mp4"
    },
    {
      "id": "def456",
      "title": "1-1-1 计算机硬件",
      "url": "https://cdn.example.com/videos/1-1-1%20%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A1%AC%E4%BB%B6.mp4",
      "poster": "",
      "filename": "1-1-1 计算机硬件.mp4"
    }
  ],
  "message": "ok"
}
```

---

## 失败响应示例

```json
{
  "code": 1001,
  "data": [],
  "message": "查询视频列表失败"
}
```

# 接口：获取文档列表

- **方法**：`GET`

- **路径**：`/api/docs`

- **描述**：返回系统中可访问的文档条目列表。该接口当前设计为一次返回全部文档（适用于文档量少的场景）。如文档量增长，建议改为支持分页（`page`/`limit`）与后端搜索。

## 返回字段说明（`Doc`）

```ts
export interface Doc {
  id: string; // 文档唯一ID（必需）
  name: string; // 文档显示标题（必需）
  url: string; // 文档可直接访问的URL，可用于预览或下载（必需）
  filename?: string; // 原始文件名（可选，用于显示或备份）
}
```

`DocListResponse`：

```ts
export interface DocListResponse {
  code: number;
  data: Doc[];
  message?: string;
}
```

---

## 成功响应示例（HTTP 200）

```json
{
  "code": 0,
  "data": [
    {
      "id": "doc_001",
      "name": "项目需求文档",
      "url": "https://cdn.example.com/docs/requirements.pdf",
      "filename": "project_requirements_v1.2.pdf"
    },
    {
      "id": "doc_002",
      "name": "用户手册",
      "url": "https://cdn.example.com/docs/user_guide.docx",
      "filename": "user_manual_final.docx"
    },
    {
      "id": "doc_003",
      "name": "API接口文档",
      "url": "https://cdn.example.com/docs/api_spec.md",
      "filename": "api_specification.md"
    }
  ],
  "message": "获取文档列表成功"
}
```

---

## 空数据响应示例

```json
{
  "code": 0,
  "data": [],
  "message": "暂无文档"
}
```

---

## 失败响应示例

```json
{
  "code": 2001,
  "data": [],
  "message": "查询文档列表失败"
}
```
