<template>
    <div class="app">
     <h1>fai-photo-preview</h1>
     <div class="gallery">
       <div class="gallery-wrapper">
         <div class="photo-wrapper"
          v-for="(photo, index) in photos" 
          :key="index"
          @click="() => previewOpen(index)">
           <img class="photo" :src="photo"/>
         </div>
       </div>
     </div>
     <photo-preview 
     ></photo-preview>
    </div>
</template>


<script>
import Viewer from './components/vue-viewer';

export default {
  components: {
    'photo-preview': Viewer,
  },
  data() {
    const srcs = (() => {
      const result = []
      for(let i = 1; i < 10; i++){
        result.push(`img/${i}.jpg`); 
      }
      return result;
    })();
    const photos = srcs;
    const slides = srcs.map(_ => ({ src: _ }))
    return {
      photos,
      isPreviewOpen: false,
      slides,
    }
  },
  methods: {
    onNextPhoto() {
      
    },
    onPrevPhoto() {

    },
    previewOpen(index) {
      this.isPreviewOpen = true;
      const photoPreview = this.$refs.photoPreview;
      photoPreview.goto(index)
    },
    onClose() {
      this.isPreviewOpen = false;
    }
  },
}

</script>

