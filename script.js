function hexToRgb(hex) {
    // HEXをパースしてRGB値を取得
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b };
}
function rgbToCmyk(r, g, b) {
    // RGBを0-1の範囲に正規化
    let r_n = r / 255;
    let g_n = g / 255;
    let b_n = b / 255;
  
    // CMYKの計算
    let k = 1 - Math.max(r_n, g_n, b_n);
    let c = (1 - r_n - k) / (1 - k);
    let m = (1 - g_n - k) / (1 - k);
    let y = (1 - b_n - k) / (1 - k);
  
    // NaNを0に置き換える処理（kが1のとき）
    if (isNaN(c)) c = 0;
    if (isNaN(m)) m = 0;
    if (isNaN(y)) y = 0;
  
    // CMYK値を0-100%に変換して返す
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
}
function rgbToHsv(r, g, b) {
    let r_n = r / 255;
    let g_n = g / 255;
    let b_n = b / 255;
  
    const max = Math.max(r_n, g_n, b_n);
    const min = Math.min(r_n, g_n, b_n);
    const delta = max - min;
  
    let h, s, v = max;
  
    if (delta === 0) {
      h = 0;
      s = 0;
    } else {
      s = delta / max;
      if (max === r_n) {
        h = (g_n - b_n) / delta;
      } else if (max === g_n) {
        h = 2 + (b_n - r_n) / delta;
      } else {
        h = 4 + (r_n - g_n) / delta;
      }
      h *= 60;
      if (h < 0) {
        h += 360;
      }
    }
    return { h: h, s: s, v: v };
}
function rgbToHsl(r, g, b) {
    // RGB値を0-1の範囲に正規化
    r /= 255;
    g /= 255;
    b /= 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h, s, l = (max + min) / 2;
  
    // 無彩色（白、黒、灰色）の場合
    if (delta === 0) {
      h = 0;
      s = 0;
    } else {
      // 彩度 (Saturation) の計算
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      
      // 色相 (Hue) の計算
      if (max === r) {
        h = (g - b) / delta + (g < b ? 6 : 0);
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else { // max === b
        h = (r - g) / delta + 4;
      }
      h *= 60; // 0-360の範囲に変換
    }
  
    // HSL値を一般的な範囲（H:0-360, S:0-100, L:0-100）に変換して返す
    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
}

const input = document.querySelector('#picker');
const hex = document.querySelector('#hex');
const rgb = document.querySelector('#rgb');
const cmyk = document.querySelector('#cmyk');
const hsv = document.querySelector('#hsv');
const hsl = document.querySelector('#hsl');
const copyButtons = document.querySelectorAll('.copy-button');

function updateColorFormats() {
    const inputVal = input.value;
    hex.textContent = inputVal.toUpperCase();
    const { r, g, b } = hexToRgb(inputVal);
    rgb.textContent = `${r}, ${g}, ${b}`;
    const cmykVal = rgbToCmyk(r, g, b);
    cmyk.textContent = `${cmykVal.c}%, ${cmykVal.m}%, ${cmykVal.y}%, ${cmykVal.k}%`;
    const hsvVal = rgbToHsv(r, g, b);
    hsv.textContent = `${Math.round(hsvVal.h)}°, ${Math.round(hsvVal.s * 100)}%, ${Math.round(hsvVal.v * 100)}%`;
    const hslVal = rgbToHsl(r, g, b);
    hsl.textContent = `${hslVal.h}°, ${hslVal.s}%, ${hslVal.l}%`;
}
function copyToClipboard(event){
    const text = event.target.parentElement.querySelector('span').textContent;
    try {
        navigator.clipboard.writeText(text);
        event.target.textContent = '✔️';
        setTimeout(() => {
            event.target.textContent = '📋';
        }, 1000);
    } catch (err) {
        event.target.textContent = '❌';
        console.log('Failed to copy: ', err);
    }
}

input.addEventListener('input', updateColorFormats);
copyButtons.forEach(button => {
    button.addEventListener('click', copyToClipboard);
});
