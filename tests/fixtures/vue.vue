<template>
  <!-- TODO: Vue template comment -->
  <p>{{ greeting }} World!</p>
</template>

<script>
/* TODO: Vue script comment */
module.exports = {
  data: function () {
    return {
      greeting: 'Hello Leasot!'
    }
  }
}
</script>

<style lang="less" scoped>
p {
  font-size: 2em;
  // FIXME: Vue style comment
  text-align: center;
}
</style>
