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
let pracmode = 0

let buf = []
restart()

let lock = false

window.addEventListener("keydown", (event) => {
	if (event.repeat) return
	while (lock) {} // funny thing is this can still race probably
	lock = true
	handleKeypress(event.code)
	lock = false
})

function handleKeypress(code) {
	if (code == "KeyR") {
		restart()
	} else {
		let i = keys.indexOf(code)
		if (i != -1) {
			buttons[i] = !buttons[i]
			tick()
		}
	}
}

document.getElementById("reset").onclick = (event) => {
	restart()
}

document.getElementById("default").onclick = (event) => {
	pracmode=0
	restart()
}

document.getElementById("left").onclick = (event) => {
	pracmode=1
	restart()
}

document.getElementById("right").onclick = (event) => {
	pracmode=2
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
		elem.innerText = "Score " + score + " in " + ((Date.now() - starttime)/1000).toFixed(2) + "s"
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
	if (pracmode == 1) {
		return (Math.floor(Math.random() * 15)+1) * 16
	} else if (pracmode == 2) {
		return Math.floor(Math.random() * 15)+1
	} else {
		return Math.floor(Math.random() * 255)+1
	}
}

function getHex(val) {
	return (val < 16 ? "0" : "") + val.toString(16).toUpperCase()
}

setInterval(() => {
	input.innerText = buttons.map(a => a ? "O" : "_").join(" ")
	timeelem.innerText = "Time: " + ((Date.now() - starttime)/1000).toFixed(2)
}, 10)

