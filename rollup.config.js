import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import {terser} from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'frontend/main.js',
    output: {
	sourcemap: true,
	format: 'iife',
	name: 'app',
	file: 'frontend/dist/bundle.js'
    },
    plugins: [
	svelte({
	    dev: !production,
	    css: css=>{
		css.write('frontend/dist/bundle.css');
	    }
	}),
	resolve({
	    browser: true,
	    dedupe: importee=>importee==='svelte' || importee.startsWith('svelte/')
	}),
	commonjs(),
	!production && livereload('frontend/dist'),
	production && terser()
    ],
    watch: {
	clearScreen: false
    }
};
