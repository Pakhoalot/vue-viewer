<template>
    <div class="app">
      <h1>fai-photo-preview(vanila)</h1>
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
  mounted() {
    this._viewer = v.createViewer({ element: this.$refs.gallery, container: document.body });
  },
  methods: {
    addPhoto() {
      this.photos.push(`img/1.jpg`);
      this.$nextTick(() => {
        this.$refs.photoPreview.initViewer();
      })
      v.initViewerAsync(this._viewer.id)
        .then((res) => this._viewer = res);
    }
  },

}

</script>

