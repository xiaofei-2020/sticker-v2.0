# 表情包合成项目V2.0

> 本项目仅供个人学习使用

V1.0版本线上演示：https://qcjdye.app.cloudendpoint.cn/
V2.0版本线上演示：https://qczn18.app.cloudendpoint.cn/

## 快速开始

​	安装依赖：

```sh
npm install
```

​	本地启动：

```sh
npm run dev
```

打包构建
```sh
npm run build
```

## 技术架构

### 技术栈

`FFmpeg`、`WebAssembly`、`Vue3`、`TypeScript`、`Vite`、`Pinia`、`Element Plus`

### 架构示意图

![img](https://raw.githubusercontent.com/xiaofei-2020/sticker-v2.0/main/docs/images/architecture.png)

### 架构说明

​   本项目主要由 `UI` 、 `FFmpeg` 、 `Canvas` 三个模块构成。`FFmpeg` 和 `Canvas` 模块为 `UI` 模块提供服务，不依赖于上层模块；`UI` 模块在 `FFmpeg` 和 `Canvas` 两个模块提供的服务基础之上，构建用户界面，收集用户输入信息，并作出反馈。下面详细介绍以上三个模块：

**一、UI 模块**

​   包括整个前端界面。主要负责接收用户输入信息、反馈用户请求。

​   比如，`UI` 模块接受了用户上传的 `Gif` 文件和文字，将 `Gif` 文件以“参数”（或者称为“接口”）的形式传递给 `FFmpeg` 模块，`FFmpeg` 提供“解析 `Gif` 为序列帧”的服务，返回序列帧（“.png”格式的图片）给 `UI` 模块。然后，`UI` 模块将序列帧和文字以参数的形式传递给 `Canvas` 模块，请求其提供“合成图片与文字”的服务，`Canvas` 模块接收到相关参数后，进行图片合成，并将合成好的图片返回给 `UI` 模块。最后，`UI` 将所有合成的图片（“序列帧”），交给 `FFmpeg`， `FFmpeg` 提供“合成序列帧为Gif”的服务，并将 `Gif` 文件返回给 `UI` 模块。这样，合成表情包的功能就完成了。

**二、FFmpeg 模块**

​   基于浏览器提供的 `WebAssembly` 技术，主要负责为上层模块提供处理二进制文件相关的服务，比如“解析Gif为序列帧”、“合成序列帧为Gif”、“格式转换”等服务。

**三、Canvas 模块**

​   可以把这个模块想像成一个“画板”。“用户”（注意，这里的用户指的的是上层模块）可以在这个“画板”上绘制任何东西。比如，先在“画板”上绘制一张`image`，再在特定的位置绘制一些文字，还能进行图片裁剪、旋转、马赛克等一系列操作，在这一系列操作之后，“用户”就可以从画板上获取到自己的“创作品”了。

