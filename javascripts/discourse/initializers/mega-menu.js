import { withPluginApi } from 'discourse/lib/plugin-api';
import hbs from "discourse/widgets/hbs-compiler";

export default {
  name: 'mega-menu',
  initialize(container) {
    withPluginApi('0.8.30', api => {
      api.decorateWidget('home-logo:after', helper => {
        if (!helper.widget.attrs.showHeaderTopicInfo) {
          return helper.attach('mega-menu');
        }
      });
      
      api.reopenWidget('home-logo', {
        smallLogoUrl(opts = {}) {
          return settings.on_topic_scroll == 'show' ? 
            this.logoResolver("logo", opts) :
            this._super(opts);
        }
      });
      
      api.modifyClass('component:site-header', {
        pluginId: 'discourse-mega-menu',
        buildArgs() {
          return $.extend({}, this._super(), {
            showHeaderTopicInfo: !!this._topic && settings.on_topic_scroll == 'hide'
          });
        }
      })
      
      api.reopenWidget('header-contents', {
        template: hbs`
          {{home-logo attrs=attrs}}
          {{#if attrs.showHeaderTopicInfo}}
            {{header-topic-info attrs=attrs}}
          {{/if}}
          <div class="panel clearfix">{{yield}}</div>
        `
      })
    });
  }
}