import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#1456d8',
                secondary: '#B2EBF2',
                accent: '#153661',
                error: '#c6504a',
                info: '#B2EBF2',
                success: '#9ccc65',
                warning: '#FECB00'
            }
        }
    }
});
