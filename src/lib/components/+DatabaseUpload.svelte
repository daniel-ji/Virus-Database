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
      />
      <textarea
        class="form-control mt-3"
        placeholder="Sequence Description"
        id="database-upload-description"
      />
    </div>
    <div id="database-upload-right" class="ps-4">
      <input type="file" class="form-control" id="database-upload-file" />
      <textarea
        readonly
        class="form-control mt-3"
        placeholder="Uploaded file preview (read only)"
        id="database-upload-preview"
      />
    </div>
  </div>
  <button type="button" class="btn btn-primary mt-4">Upload Sequence</button>
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
