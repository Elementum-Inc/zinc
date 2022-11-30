<template>
  <div>
    <!-- Hello, {{ settings.name }}. -->
    Hello, world.
  </div>
</template>

<script>
export default {
  name: 'Test',
  props: {
    settings: Object
  }
}
</script>