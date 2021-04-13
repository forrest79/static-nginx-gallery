module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: 'airbnb-base',
	parserOptions: {
		ecmaVersion: 2022,
	},
	rules: {
		'indent': [2, 'tab', { SwitchCase: 1 }], // we use tabs
		'no-console': 'off',
		'no-plusplus': ['error', { allowForLoopAfterthoughts: true }], // i++ is allowed for "for"
		'no-tabs': 0, // we use tabs instead of spaces
		'prefer-template': 0, // we use ${} when appropriate
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js'],
			}
		},
		'import/extensions': [
			'.js',
		],
	},
};
