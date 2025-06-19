<script>
import Camera from "simple-vue-camera";
import { onMounted, ref } from "vue";
import jsPDF from "jspdf";
import { NaturalEnchancedContras } from "../utils/Effect";
export default {
  components: {
    Camera,
  },
  setup() {
    const urlImage = ref("");
    const canvas = ref(null);
    const datas = ref("kiki");
    const camera = ref(Camera);

    const takePhoto = async () => {
      // 1. Ambil blob dari kamera
      const blobFile = await camera.value?.snapshot();
      if (!blobFile) return;

      // 2. Buat URL dari blob dan tampilkan di <img>
      urlImage.value = URL.createObjectURL(blobFile);

      // 3. Buat objek gambar dari blob
      const img = new Image();
      img.sizes = "auto";
      img.onload = () => {
        // size a4
        const A4_WIDTH = 1080;
        const A4_HEIGHT = 810;
        // 4. Siapkan canvas
        const ctx = canvas.value.getContext("2d");
        canvas.value.width = A4_WIDTH;
        canvas.value.height = A4_HEIGHT;
        ctx.drawImage(img, 0, 0, A4_WIDTH, A4_HEIGHT);


        // 5. (Opsional) Proses gambar: Grayscale + Kontras
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        // enchancedContras(data)
        NaturalEnchancedContras(data);
        ctx.putImageData(imageData, 0, 0);

        // 6. (Opsional) Update urlImage dengan hasil canvas
        urlImage.value = canvas.value.toDataURL("image/png");
      };
      img.src = urlImage.value;
    };

    const downloadPDF = () => {
      if (!urlImage.value) return alert("Please take a photo first");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.value.width, canvas.value.height],
      });
      doc.addImage(
        urlImage.value,
        "PNG",
        0,
        0,
        canvas.value.width,
        canvas.value.height
      );
      let nameFile = new Date().getTime() + ".pdf";
      doc.save(nameFile);
    };
    return {
      downloadPDF,
      camera,
      datas,
      takePhoto,
      urlImage,
      canvas,
    };
  },
};
</script>
<template>
  <div class="bg-slate-800 p-3 rounded-3xl flex flex-col justify-center">
    <div class="media-video mb-4">
      <Camera ref="camera" />
    </div>
    <div class="result-image mt-3">
      <canvas id="canvasId" ref="canvas" style="display: none"></canvas>
      <img
        alt="imgId"
        id="imgId"
        :src="urlImage ? urlImage : '../src/assets/27002.jpg'"
      />
      <div class="flex flex-row gap-3">
        <button @click="takePhoto" class="btn mt-3">Take Document</button>
        <button @click="downloadPDF" class="btn btn-error mt-3">
          Download PDF
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
