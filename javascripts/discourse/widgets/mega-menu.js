import { createWidget } from 'discourse/widgets/widget';
import { iconNode } from "discourse-common/lib/icon-library";
import { h } from "virtual-dom";

export default createWidget('mega-menu', {
  tagName: 'div.mega-menu',
  buildKey: (attrs) => 'mega-menu',
  
  defaultState(attrs) {
    return {
      menuVisible: !this.site.mobileView
    }
  },
  
  html(attrs, state) {
    const contents = [];
    const menuItems = this.buildItemList();
    
    menuItems.forEach(item => {
      if (item.primary) {
        contents.push(
          h('li.primary-mega-menu-item',
            this.attach('mega-menu-item', item)
          )
        );
      }
    });
        
    if (this.site.mobileView) {
      let className = 'mobile-wrapper';
      
      if (state.menuVisible) {
        className += '.show';
      }
      
      return h(`div.${className}`, [
        h('div.mobile-toggle', [
          h('span', settings.mobile_menu_label),
          iconNode("chevron-down"),
        ]),
        h('ul.mega-menu-contents', contents)
      ]);
    } else {
      return h('ul.mega-menu-contents', contents)
    }
  },
  
  buildItemList() {
    let items = settings.menu_items.split('|');
    
    items = items.reduce((result, item) => {
      let parts = item.split('~~');
      
      parts = parts.map(p => {
        if (p == "#") {
          return null;
        } else {
          return p;
        }
      })
      
      let labelParts = parts[0].split(':');
      let order = labelParts[0];
      let label = labelParts[1];
      let key = labelParts[2] || (label ? label.underscore() : null);
      let title = parts[1];
      let href = parts[2];
      let src = parts[3];
      let parent = parts[4];
      
      if (key) {
        result.push({
          order,
          label,
          key,
          title,
          href,
          src,
          parent
        });
      }
      
      return result;
    }, []);
    
    let itemList = [];
    
    for (let i = items.length - 1; i >= 0; i--) {
      let item = items[i];
      
      if (item.key.slice(-1) == '^') {
        items.splice(i, 1);
        
        item.primary = true;
        item.key = item.key.substring(0, item.key.length - 1);
        
        if (item.label && item.label.slice(-1) == '^') {
          item.label = item.label.substring(0, item.label.length - 1);
        }
        
        itemList.push(item);
      }  
    };
    
    itemList.forEach(primaryItem => {
      primaryItem.subItems = this.buildSubItemList(primaryItem.key, items);
    });
    
    itemList.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));
        
    return itemList;
  },
  
  buildSubItemList(key, items) {
    let subItems = [];
    
    for (let i = items.length - 1; i >= 0; i--) {
      let item = items[i];

      if (item.parent == key) {
        items.splice(i, 1);
        item.subItems = this.buildSubItemList(item.key, items);
        subItems.push(item);
      }
    }
    
    subItems.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));
    
    return subItems;
  },
  
  click(e) {
    if (this.site.mobileView && e.target.closest(".mobile-toggle")) {
      this.state.menuVisible = !this.state.menuVisible;
      this.scheduleRerender();
    }
  },
  
  clickOutside(e) {
    if (this.site.mobileView) {
      this.state.menuVisible = false;
      this.scheduleRerender();
    }
  }
});