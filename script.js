let html5QrCode = null; // Global variable

function startCameraScan() {
  document.getElementById("cam-selection").style.display = "none";
  document.getElementById("upload-selection").style.display = "none";
  document.getElementById("stop-selection").style.display = "inline-block";

  const qrCamContainer = document.getElementById("qr-reader-cam");
  qrCamContainer.style.display = "block";
  document.getElementById("scanned-result-cam").style.display = "block";
  document.getElementById("error-msg-cam").style.display = "block";

  html5QrCode = new Html5Qrcode("qr-reader-cam");

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

              // Auto stop after successful scan
              stopCameraScan();
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

function stopCameraScan() {
  if (html5QrCode) {
    html5QrCode
      .stop()
      .then(() => {
        html5QrCode.clear();
        document.getElementById("qr-reader-cam").innerHTML = "";
        document.getElementById("stop-selection").style.display = "none";
        document.getElementById("cam-selection").style.display = "inline-block";
        document.getElementById("upload-selection").style.display =
          "inline-block";
      })
      .catch((err) => {
        document.getElementById("error-msg-cam").textContent =
          "Stop failed: " + err;
      });
  }
}

function triggerImageUpload() {
  document.getElementById("cam-selection").style.display = "none";
  document.getElementById("upload-selection").style.display = "none";
  document.getElementById("qr-reader-upd").style.display = "block";
  document.getElementById("qr-image-input").click(); // Automatically opens file dialog
}
document.addEventListener("DOMContentLoaded", () => {
  const qrInput = document.getElementById("qr-image-input");
  if (qrInput) {
    qrInput.addEventListener("change", async function () {
      const file = this.files[0];

      if (!file) {
        document.getElementById("error-msg-upd").textContent =
          "No file selected.";
        document.getElementById("error-msg-upd").style.display = "block";
        return;
      }

      const qrCodeScanner = new Html5Qrcode("qr-reader-upd");

      try {
        const decodedText = await qrCodeScanner.scanFile(file, true);
        document.getElementById("qr-result-upd").textContent = decodedText;
        document.getElementById("scanned-result-upd").style.display = "block";
        document.getElementById("error-msg-upd").style.display = "none";
      } catch (err) {
        document.getElementById("error-msg-upd").textContent =
          "Error scanning file: " + err;
        document.getElementById("error-msg-upd").style.display = "block";
        document.getElementById("scanned-result-upd").style.display = "none";
      }
    });
  }
});
