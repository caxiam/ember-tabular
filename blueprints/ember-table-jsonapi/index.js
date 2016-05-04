module.exports = {
    afterInstall: function() {
        return this.addBowerPackagesToProject([
            {
                name: 'components-font-awesome',
                target: '4.6.0'
            }
        ]);
    },

    normalizeEntityName: function() {}
};