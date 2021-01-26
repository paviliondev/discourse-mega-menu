import { createWidget } from 'discourse/widgets/widget';
import { h } from "virtual-dom";

export default createWidget('mega-menu', {
  tagName: 'div.mega-menu',
  
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
    
    return h('ul.mega-menu-contents', contents);
  },
  
  buildItemList() {
    let items = settings.menu_items.split('|');
    
    items = items.map(item => {
      let parts = item.split('~~');
      
      parts = parts.map(p => {
        if (p == "#") {
          return null;
        } else {
          return p;
        }
      })
      
      let labelParts = parts[0].split(':');
      let label = labelParts[0];
      let key = labelParts[1] || label.underscore();
      let title = parts[1];
      let href = parts[2];
      let src = parts[3];
      let parent = parts[4];
      
      return {
        label,
        key,
        title,
        href,
        src,
        parent
      }
    });
    
    let itemList = [];
    
    for (let i = items.length - 1; i >= 0; i--) {
      let item = items[i];
      
      if (item.key.slice(-1) == '^') {
        items.splice(i, 1);
        
        item.primary = true;
        item.key = item.key.substring(0, item.key.length - 1);
        
        if (item.label.slice(-1) == '^') {
          item.label = item.label.substring(0, item.label.length - 1);
        }
        
        itemList.push(item);
      }  
    };
    
    itemList.forEach(primaryItem => {
      primaryItem.subItems = this.buildSubItemList(primaryItem.key, items);
    });
        
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
    
    return subItems;
  }
});