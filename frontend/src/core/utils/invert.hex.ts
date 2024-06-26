export function invertHexColor(hex:string) {
    
    hex = hex.replace('#', '');
  
  
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
  
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
  
  
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }