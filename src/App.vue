<template>
    <div class="app">
     <h1>fai-photo-preview</h1>
     <photo-preview ref="photoPreview">
      <div class="gallery">
        <div class="gallery-wrapper">
          <div class="photo-wrapper"
            v-for="(photo, index) in photos" 
            :key="index"
            >
            <img class="photo" :src="photo"/>
          </div>
        </div>
      </div>
     </photo-preview>
     <div>
       <button @click="addPhoto">添加图片</button>
     </div>
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
    }
  },
  methods: {
    addPhoto() {
      this.photos.push(`img/1.jpg`);
      this.$nextTick(() => {
        this.$refs.photoPreview.initViewer();
      })
    }
  },

}

</script>

