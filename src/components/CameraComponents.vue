<script>
import Camera from "simple-vue-camera";
import { onMounted, ref } from "vue";

export default {
  components: {
    Camera,
  },
  setup() {
    const urlImage = ref("");
    const canvas = ref(null);
    const datas = ref("kiki");
    const camera = ref(Camera);
    onMounted(() => {
      console.log("ok");
    });
    const takePhoto = async () => {
      // 1. Ambil blob dari kamera
      const blobFile = await camera.value?.snapshot();
      if (!blobFile) return;

      // 2. Buat URL dari blob dan tampilkan di <img>
      urlImage.value = URL.createObjectURL(blobFile);

      // 3. Buat objek gambar dari blob
      const img = new Image();
      img.onload = () => {
        // 4. Siapkan canvas
        const ctx = canvas.value.getContext("2d");
        canvas.value.width = img.width;
        canvas.value.height = img.height;
        ctx.drawImage(img, 0, 0);

        // 5. (Opsional) Proses gambar: Grayscale + Kontras
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
          const threshold = gray > 127 ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = threshold;
        }

        ctx.putImageData(imageData, 0, 0);

        // 6. (Opsional) Update urlImage dengan hasil canvas
        urlImage.value = canvas.value.toDataURL("image/png");
      };
      img.src = urlImage.value;
    };

    return {
      camera,
      datas,
      takePhoto,
      urlImage,
      canvas
    };
  },
};
</script>
<template>
  <div>
    <h1 class="text-xs">Scan Document Here</h1>
    <div class="media-video mb-4">
      <Camera ref="camera" />
    </div>
    <div class="result-image mt-3">
      <canvas id="canvasId" ref="canvas"></canvas>
      <img
        alt="imgId"
        id="imgId"
        :src="urlImage ? urlImage : '../src/assets/27002.jpg'"
      />
    </div>
    <button @click="takePhoto">Camera</button>
  </div>
</template>
<style scoped></style>
