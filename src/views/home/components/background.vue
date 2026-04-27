<template>
  <div class="background">
    <h class="title_main t-position">AMS音乐音乐资料馆</h>
    <h class="title_sub t-position">在此浏览AvaMax的世界</h>
    <!-- <a href="" class="btn text_box_btn btn_animated">点击播放</a> -->
    <button class="t-position the-button" @click="$router.push('/releases')">前往作品馆</button>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.background {
  width: 100%;
  height: 100vh;
  color: #fff;

  // background-color: pink;
  background-image: url("../../../assets/Ava Max/bg-dcp.jpg");
  background-size: cover;
  background-position: center 0;
  background-repeat: no-repeat;

  position: fixed;
  top: 80px;
  left: 0;
  z-index: 1;
}

.t-position {
  position: absolute;
  left: 50%;
  white-space: nowrap;
}

@mixin setMove($name, $type, $from, $to, $duration, $baseTransform: null) {
  @keyframes #{$name} {
    0% {
      opacity: 0;
      transform: if($type =='X',
        if($baseTransform, #{$baseTransform} translateX($from), translateX($from)),
        if($baseTransform, #{$baseTransform} translateY($from), translateY($from)));
    }

    80% {
      transform: if($type =='X',
        if($baseTransform, #{$baseTransform} translateX($to), translateX($to)),
        if($baseTransform, #{$baseTransform} translateY($to), translateY($to)));
    }

    100% {
      opacity: 1;
      transform: if($baseTransform, #{$baseTransform}, translate(0, 0));
    }
  }

  animation: #{$name} $duration forwards;
}

@mixin setTitle($size, $weight, $ltspc: 30%, $top: null, $left: null) {
  font-size: $size;
  font-weight: $weight;
  letter-spacing: $ltspc;
  top: $top;
  left: $left;
}

.title_main {
  @include setTitle($size: 75px, $weight: 600, $top: 18%);
  @include setMove('moveInLeft', 'X', -100px, 10px, 1s, translateX(-50%));
}

.title_sub {
  @include setTitle($size: 20px, $weight: 600, $top: 60%);
  @include setMove('moveInRight', 'X', 100px, -10px, 1s, translateX(-50%));
}

.the-button {
  height: 52px;
  padding: 0 35px;
  font-size: 17px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;

  background: linear-gradient(#fff1, transparent);
  backdrop-filter: blur(10px);
  box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);
  color: #fff;

  top: 65%;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 12px 25px rgba(64, 158, 255, 0.3);
  }

  @include setMove('moveInBottom', 'Y', 100px, -10px, 1s, translateX(-50%));
}
</style>
