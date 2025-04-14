document.getElementById("barForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const screenWidthCm = parseFloat(document.getElementById("screenWidth").value);
    const screenHeightCm = parseFloat(document.getElementById("screenHeight").value);
    const barWidthCm = parseFloat(document.getElementById("barWidth").value);
    const orientation = document.getElementById("orientation").value;
  
    const screenWidthPx = window.screen.width;
    const screenHeightPx = window.screen.height;
  
    const pxPerCmX = screenWidthPx / screenWidthCm;
    const pxPerCmY = screenHeightPx / screenHeightCm;
  
    const barWidthPx = orientation === "vertical" ? pxPerCmX * barWidthCm : pxPerCmY * barWidthCm;
  
    const canvas = document.getElementById("barCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const totalLength = orientation === "vertical" ? canvas.width : canvas.height;
  
    for (let i = 0; i < totalLength / barWidthPx; i++) {
      ctx.fillStyle = i % 2 === 0 ? "black" : "white";
      if (orientation === "vertical") {
        ctx.fillRect(i * barWidthPx, 0, barWidthPx, canvas.height);
      } else {
        ctx.fillRect(0, i * barWidthPx, canvas.width, barWidthPx);
      }
    }
  
    // Fullscreen
    canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.() || canvas.mozRequestFullScreen?.() || canvas.msRequestFullscreen?.();
  });
  