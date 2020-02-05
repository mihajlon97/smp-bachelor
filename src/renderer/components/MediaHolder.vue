<template>
	<div id="wrapper">
		<div id="media1" class="media">
			<div class="wrapper">
				<div v-if="image1" class="move" :style="`background-size: contain; background-image: url('${get_blob(image1.path)};`"></div>
				<h1 v-else class="chooseText" @click="choose(1)"> Choose Media </h1>
			</div>
		</div>

		<div id="media2" class="media " style="left: 50%;">
			<div class="wrapper">
				<div v-if="image2" class="move" :style="`background-size: contain; background-image: url('${get_blob((image2.path))};`"></div>
				<h1 v-else class="chooseText" @click="choose(2)"> Choose Media </h1>
			</div>
		</div>
	</div>
</template>

<script>
	const { dialog } = require('electron').remote;
	import Moveable from 'vue-moveable';
	export default {
		name: "MediaHolder",
		components: {
			Moveable,
		},
	    data() {
			return {
				moveable: {
				    target: document.querySelector("#media1"),
					draggable: true,
					throttleDrag: 1,
					resizable: false,
					throttleResize: 1,
					keepRatio: false,
					scalable: true,
					throttleScale: 0.01,
					rotatable: true,
					throttleRotate: 0.2,
					pinchable: true,
					origin: false
				},
				image1: null,
				image2: null,
				h: 50,
			    slides: [],
			    elem: null,
			    div: null,
			    x: [0,0],
			    y: [0,0],
			    mousedown: [false, false],
			}
	    },
	    mounted() {
	        console.log('Mounted');

	        this.init()

	    },
	    methods: {
			init() {
				this.elem = document.querySelector('.wrapper');
				this.elems = [...document.querySelectorAll('.wrapper')];

				this.div = document.querySelector('.move');
			    this.divs = [...document.querySelectorAll('.move')];

			    console.log(this.elems);
			    for(let index = 0; this.elems.length; index++) {
			    // this.elems.forEach((div, index) => {
					let div = this.elems[index];
					console.log('DIV', div);
					if (this.divs.length === 0 || !div) return;

					if (this.divs[index]) {
						// div event mousedown
						this.divs[index].addEventListener('mousedown', (e) => {
							// mouse state set to true
							this.mousedown[index] = true;
							// subtract offset
							this.x[index] = this.divs[index].offsetLeft - e.clientX;
							this.y[index] = this.divs[index].offsetTop - e.clientY;
						}, true);

						// div event mouseup
						this.divs[index].addEventListener('mouseup', (e) => {
							// mouse state set to false
							this.mousedown[index] = false;
							console.log("X: " + this.x[index], "Y: " + this.y[index]);
						}, true);
					}

					// element mousemove to stop
					div.addEventListener('mousemove', (e) => {
						// Is mouse pressed
						if (this.mousedown[index]) {
							// Now we calculate the difference upwards
							// this.div.style.left = e.clientX + this.x + 'px';
						    this.divs[index].style.left = (((e.clientX + this.x[index]) * 100) / this.divs[index].offsetWidth) + '%';  //; e.clientX + this.x + 'px';
							// this.div.style.top = e.clientY + this.y + 'px';
							this.divs[index].style.top = (((e.clientY + this.y[index]) * 100) / this.divs[index].offsetHeight) + '%';
						}
					}, true);
			    }
			},
			choose(number) {
				let self = this;
				console.log("Choose image " + number);
				dialog.showOpenDialog({
					properties: ['openFile'],
					filters: [
						{ name: 'Images', extensions: ['jpg', 'png', 'gif'] },
					]
				}, function (files) {
					if (files) {
						self['image' + number] = {
							path: files[0]
						};
						setTimeout(() => {
						  self.init();
						}, 2000);

					}
				});
			},



		    handleDrag({ target, left, top }) {
			    console.log('onDrag left, top', left, top);
			    target.style.left = `${left}px`;
			    target.style.top = `${top}px`;
		    },
		    handleResize({ target, width, height, delta }) {
			    console.log('onResize', width, height);
			    delta[0] && (target.style.width = `${width}px`);
			    delta[1] && (target.style.height = `${height}px`);
		    },
		    handleScale({ target, transform, scale }) {
			    console.log('onScale scale', scale);
			    target.style.transform = transform;
		    },
		    handleRotate({ target, dist, transform }) {
			    console.log('onRotate', dist);
			    target.style.transform = transform;
		    },
		    handleWarp({ target, transform }) {
			    console.log('onWarp', target);
			    target.style.transform = transform;
		    },
	    }
	}

</script>

<style>
	#wrapper{
		width: 100%;
		height: 100%;
		background-color: black;
	}

	.media {
		margin: 0;
		position: absolute;
		width: 50%;
		height: 100%;
		color: white;
	}
	.chooseText {
		position: absolute;
		top: 45%;
		left: 40%;
		cursor: pointer;
	}
	.moveable {
		height: 100%;
	}


	.wrapper {
		overflow: hidden;
		display: block;
		width: 100%;
		height: 100%;
		position: relative;
	}

	.move img {
		cursor: pointer;
		position: absolute;
	}
	.move:hover {
		cursor: pointer;
	}
	.move:active {
		cursor: move;
	}
	.move {
		z-index: 10;
	   position: absolute;
	   width: 100%;
	   height: 100%;
	   left: 0;
	   top: 0;
		background: black no-repeat center;
	}
</style>
