document.addEventListener("DOMContentLoaded", () => {

	const blocks = document.querySelectorAll(".introblock")
	const contents = document.querySelectorAll(".intro-content")

	blocks.forEach(block => {
		block.addEventListener("click", (e) => {
			const target = block.dataset.target
			// 右侧内容切换
			contents.forEach(c => c.classList.remove("active"))
			document.getElementById(target).classList.add("active")
			// 左侧按钮高亮
			blocks.forEach(b => b.classList.remove("active"))
			block.classList.add("active")
		})
	})
})