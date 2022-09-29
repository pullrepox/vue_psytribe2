import Vue from 'vue';

import * as outSideClick from './outside-click';

export {
    outSideClick
};
export default () => {
    Vue.directive(outSideClick.id, outSideClick.definition);
};
