import { createWidget } from 'discourse/widgets/widget';
import { iconNode } from "discourse-common/lib/icon-library";
import { h } from "virtual-dom";

export default createWidget('mega-menu-item', {
  tagName: 'div.mega-menu-item',
  buildKey: (attrs) => `mega-menu-item-${attrs.label.toLowerCase()}`,
  
  defaultState(attrs) {
    return {
      showItems: false
    }
  },
  
  buildClasses(attrs, state) {
    let classes = '';
    if (state.showItems) {
      classes += 'show-items ';
    }
    classes += attrs.key;
    return classes;
  },
  
  html(attrs, state) {
    let classes = 'mega-menu-item-element';
    let tag = 'div';
    let contents = [];
    let elementContents = [ h('span', attrs.label) ];
    
    let attributes = {};
    
    if (attrs.title) {
      attributes['title'] = attrs.title;
    }
    
    if (attrs.href) {
      attributes['href'] = attrs.href;
      tag = 'a';
    }
    
    if (attrs.primary) {
      classes += '.primary';
      
      if (attrs.subItems.length) {
        elementContents.push(iconNode("chevron-down"));
      }
    } else if (attrs.src) {
      tag += '.has-background-image';
      attributes['style'] = `background-image: url(${attrs.src})`;
      elementContents.push(
        h('div.mega-overlay')
      );
    }
    
    contents.push(
      h(`${tag}.${classes}`, { attributes }, elementContents)
    )
    
    if (attrs.subItems.length) {
      let subMenu = [];
      
      attrs.subItems.forEach(subItem => {
        subMenu.push(
          h('li.sub-mega-menu-item', this.attach('mega-menu-item', subItem))
        )
      });
      
      contents.push(
        h(`div.mega-menu-${attrs.primary ? 'dropdown' : 'list'}`, h('ul', subMenu))
      );
    }
    
    return contents;
  },
  
  mouseOver(event) {
    if (this.mouseEvents()) {
      this.state.showItems = true;
      this.scheduleRerender();
    }
  },
  
  mouseOut(event) {
    if (this.mouseEvents() && !this.targetInMenu(event.relatedTarget)) {
      this.state.showItems = false;
      this.scheduleRerender();
    }
  },
  
  click(event) {
    if (this.targetInMenu(event.target)) {
      this.state.showItems = !this.state.showItems;
      this.scheduleRerender();
    }
  },
  
  mouseEvents() {
    return !this.site.mobileView && this.attrs.primary;
  },
  
  targetInMenu(target) {
    return $(target).closest(`.mega-menu-item.${this.attrs.key}`).length;
  }
});