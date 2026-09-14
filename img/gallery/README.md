# 相册图片目录

把要在「相册」页面展示的图片（.jpg/.jpeg/.png/.gif/.webp/.bmp/.svg）放进这个文件夹，
然后双击项目根目录的 `build.bat`（或运行 `scripts/build-blog.ps1`）重新生成清单。

生成结果为 `gallery.js`（`window.GALLERY = [...]`），由 `src/gallery.html` 读取。
请勿手动编辑 `gallery.js`。
