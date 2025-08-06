function startCameraScan() {
  document.getElementById("cam-selection").style.display = "none";
  document.getElementById("upload-selection").style.display = "none";

  const qrCamContainer = document.getElementById("qr-reader-cam");
  qrCamContainer.style.display = "block";
  document.getElementById("scanned-result-cam").style.display = "block";
  document.getElementById("error-msg-cam").style.display = "block";

  const html5QrCode = new Html5Qrcode("qr-reader-cam");

  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        html5QrCode
          .start(
            cameraId,
            {
              fps: 10,
              qrbox: 250,
            },
            (decodedText) => {
              document.getElementById("qr-result-cam").textContent =
                decodedText;
              html5QrCode.stop().then(() => {
                qrCamContainer.innerHTML = "";
              });
            },
            (error) => {
              document.getElementById("error-msg-cam").textContent =
                "Error: " + error;
            }
          )
          .catch((err) => {
            document.getElementById("error-msg-cam").textContent =
              "Camera start failed: " + err;
          });
      } else {
        document.getElementById("error-msg-cam").textContent =
          "No camera found.";
      }
    })
    .catch((err) => {
      document.getElementById("error-msg-cam").textContent =
        "Error getting cameras: " + err;
    });
}

function triggerImageUpload() {
  document.getElementById("upload-selection").style.display = "none";
  document.getElementById("cam-selection").style.display = "none";

  const imageInput = document.getElementById("qr-image-input");
  document.getElementById("qr-reader-upd").style.display = "block";
  document.getElementById("error-msg-upd").style.display = "block";
  document.getElementById("scanned-result-upd").style.display = "block";

  const qrScanner = new Html5Qrcode("qr-reader-upd");

  imageInput.addEventListener("change", () => {
    if (imageInput.files.length === 0) return;

    const file = imageInput.files[0];

    qrScanner
      .scanFile(file, true)
      .then((decodedText) => {
        document.getElementById("qr-result-upd").textContent = decodedText;
      })
      .catch((err) => {
        document.getElementById("error-msg-upd").textContent =
          "Image scan failed: " + err;
      });
  });

  imageInput.click();
}
