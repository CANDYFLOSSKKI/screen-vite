import {createApp} from 'vue'
import App from './App.vue'
import {router} from '@/router'
import {pinia} from "@/store";
import {THEME_KEY} from "vue-echarts";

async function bootstrap(){
    const app = createApp(App);
    app.use(router);
    app.use(pinia);
    app.component('TrackQuery',() => import('@/component/track/index.vue'))
        .component('SectionFlow',() => import('@/component/section/flow/index.vue'))
        .component('AnimateView',() => import('@/component/animate/index.vue'))
        .component('SectionSpeed',() => import('@/component/section/speed/index.vue'))
        .component('ImportantInfo',() =>import('@/component/info/index.vue'))
        .component('DeviceManage',() => import('@/component/device/index.vue'))
        .component('EventWarning',() => import('@/component/event/index.vue'));
    app.provide(THEME_KEY,'dark');
    app.mount('#app');
}

bootstrap().then(() => {})

