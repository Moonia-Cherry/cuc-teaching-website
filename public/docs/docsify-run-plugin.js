// docsify-run-plugin.js
window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(
  function (hook) {
    hook.doneEach(function () {
      // 找到所有的代码块
      const codeBlocks = document.querySelectorAll("pre[data-lang]");

      codeBlocks.forEach(block => {
        // 创建一个运行按钮
        const runButton = document.createElement("button");
        runButton.innerText = "Run";
        runButton.style.position = "absolute";
        runButton.style.top = "0";
        runButton.style.right = "0";
        runButton.style.zIndex = "1";
        runButton.style.padding = "5px 10px";
        runButton.style.backgroundColor = "#f9f9f9";
        runButton.style.color = "#ccc";
        runButton.style.border = "none";
        runButton.style.borderRadius = "3px";
        runButton.style.cursor = "pointer";

        // 添加点击事件
        runButton.addEventListener("click", () => {
          const code = block.querySelector("code").innerText;
          // 将代码编码为 URL 参数
          const encodedCode = encodeURIComponent(code);
          // 跳转到zxbjq文件夹下的index.html，传递代码作为参数
          window.location.href = `zxbjq/index.html?code=${encodedCode}`;
        });

        // 将按钮添加到代码块中
        block.style.position = "relative";
        block.appendChild(runButton);
      });
    });
  }
);
