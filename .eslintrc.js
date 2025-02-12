module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: 'vue-eslint-parser',
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        '@vue/prettier',
        '@vue/prettier/@typescript-eslint'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    }
};
