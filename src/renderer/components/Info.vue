<template>
	<div style="position: absolute; left: 20px; right: 50px;">
		<button v-if="!toggleInfo" @click="toggleInfo = true" class="button button-play round-btn black small-btn"> Show info </button>
		<button v-else @click="toggleInfo = false" class="button button-play round-btn small-btn" style="border: 2px solid #df706d; color: red;"> Close Info </button>
		<div v-if="toggleInfo"
		     style="width: 30%; height: 25%; background-color: white; border-radius: 10px; padding: 20px;">
			Storage path:
			{{storagePath}}<br><br>
			Version: 1.0.23
		</div>
	</div>
</template>

<script>
	export default {
		name: "Info",
	    data() {
	        return {
	        	toggleInfo: false,
	        }
	    }
	}
</script>

<style scoped> </style>
