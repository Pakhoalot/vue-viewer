<template>
  <div>
    <div class="jz-photos-wrapper" ref="photosWrapper">
      <slot></slot>
      <!-- <photos
        @photo-click="photoClick"
        >
      </photos> -->
    </div>
    <div class="jz-photo-preview">
      <div :class="extraClass">
        <div class="mask"></div>
        <div ref="viewerContainer"></div>
        <div class="panel-container">
          <div class="right-top-bar">
            <div class="right-top button-group">
              <div class="button-wrapper">
                <div class="button close-button" @click="onCloseClick"></div>
              </div>
            </div>
          </div>
          <div class="tool-bar-container">
            <div class="tool-bar">
              <div class="tool-bar-wrapper">
                <div class="button-group">
                  <div class="button-wrapper">
                    <div class="button left-button" :class="leftDisabled ? 'disabled': ''" @click="onLeftClick"></div>
                  </div>
                  <div class="button-wrapper">
                    <div class="button right-button" :class="rightDisabled ? 'disabled': ''" @click="onRightClick"></div>
                  </div>
                  <div class="button-wrapper">
                    <div
                      class="button fit-button"
                      v-if="zoomMode == 0"
                      title="适应窗口"
                      @click="toogleZoomMode"
                    ></div>
                    <div
                      class="button original-button"
                      v-else
                      title="实际大小"
                      @click="toogleZoomMode"
                    ></div>
                  </div>
                  <div class="button-wrapper">
                    <a 
                      class="button download-button"
                      :href="currentImageSrc" download="">
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="scale-indicator-container">
            <div class="scale-indicator">
              <div class="scale-wrapper">
                <div class="indicator-value">{{ scalePresentage }}</div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import Viewer from "./lib/viewer/index.js";

export default {
  components: {
  },
  data() {
    return {
      zoomMode: 1,
      open: false,
      animation: {
        startShow: false,
        endShow: false,
        startHide: false,
        endHide: true,
      },
      leftDisabled: false,
      rightDisabled: false,
      index: 0,
    };
  },
  destroyed() {
    this.viewer.destroy();
  },
  mounted() {
    this.initViewer();
  },
  computed: {
    extraClass() {
      return Object.keys(this.animation).filter(key => this.animation[key] == true).join(' ');
    },
    currentImageSrc() {
      // 使computed强制依赖于this.index;
      this.index;
      return this._images && this._images[this.index] && this._images[this.index].src;
    }
  },
  methods: {
    photoClick(index) {
      this.viewer.view(index);
    },
    setAnimationStage(key) {
      Object.keys(this.animation).forEach(key => this.animation[key] = false)
      this.animation[key] = true;
    },
    onCloseClick() {
      this.viewer.hide();
    },
    onLeftClick() {
      if(this.leftDisabled) return;
      this.viewer.prev();
    },
    onRightClick() {
      if(this.rightDisabled) return;
      this.viewer.next();
    },
    toogleZoomMode() {
      this.viewer.toggle();
      this.zoomMode == 0 ? this.zoomMode = 1 : this.zoomMode = 0;
    },
    initViewer() {
      if(this.viewer) this.viewer.destroy();
      const container = this.$refs.viewerContainer;
      const wrapper = this.$refs.photosWrapper;

      const event = {
        show: () => {
          this.open = true;
          this.setAnimationStage('startShow');
        },
        shown: () => {
          this.setAnimationStage('endShow');
        },
        hide: () => {
          this.open = false;
          this.setAnimationStage('startHide');
        },
        hidden: () => {
          this.setAnimationStage('endHide');
        },
        view: (event) => {
          const index = event.detail.index;
          if(index == 0) {
            this.leftDisabled = true;
          } else if (index == this._images.length - 1) {
            this.rightDisabled = true;
          } else {
            this.leftDisabled = false;
            this.rightDisabled = false;
          }
          this.index = index;
        }
      };
      this.viewer = new Viewer(wrapper, {
        container,
        button: false,
        navbar: false,
        title: false,
        toolbar: false,
        loop: false,
        tooltip: true,
        zIndex: 0,
        backdrop: true,
        minZoomRatio: 0.25,
        maxZoomRatio: 4,
        ...event
      });
      this._images = this.viewer.images;
    }
  }
};
</script>
