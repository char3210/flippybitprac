"use strict";

let buttons = [false,false,false,false,false,false,false,false]

const keys = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK"]

const input = document.getElementById("input")
const numbers = document.getElementById("numbers")
const scoreelem = document.getElementById("score")
const timeelem = document.getElementById("time")
const trialselem = document.getElementById("trials")

let score = 0
let starttime = Date.now()

let buf = []
restart()

let lock = false

window.addEventListener("keydown", (event) => {
	if (event.repeat) return
	while (lock) {}
	lock = true
	if (event.code == "KeyR") {
		restart()
		return
	}
	let i = keys.indexOf(event.code)
	if (i == -1) return
	buttons[i] = !buttons[i]
	tick()
	lock = false
})

document.getElementById("reset").onclick = (event) => {
	restart()
}

function restart() {
	starttime = Date.now()
	score = 0
	buf = []
	buf.push(getRandomInt())
	buf.push(getRandomInt())
	buf.push(getRandomInt())
	for (let i = 0; i < 8; i++) {
		buttons[i] = false
	}
	updateScore()
	updateBuf()
	trialselem.replaceChildren()
}

function tick() {
	if (getInputNum() == buf[buf.length-1]) {
		for (let i = 0; i < 8; i++) {
			buttons[i] = false
		}
		score++
		buf.pop()
		buf.splice(0, 0, getRandomInt())
		updateBuf()
		updateScore()
	}

	input.innerText = buttons.map(a => a ? "O" : "_").join(" ")
}

function updateBuf() {
	const list = buf.map(num => {
		const elem = document.createElement("h2")
		elem.innerText = getHex(num)
		return elem
	})
	numbers.replaceChildren(...list)
}

function updateScore() {
	scoreelem.innerText = "Score: " + score
	if (score != 0 && score % 50 == 0) {
		const elem = document.createElement("p")
		elem.innerText = "Score " + score + " in " + ((Date.now() - starttime)/1000).toFixed(1) + "s"
		trialselem.insertBefore(elem, trialselem.firstChild)
	}
}

function getInputNum() {
	let res = 0
	for (let i = 0; i < 8; i++) {
		res <<= 1
		if (buttons[i]) res++
	}
	return res
}

function getRandomInt() {
	return Math.floor(Math.random() * 15)+1
	let yea = [10,11,12]
	return yea[Math.floor(Math.random()*yea.length)]
}

function getHex(val) {
	const chars = "0123456789ABCDEF"
	return ""+chars.charAt(val)
}

setInterval(() => {
	input.innerText = buttons.map(a => a ? "O" : "_").join(" ")
	timeelem.innerText = "Time: " + ((Date.now() - starttime)/1000).toFixed(1)
}, 10)

