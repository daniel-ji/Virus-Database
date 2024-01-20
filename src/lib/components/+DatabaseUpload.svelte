<script lang="ts">
  let sequenceName: string = "";
  let sequenceDescription: string = "";
  let sequenceFiles: FileList | null = null;
  let sequenceFilePreview: string = "";

	let uploadSequence = async () => {
		if (!sequenceFiles) {
			alert("Please select a file to upload");
			return;
		}

		const formData = new FormData();
		formData.append("name", sequenceName);
		formData.append("description", sequenceDescription);
		formData.append("sequenceFile", sequenceFiles[0]);

		const uploadResponse = await fetch("/api/sequences", {
			method: "POST",
			body: formData,
		});

		if (!uploadResponse.ok) {
			return;
		}

		sequenceName = "";
		sequenceDescription = "";
		sequenceFiles = null;
		sequenceFilePreview = "";
	};

	// TODO: only load preview if file is text
	// TODO: add preview for multiple files
	// TODO: limit file count && size
	// TODO: limit file preview size
	// $: if (sequenceFiles) {
	// 	const reader = new FileReader();
	// 	reader.onload = () => {
	// 		sequenceFilePreview = reader.result as string;
	// 	};
	// 	reader.readAsText(sequenceFiles[0]);
	// }
</script>

<div id="database-upload" class="w-75 d-flex flex-column align-items-start">
  <h2 class="mb-3">Database Upload</h2>
  <div
    id="database-upload-form"
    class="d-flex flex-row justify-content-between w-100"
  >
    <div id="database-upload-left" class="pe-4">
      <input
        type="text"
        class="form-control w-100"
        placeholder="Sequence Name"
        bind:value={sequenceName}
      />
      <textarea
        class="form-control mt-3"
        placeholder="Sequence Description"
        id="database-upload-description"
        bind:value={sequenceDescription}
      />
    </div>
    <div id="database-upload-right" class="ps-4">
      <input
        type="file"
        class="form-control"
        id="database-upload-file"
        bind:files={sequenceFiles}
      />
      <textarea
        class="form-control mt-3"
        placeholder="Uploaded file preview (read only)"
        id="database-upload-preview"
        readonly
        bind:value={sequenceFilePreview}
      />
    </div>
  </div>
  <button type="button" class="btn btn-primary mt-4" on:click={uploadSequence}>Upload Sequence</button>
</div>

<style>
  #database-upload-left {
    width: 35%;
  }

  #database-upload-right {
    width: 65%;
  }

  #database-upload textarea {
    min-height: max(200px, 30vh);
    max-height: min(400px, 60vh);
    vertical-align: top;
  }

  #database-upload-preview {
    opacity: 0.8;
  }
</style>
