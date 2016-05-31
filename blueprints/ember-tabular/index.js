module.exports = {
  afterInstall: function() {
    return this.addBowerPackagesToProject([
      {
        name: 'font-awesome',
        target: '4.6.2'
      }
    ]);
  },

  normalizeEntityName: function() {}
};
