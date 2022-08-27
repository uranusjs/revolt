module.exports = {
    'env': {
        'es2021': true,
        'node': true,
    },
    'extends': [
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
    },
    'plugins': [
        '@typescript-eslint',
    ],
    'rules': {
        'no-console': ['warn'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { 'varsIgnorePattern': '^_', 'argsIgnorePattern': '^_' }],
        'semi-style': ['error', 'last'],
        'object-curly-spacing': ['error', 'always'],
        'padding-line-between-statements': ['error', { 'blankLine': 'always', 'prev': ['const', 'let', 'var'], 'next': '*' }, { 'blankLine': 'any', 'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var'] }],
        'complexity': ['error', 30],
        'indent': ['error',
            4,
            {
                'ignoredNodes': ['ConditionalExpression'],
                'ArrayExpression': 1,
                'ImportDeclaration': 1,
                'ignoreComments': true,
                'ObjectExpression': 'first',
                'VariableDeclarator': 3,
            }],
        'new-cap': ['error', {
            'newIsCap': false,
            'capIsNew': false,
        }],
        'no-negated-condition': ['off', false],
        'comma-dangle': ['off'],
        'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 2 }],
        'object-shorthand': ['error', 'always', { 'avoidQuotes': true }],
        'quote-props': ['error', 'always'],
    },

};
