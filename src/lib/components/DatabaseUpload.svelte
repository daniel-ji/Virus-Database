<script lang="ts">
import { DESCRIP_LIMIT, FILE_SIZE_LIMIT, IS_TEXT_FILE, NAME_LIMIT } from "$lib/utils/constants";

let sequenceName: string = "";
let sequenceDescription: string = "";
let sequenceFiles: FileList | null = null;
let sequenceInput: HTMLInputElement; // used to clear input field
let sequenceFilePreview: string = "";

/**
 * Uploads given sequence to the database. Clears input fields after upload.
 */
let uploadSequence = async () => {
  if (!sequenceFiles) {
    alert("Please select a file to upload");
    return;
  }

  if (sequenceName.length === 0 || sequenceName.length > NAME_LIMIT) {
    alert("Name must be between 1 and " + NAME_LIMIT + " characters.");
    return;
  }

  if (sequenceDescription.length > DESCRIP_LIMIT) {
    alert("Description must be less than " + DESCRIP_LIMIT + " characters.");
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
    alert("Could not upload.");
    return;
  }

  alert("Sequence uploaded successfully");
  sequenceName = "";
  sequenceDescription = "";
  sequenceFiles = null;
  sequenceInput.value = "";
  sequenceFilePreview = "";
};

/**
 * Reactive declaration that previews the uploaded file.
 */
// QUESTION: handle multiple files?
$: if (sequenceFiles) {
  previewSequenceFile();
}

const previewSequenceFile = () => {
  if (!sequenceFiles) {
    return;
  }

  if (sequenceFiles.length === 0) {
    sequenceFilePreview = "";
    sequenceFiles = null;
    sequenceInput.value = "";
    return;
  }

  if (sequenceFiles.length !== 1) {
    alert("Please select only one file");
    sequenceFiles = null;
    sequenceInput.value = "";
    return;
  }

  if (sequenceFiles[0].size > FILE_SIZE_LIMIT) {
    alert(
      `File size limit is ${
        Math.round((FILE_SIZE_LIMIT / 1024 / 1024) * 100) / 100
      } MB. Current file size is ${
        Math.round((sequenceFiles[0].size / 1024 / 1024) * 100) / 100
      } MB.`,
    );
    sequenceFiles = null;
    sequenceInput.value = "";
    return;
  }

  // Autofill sequence name if empty
  if (sequenceName === "") {
    sequenceName = sequenceFiles[0].name;
  }

  if (IS_TEXT_FILE(sequenceFiles[0])) {
    const reader = new FileReader();
    reader.onload = () => {
      sequenceFilePreview = reader.result as string;
    };
    // read first 100kb of file for preview
    reader.readAsText(sequenceFiles[0].slice(0, 1024 * 100));
  } else {
    sequenceFilePreview = "File preview not available (not plaintext)";
  }
};
</script>

<div id="database-upload" class="d-flex flex-column align-items-start">
  <h2 class="mb-3">Database Upload</h2>
  <div id="database-upload-form" class="d-flex flex-row justify-content-between w-100">
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
        bind:this={sequenceInput}
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
  <button type="button" class="btn btn-primary mt-4" on:click={uploadSequence}>
    Upload Sequence
  </button>
</div>

<style>
#database-upload {
  width: 85%;
}

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
