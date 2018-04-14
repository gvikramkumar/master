
export class Util {

  static isGuid(val) {
    return /^\{?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}?$/.test(val);
  }

  static isKeydown(event) {
    const code = event.which;
    // 13 = Return, 32 = Space
    return ((code === 13) || (code === 32));
  }


  static keydownAndNotEnterOrSpace(event) {
    return event.type === 'keydown' && !(event.which === 13 || event.which === 32);
  }

  static keydownAndEnterOrSpace(event) {
    return event.type === 'keydown' && (event.which === 13 || event.which === 32);
  }

  static isEscapeKeyEvent(event) {
    return event.which === 27;
  }

  /**
   * getModalPosition
   * @desc - given these parameters, come back with a top/left position for material's config.position property
   * this is the first round with this (left), used for opening on left where the will always be room. Needs to be expanded
   * for not enough room horizontally as well as top/bottom versions, right needs to be tested.
   * @param event
   * @param width
   * @param height
   * @param sideOffset
   * @param topOffset
   * @param openDirection - left/right/top/bottom
   */
  static getModalPosition(event, width, height, sideOffset, topOffset, openDirection) {
    const padding = 40;
    let top: number,
      left: number,
      shrink = false;

    // so far only tested for left, though should just work for right, todo: and bottom
    if (openDirection === 'left') {
      left = (event.clientX - width + sideOffset);
    } else if (openDirection === 'right') {
      left = (event.clientX - sideOffset);
    }

    if (window.innerHeight < height + padding) {
      shrink = true;
      height = window.innerHeight - padding;
      top = padding / 2;
    } else if (window.innerHeight < event.clientY + height - topOffset) {
      top = window.innerHeight - height - padding / 4;
    } else {
      top = event.clientY - topOffset;
    }

    return {top, left, height};
  }

  static getEncodedAddress(addr) {
    return 'https://maps.google.com/?q=' + encodeURIComponent(addr);
  }

  static getUrl(website) {
    if (/^(http:\/\/|https:\/\/)/.test(website)) {
      return website;
    } else {
      return 'http://' + website;
    }
  }

  static getNotes(notes) {
    const str = notes.replace(/\n/g, '<br>');
    return str;
  }

  static getPhoneDisplay(value) {
    return value.prefix === '1' ? value.phone : value.prefix + '-' + value.phone;
  }

  static getPhoneNo(value) {
    return value.prefix + value.phone.replace(/[^0-9]+/g, '');
  }

  static replaceNewLinesWithSpace(arr, property) {
    const regex = /\n/g;
    const space = ' ';
    if (typeof arr === 'string') {
      return arr.replace(regex, space);
    } else if (property) { // then array
      return arr.map(v => {
        v[property].replace(regex, space);
        return v;
      });
    }
  }

}

