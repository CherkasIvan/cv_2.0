export default {
  build: {
    rollupOptions: {
      external: ["zone.js", "zone.js/testing", "zone.js/node"],
    },
  },
};
