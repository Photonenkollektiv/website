import ViteImagemin from 'vite-plugin-imagemin';

export default {
    // root: './src',
    // build:{
    //     outDir: '../dist',
    //     rollupOptions: {
    //         input: './src/index.html' // Explicitly specify the entry point
    //       }
    // },
    plugins: [
        ViteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false,
            },
            optipng: {
                optimizationLevel: 7,
            },
            mozjpeg: {
                quality: 20,
            },
            pngquant: {
                quality: [0.8, 0.9],
                speed: 4,
            },
            svgo: {
                plugins: [
                    {
                        name: 'removeViewBox',
                    },
                    {
                        name: 'removeEmptyAttrs',
                        active: false,
                    },
                ],
            },
        }),
    ],
};
