import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
  name: 'mega-menu',
  initialize(container) {
    withPluginApi('0.8.30', api => {
      api.decorateWidget('home-logo:after', helper => {
        return helper.attach('mega-menu');
      });
    });
  }
}