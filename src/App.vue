<template>
    <div class="app">
      <h1>fai-photo-preview(vanila)</h1>
      <viewer ref="viewer">
        <div class="gallery" ref="gallery">
          <div class="gallery-wrapper">
            <div class="photo-wrapper"
              v-for="(photo, index) in photos" 
              :key="index"
              >
              <img class="photo" :src="photo"/>
            </div>
          </div>
        </div>
      </viewer>
     <div>
       <button @click="addPhoto">添加图片</button>
     </div>
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
import Viewer from './components/photo-preview';
import v from './components/photo-preview(vanila)';
import ViewerWrapper from './components/photo-preview(vanila)/ViewerWrapper';

export default {
  components: {
    'photo-preview': Viewer,
    'viewer': ViewerWrapper,
  },
  data() {
    const srcs = (() => {
      const result = []
      for(let i = 1; i < 10; i++){
        result.push(`img/${i}.${i == 6 || i == 9? 'png': 'jpg'}`); 
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
        this.$refs.viewer.forceInitViewer();
      })
      
    }
  },

}

</script>

