 ### getters 传参数
 ```javascript
 formatFansTagsIdNoSpecialGroup: state => noSpecial => {
    return state.fanTagsByWx.fansGroupAndTagDtos.map(item => {
      const children = (item.fansWxTagDtos || []).map(_item => {
        return { ..._item, id: _item.id, name: _item.tagName };
      });
      return {
        ...item,
        id: item.id,
        name: item.name,
        mode: noSpecial ? "checkbox" : item.specialGroup === 1 ? "radio" : "checkbox",
        children
      };
    });
  },
  ```