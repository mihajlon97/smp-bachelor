<template>
	<div style="position: absolute; width: 100%; color: white; text-align: center; z-index: 11; padding-top: 10px;">
		<button @click="showLayout = !showLayout"
		        class="button button-play filter-button black round-btn">
			Layout <i style="margin-top: 10px;">▼</i>
		</button>
		<transition name="fade">
			<table id="layoutTable" v-if="showLayout">
				<tr>
					<td :class="{'selectedLayout': hoverLayout[0] >= 1 && hoverLayout[1] >= 1 }"
					    @mouseover="hoverLayout = [1,1]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(1,1)">1x1</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 1 && hoverLayout[1] >= 2 }"
					    @mouseover="hoverLayout = [1,2]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(1,2)">1x2</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 1 && hoverLayout[1] >= 3 }"
					    @mouseover="hoverLayout = [1,3]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(1,3)">1x3</td>
				</tr>
				<tr>
					<td :class="{'selectedLayout': hoverLayout[0] >= 2 && hoverLayout[1] >= 1 }"
					    @mouseover="hoverLayout = [2,1]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(2,1)">2x1</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 2 && hoverLayout[1] >= 2 }"
					    @mouseover="hoverLayout = [2,2]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(2,2)">2x2</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 2 && hoverLayout[1] >= 3 }"
					    @mouseover="hoverLayout = [2,3]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(2,3)">2x3</td>
				</tr>
				<tr>
					<td :class="{'selectedLayout': hoverLayout[0] >= 3 && hoverLayout[1] >= 1 }"
					    @mouseover="hoverLayout = [3,1]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(3,1)">3x1</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 3 && hoverLayout[1] >= 2 }"
					    @mouseover="hoverLayout = [3,2]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(3,2)">3x2</td>
					<td :class="{'selectedLayout': hoverLayout[0] >= 3 && hoverLayout[1] >= 3 }"
					    @mouseover="hoverLayout = [3,3]" @mouseleave="hoverLayout = [0,0]"
					    @click="changeLayout(3,3)">3x3</td>
				</tr>
			</table>
		</transition>
	</div>
</template>

<script>
	export default {
		name: "LayoutPicker",
		data() {
			return {
			    hoverLayout: [1, 2],
			    showLayout: false,
			}
		},
	    methods: {
		    changeLayout(rows, columns) {
		        this.$emit('changeLayout', { rows, columns })
		    }
	    }
	}
</script>

<style scoped>

</style>
