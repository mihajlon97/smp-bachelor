export default {
	computed: {

	},
	methods: {
		selectTheScreenAlert(external) {
			return this.$swal({
				title: "Select the screen",
				text: "Pick a screen on which the presentation should be played.",
				icon: "info",
				buttons: {
					...external,
					main: {
						text: "Main screen",
						value: "main"
					}
				},
			});
		},
		namePresentationAlert() {
			return this.$swal({
				title: "Name your presentation",
				content: "input",
				showCancelButton: true,
				buttons: ["Cancel", "Create"]
			});
		},
		presentationNotRemovedAlert() {
			return this.$swal({
				title: "Error",
				text: "Presentation was not removed due to error.",
				icon: "warning",
			});
		},
		deletePresentationAlert() {
			return this.$swal({
				title: "Are you sure?",
				text:"Presentation will be permanently removed.",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			})
		},
		newPresentationAlert() {
			return this.$swal({
				title: "New Presentation",
				text: "Create a new presentation manually or import existing one.",
				buttons: {
					cancel: "Cancel",
					import:{
						text: "Import existing",
						value: "import",
					},
					create: {
						text: "Create new",
						value: "create"
					}
				},
			});
		}
	}
};
