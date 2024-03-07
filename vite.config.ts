import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path'
import cesium from "vite-plugin-cesium";
import {viteMockServe} from "vite-plugin-mock";

export default({mode}) => {
    const env = loadEnv(mode,process.cwd());
    return defineConfig({
        plugins: [
            vue(),
            cesium(),
            EnvironmentPlugin('all'),
            viteMockServe({
                mockPath: 'src/mock',
                watchFiles: true,
                enable: env.VITE_USE_MOCK === 'true',
            })
        ],
        server: {
            port: Number(env.VITE_SERVER_PORT),
            proxy: {
                '/api': {
                    target: env.VITE_BASE_API,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                }
            }
        },
        assetsInclude: [
            '**/*.glb',
            '**/*.gltf',
            '**/*.bin',
            '**/*.fbx'
        ],
        resolve: {
            alias: { "@": path.join(__dirname, "./src") }
        },
    })
}


