<template>
  <div>
    <h1>JSON Dosyasını Yükleyin</h1>

    <div
      class="dropzone"
      @dragover.prevent
      @drop="handleDrop"
      :class="{ dragging: isDragging }"
    >
      <p v-if="!jsonFile">
        JSON dosyasını buraya sürükleyin veya tıklayarak seçin.
      </p>
      <p v-else>{{ jsonFile.name }} dosyası seçildi.</p>
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="hidden"
        @change="handleFileSelect"
      />
      <button @click="triggerFileSelect">Dosya Seç</button>
    </div>

    <button v-if="jsonFile" @click="uploadFile">Yükle</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const jsonFile = ref(null) // Dosya verisini saklamak için
const isDragging = ref(false)

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false

  const file = event.dataTransfer.files[0]
  if (file && file.name.endsWith('.json')) {
    jsonFile.value = file
  } else {
    alert('Lütfen geçerli bir JSON dosyası yükleyin.')
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/json') {
    jsonFile.value = file
  } else {
    alert('Lütfen geçerli bir JSON dosyası yükleyin.')
  }
}

const triggerFileSelect = () => {
  const fileInput = $refs.fileInput
  fileInput.click()
}

const uploadFile = async () => {
  if (!jsonFile.value) return

  const formData = new FormData()
  formData.append('file', jsonFile.value) // Dosyayı formData'ya ekle

  try {
    const response = await fetch(
      'http://localhost:5000/api/charging-stations/upload',
      {
        method: 'POST',
        body: formData, // FormData'yı doğrudan gönderin, Content-Type otomatik ayarlanacak
      }
    )

    if (response.ok) {
      alert('Dosya başarıyla yüklendi!')
    } else {
      const errorMessage = await response.text()
      alert('Dosya yüklenirken bir hata oluştu: ' + errorMessage)
    }
  } catch (error) {
    alert('Sunucuya bağlanırken hata oluştu: ' + error.message)
  }
}
</script>

<style scoped>
.dropzone {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  transition: background-color 0.3s;
}

.dropzone.dragging {
  background-color: #f0f8ff;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

.hidden {
  display: none;
}
</style>
