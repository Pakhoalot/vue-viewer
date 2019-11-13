<template>
  <div>
    <div ref="photosWrapper">
      <slot></slot>
    </div>
    <div class="jz-photo-preview">
      <div ref="viewerContainer"></div>
      <!-- <div v-show="open">
        <div class="mask"></div>
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
                  <div class="button left-button" @click="onLeftClick"></div>
                </div>
                <div class="button-wrapper">
                  <div class="button right-button" @click="onRightClick"></div>
                </div>
                <div class="button-wrapper">
                  <div
                    class="button fit-button"
                    v-if="scaleMode == 2"
                    title="适应窗口"
                  ></div>
                  <div
                    class="button original-button"
                    v-else
                    title="实际大小"
                  ></div>
                </div>
                <div class="button-wrapper">
                  <div class="button download-button"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="scale-indicator-container">
          <div class="scale-indicator">
            <div class="scale-wrapper">
              <div class="indicator-value">{{ scalePresentage }}</div>
            </div>
          </div>
        </div>
      </div> -->
      
    </div>
  </div>
</template>

<script>
import Viewer from "./lib/viewer/index";

export default {
  data() {
    return {
      scaleMode: 1,
      scalePresentage: 2,
      open: false
    };
  },
  mounted() {
    const container = this.$refs.viewerContainer;
    const wrapper = this.$refs.photosWrapper;

    const event = {
    };
    this.viewer = new Viewer(wrapper, {
      container,
      button: true,
      navbar: false,
      title: false,
      toolbar: {
        prev: true,
        next: true,
        toggleZoom: true,
        download: true,
      },
      loop: false,
      tooltip: false,
      zIndex: 0,
      backdrop: true,
      ...event
    });
  },
  methods: {
    onCloseClick() {
      this.viewer.hide();
      this.open = false;
    },
    onLeftClick() {
      this.viewer.prev();
    },
    onRightClick() {
      this.viewer.next();
    }
  }
};
</script>
