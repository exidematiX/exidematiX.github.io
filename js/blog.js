src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"

//解析md文件
fetch("../src/post/interviewExperience.md")
  .then(res => res.text())
  .then(md => {
    const html = marked.parse(md);
    document.getElementById("content").innerHTML = html;
  });