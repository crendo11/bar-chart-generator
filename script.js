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

  const barWidthPx = (orientation === "vertical" || orientation === "star" || orientation === "koren")
    ? pxPerCmX * barWidthCm
    : pxPerCmY * barWidthCm;

  const canvas = document.getElementById("barCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (orientation === "star") {
    drawStart(ctx, canvas.width, canvas.height, barWidthPx);
  } else if (orientation === "koren") {
    drawKorenChart(ctx, canvas.width, canvas.height);
  } else {
    const totalLength = (orientation === "vertical") ? canvas.width : canvas.height;
    for (let i = 0; i < totalLength / barWidthPx; i++) {
      ctx.fillStyle = i % 2 === 0 ? "black" : "white";
      if (orientation === "vertical") {
        ctx.fillRect(i * barWidthPx, 0, barWidthPx, canvas.height);
      } else {
        ctx.fillRect(0, i * barWidthPx, canvas.width, barWidthPx);
      }
    }
  }

  // Fullscreen
  canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.() || canvas.mozRequestFullScreen?.() || canvas.msRequestFullscreen?.();
});

function drawStart(ctx, width, height, segmentSize) {
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.sqrt(cx * cx + cy * cy);

  const rings = Math.floor(maxRadius / segmentSize);
  const segmentsPerRing = 12;

  for (let ring = 0; ring < rings; ring++) {
    const radius = ring * segmentSize;
    const nextRadius = radius + segmentSize;
    const segments = segmentsPerRing + ring * 2;

    for (let i = 0; i < segments; i++) {
      const angleStart = (i / segments) * 2 * Math.PI;
      const angleEnd = ((i + 1) / segments) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, nextRadius, angleStart, angleEnd, false);
      ctx.closePath();
      ctx.fillStyle = (i + ring) % 2 === 0 ? "black" : "white";
      ctx.fill();
    }
  }
}

function drawKorenChart(ctx, width, height) {
  const bandHeight = height / 6;

  for (let band = 0; band < 6; band++) {
    const yStart = band * bandHeight;

    if (band === 0 || band === 3) {
      drawSineBand(ctx, yStart, bandHeight, width, 1.0); // full contrast sine
    } else if (band === 1) {
      drawSineBand(ctx, yStart, bandHeight, width, 0.5); // 50% contrast sine
    } else if (band === 2 || band === 5) {
      drawBarBand(ctx, yStart, bandHeight, width);
    } else if (band === 4) {
      drawSineBand(ctx, yStart, bandHeight, width, 0.1); // 10% contrast sine
    }
  }
}

function drawSineBand(ctx, y, height, width, contrast) {
  const imageData = ctx.createImageData(width, height);
  for (let x = 0; x < width; x++) {
    const freq = 2 + (x / width) * 198; // from 2 to 200 lp/mm
    const value = Math.sin(x * freq * 2 * Math.PI / width);
    const gray = Math.round(127 + contrast * value * 127);

    for (let yOffset = 0; yOffset < height; yOffset++) {
      const index = (yOffset * width + x) * 4;
      imageData.data[index] = gray;
      imageData.data[index + 1] = gray;
      imageData.data[index + 2] = gray;
      imageData.data[index + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, y);
}

function drawBarBand(ctx, y, height, width) {
  for (let x = 0; x < width; x++) {
    const freq = 2 + (x / width) * 198;
    const isBlack = Math.floor(x * freq * 2 / width) % 2 === 0;
    ctx.fillStyle = isBlack ? 'black' : 'white';
    ctx.fillRect(x, y, 1, height);
  }
}
