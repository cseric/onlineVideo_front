<template>
  <div id="my-player" ref="player"></div>
</template>

<script>
import DPlayer from 'dplayer'

export default {
  name: 'MyPlayer',
  data () {
    return {
      dp: null
    }
  },
  methods: {
    initPlayer (url) {
      this.dp = new DPlayer({
        container: document.getElementById('my-player'),
        autoplay: false,
        theme: '#1e90ff',
        loop: false,
        lang: 'zh-cn',
        screenshot: false,
        hotkey: true,
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        video: {
          url: url
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
