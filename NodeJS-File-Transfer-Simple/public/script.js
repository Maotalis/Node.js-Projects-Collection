document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    formData.append('file', fileInput.files[0]);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      loadFileList();
    })
    .catch(error => {
      alert('Error uploading file');
      console.error(error);
    });
});

  function loadFileList() {
    fetch('/uploaded-files')
      .then(response => response.json())
      .then(files => {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        files.forEach(file => {
          const li = document.createElement('li');
          li.innerHTML = `
            <a href="/download/${file.filename}" target="_blank">${file.filename}</a>
            <button class="btn download-btn" onclick="downloadFile('${file.filename}')">Download</button>
            `;
          fileList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error fetching file list:', error);
    });
}


function downloadFile(filename) {
    window.location.href = `/download/${filename}`;
}

document.getElementById('fileInput').addEventListener('change', function (e) {
    const fileName = e.target.files[0].name;
    document.querySelector('.upload-area p').textContent = `Selected: ${fileName}`;
});

loadFileList();