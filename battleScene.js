const battleBackgroundImage = new Image()
battleBackgroundImage.src = 'assets/Images/battleBackground.png'
const battleBackground = new Sprite({
	position:{
		x: 0,
		y: 0
	},
	image:battleBackgroundImage
})


let draggle
let emby
let renderedSprites
let battleAnimationId
let queue = []

function initBattle() {
	document.querySelector('#UI').style.display = 'block'
	document.querySelector('#UI1').style.display = 'block'
	// document.querySelector('#img1').style.display = 'none'
	// document.querySelector('#img2').style.display = 'none'
	document.querySelector('#dialogBox').style.display = 'none'
	document.querySelector('#healthbarEnemy').style.width = '100%'
	document.querySelector('#healthbarPlayer').style.width = '100%'
	document.querySelector('#attackContainer').replaceChildren()

	draggle = new Monster(monsters.Draggle)
	emby = new Monster(monsters.Emby)
	renderedSprites = [draggle, emby]
	queue = []

	emby.attacks.forEach((attack) => {
		const button = document.createElement('button')
		button.innerHTML = attack.name
		document.querySelector('#attackContainer').append(button)
	})

	document.querySelectorAll('button').forEach(button => {
		button.addEventListener('click', (e) => {
			const selectedAttack = attacks[e.currentTarget.innerHTML]
			emby.attack({ 
				attack: selectedAttack,
				recipient: draggle,
				renderedSprites
			})

			if(draggle.health <= 0) {
				queue.push(() => {
					draggle.faint()
				})
				queue.push(() => {
					gsap.to('#transition', {
						opacity: 1,
						onComplete: () => {
							cancelAnimationFrame(battleAnimationId)
							animate()
							document.querySelector('#UI').style.display = 'none'
							gsap.to('#transition', {
								opacity: 0
							})
							battle.initated = false
							audio.Map.play()
						}
					})
				})
			}

			const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

			queue.push(() => {
				draggle.attack({ 
					attack: randomAttack,
					recipient: emby,
					renderedSprites
				})

				if(emby.health <= 0) {
					queue.push(() => {
						emby.faint()
					})
					queue.push(() => {
						gsap.to('#transition', {
							opacity: 1,
							onComplete: () => {
								cancelAnimationFrame(battleAnimationId)
								animate()
								document.querySelector('#UI').style.display = 'none'
								gsap.to('#transition', {
									opacity: 0
								})
								battle.initated = false
								audio.Map.play()
							}
						})
					})
				}
			})
		})
		button.addEventListener('mouseenter', (e) => {
				const selectedAttack = attacks[e.currentTarget.innerHTML]
				document.querySelector('#menu').innerHTML = selectedAttack.type
				document.querySelector('#menu').style.backgroundColor = selectedAttack.color
		})
	})
}

function animateBattle() {
	battleAnimationId = window.requestAnimationFrame(animateBattle)
	battleBackground.draw()
	renderedSprites.forEach(sprite => {
		sprite.draw()
	})
}

animate()

document.querySelector('#dialogBox').addEventListener('click', (e) => {
	if(queue.length > 0){
		queue[0]()
		queue.shift()
	}else {
		e.currentTarget.style.display = 'none'
	}
	
})