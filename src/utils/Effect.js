export const enchancedContras = (data) => {
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
    const threshold = gray > 127 ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = threshold;
  }
  return data;
};
export const NaturalEnchancedContras = (data) => {
  const contrast = 40; // kisaran: 0–100
  const brightness = 10; // kisaran: -255–255
  const saturation = 1.2; // >1 = lebih jenuh

  // Hitung faktor kontras
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    // Ambil R G B
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Tingkatkan kontras
    r = factor * (r - 128) + 128;
    g = factor * (g - 128) + 128;
    b = factor * (b - 128) + 128;

    // 2. Tambahkan brightness
    r += brightness;
    g += brightness;
    b += brightness;

    // 3. (Opsional) Boost saturation
    const avg = (r + g + b) / 3;
    r += (r - avg) * (saturation - 1);
    g += (g - avg) * (saturation - 1);
    b += (b - avg) * (saturation - 1);

    // Clamp nilai
    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
    // Alpha (data[i + 3]) tetap
  }

  return data;
};
