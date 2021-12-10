"use strict";

const Filters = {};

////////////////////////////////////////////////////////////////////////////////
// General utility functions
////////////////////////////////////////////////////////////////////////////////

//import { Sobel } from "sobel";
//importScripts('/sobel.js');
// Hardcoded Pi value
// const pi = 3.14159265359;
const pi = Math.PI;
const l = 256; // levels of L

// Constrain val to the range [min, max]
function clamp(val, min, max) {
    /* Shorthand for:
    * if (val < min) {
    *   return min;
    * } else if (val > max) {
    *   return max;
    * } else {
    *   return val;
    * }
    */
    return val < min ? min : val > max ? max : val;
}

// Extract vertex coordinates from a URL string
function stringToCoords(vertsString) {
    const centers = [];
    const coordStrings = vertsString.split("x");
    for (let i = 0; i < coordStrings.length; i++) {
        const coords = coordStrings[i].split("y");
        const x = parseInt(coords[0]);
        const y = parseInt(coords[1]);
        if (!isNaN(x) && !isNaN(y)) {
            centers.push({ x: x, y: y });
        }
    }

    return centers;
}

// Blend scalar start with scalar end. Note that for image blending,
// end would be the upper layer, and start would be the background
function blend(start, end, alpha) {
    return start * (1 - alpha) + end * alpha;
}

// ----------- STUDENT CODE BEGIN ------------
// ----------- Our reference solution uses 72 lines of code.
// Compute the distance from pixel(x,y) to the given center
function dFromCenter(x, y, center) {
    return Math.sqrt(Math.abs(x - center.x) ** 2 + Math.abs(y - center.y) ** 2);
}

// Convolute the image at pixel (x, y) with a custom kernel
function convolute(image, kernel, x, y) {
    let pixel = new Pixel(0, 0, 0);
    let size = new Array(2);
    size[0] = kernel.length;
    size[1] = kernel[0].length;
    let winR = (size[0] - 1) / 2;
    //if (x === 0 && y === 98) debugger;
    for (let i = -winR; i <= winR; i++) {
        for (let j = -winR; j <= winR; j++) {
            let newX, newY;
            if (x + i < 0) newX = image.width + x + i;
            else if (x + i >= image.width) newX = x + i - image.width;
            else newX = x + i;
            if (y + j < 0) newY = image.height + y + j;
            else if (y + j >= image.height) newY = y + j - image.height;
            else newY = y + j;
            //let temp = image.getPixel(newX, newY).multipliedBy(kernel[i + winR][j + winR]);
            pixel = pixel.plus(image.getPixel(newX, newY).multipliedBy(kernel[i + winR][j + winR]));
            //if (x === 0 && y === 98) debugger;
        }
    }
    return pixel;
}

function swap(items, leftIndex, rightIndex) {
    let temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}

function partition(items, left, right) {
    let pivot = items[Math.floor((right + left) / 2)],
    i = left,
    j = right;

    while (i <= j) {
        while(items[i] < pivot) {
            i++;
        }
        while(items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right) {
    let index;

    if (items.length > 1) {
        index = partition(items, left, right);

        if (left < index - 1) {
            quickSort(items, left, index - 1);
        }
        if (index < right) {
            quickSort(items, index, right);
        }
    }
    return items;
}

// length of a line{x0, y0, x1, y1}
function lineLength(line) {
    return Math.sqrt((line.x1 - line.x0) ** 2 + (line.y1 - line.y0) ** 2);
}

// compute the norm of the difference between 2 vectors
function norm(vector1, vector2) {
    let result = Math.sqrt((vector2.x - vector1.x) ** 2 + (vector2.y - vector1.y) ** 2);
    return result;
}

// dot product of two 2D vectors
function dot(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
}

// difference of two 2D vectors
function vMinus(vector1, vector2) {
    return {x: vector2.x - vector1.x, y: vector2.y - vector1.y};
}

// sum of two 2D vectors
function vPlus(vector1, vector2) {
    return {x: vector2.x + vector1.x, y: vector2.y + vector1.y};
}

// scalar product of a 2D vector
function vMultiply(vector, scalar) {
    return {x: vector.x * scalar, y: vector.y * scalar};
}

function vDivide(vector, scalar) {
    if (scalar === 0) return vector;
    return {x: vector.x / scalar, y: vector.y / scalar};
}

// return the perpendicular vector
function perpendicular(vector) {
    return {x: vector.y, y: -vector.x};
}

function colorDist(pixel, refPx) {
    let dist = 0;
    for (let i = 0; i < 3; i++) {
        dist += (pixel.data[i] - refPx.data[i]) ** 2;
    }
    dist = Math.sqrt(dist);
    return dist;
}
// ----------- STUDENT CODE END ------------

////////////////////////////////////////////////////////////////////////////////
// Filters
////////////////////////////////////////////////////////////////////////////////

// You've already implemented this in A0! Feel free to copy your code into here
Filters.fillFilter = function(image, color) {
    image.fill(color);

    return image;
};

// You've already implemented this in A0! Feel free to copy your code into here
Filters.brushFilter = function(image, radius, color, vertsString) {
    // centers is an array of (x, y) coordinates that each defines a circle center
    const centers = stringToCoords(vertsString);

    // draw a filled circle centered at every location in centers[].
    // radius and color are specified in function arguments.
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 10 lines of code.
    for (let i = 0; i < centers.length; i++) {
        for (var x = 0; x < image.width; x++) {
          for (var y = 0; y < image.height; y++) {
            //if (withinR(x, y, centers[i], radius))
            if (dFromCenter(x, y, centers[i]) <= radius)
            image.setPixel(x, y, color);
          }
        }
      }
    // ----------- STUDENT CODE END ------------

    return image;
};

// You've already implemented this in A0! Feel free to copy your code into here
Filters.softBrushFilter = function(image, radius, color, alpha_at_center, vertsString) {
    // centers is an array of (x, y) coordinates that each defines a circle center
    const centers = stringToCoords(vertsString);

    // draw a filled circle with opacity equals to alpha_at_center at the center of each circle
    // the opacity decreases linearly along the radius and becomes zero at the edge of the circle
    // radius and color are specified in function arguments.
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 20 lines of code.
    for (let i = 0; i < centers.length; i++) {
        for (let x = 0; x < image.width; x++) {
          for (let y = 0; y < image.height; y++) {
    
            let dist = dFromCenter(x, y, centers[i]);
            if (dist <= radius) {
              let a = (1 - dist / radius) * alpha_at_center;
              // color.a = a;
              let newColor = image.getPixel(x, y);
              newColor = newColor.multipliedBy(1 - a);
              newColor = newColor.plus(color.multipliedBy(a));
              image.setPixel(x, y, newColor);
            }
    
          }
        }
      }
    // ----------- STUDENT CODE END ------------

    return image;
};

// Ratio is a value in the domain [-1, 1]. When ratio is < 0, linearly blend the image
// with black. When ratio is > 0, linearly blend the image with white. At the extremes
// of -1 and 1, the image should be completely black and completely white, respectively.
Filters.brightnessFilter = function(image, ratio) {
    let alpha, dirLuminance;
    if (ratio < 0.0) {
        alpha = 1 + ratio;
        dirLuminance = 0; // blend with black
    } else {
        alpha = 1 - ratio;
        dirLuminance = 1; // blend with white
    }

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);

            pixel.data[0] = alpha * pixel.data[0] + (1 - alpha) * dirLuminance;
            pixel.data[1] = alpha * pixel.data[1] + (1 - alpha) * dirLuminance;
            pixel.data[2] = alpha * pixel.data[2] + (1 - alpha) * dirLuminance;

            image.setPixel(x, y, pixel);
        }
    }

    return image;
};

// Reference at this:
//      https://en.wikipedia.org/wiki/Image_editing#Contrast_change_and_brightening
// value = (value - 0.5) * (tan ((contrast + 1) * PI/4) ) + 0.5;
// Note that ratio is in the domain [-1, 1]
Filters.contrastFilter = function(image, ratio) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 14 lines of code.
    let factor = Math.tan((ratio + 1) * Math.PI / 4);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            
            const pixel = image.getPixel(x, y);
            pixel.data[0] = (pixel.data[0] - 0.5) * factor + 0.5;
            pixel.data[1] = (pixel.data[1] - 0.5) * factor + 0.5;
            pixel.data[2] = (pixel.data[2] - 0.5) * factor + 0.5;

            image.setPixel(x, y, pixel);
        }
    }
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('contrastFilter is not implemented yet');
    return image;
};

// Note that the argument here is log(gamma)
Filters.gammaFilter = function(image, logOfGamma) {
    const gamma = Math.exp(logOfGamma);
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 9 lines of code.
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);

            pixel.data[0] = pixel.data[0] ** gamma;
            pixel.data[1] = pixel.data[1] ** gamma;
            pixel.data[2] = pixel.data[2] ** gamma;

            image.setPixel(x, y, pixel);
        }
    }
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('gammaFilter is not implemented yet');
    return image;
};

/*
* The image should be perfectly clear up to innerRadius, perfectly dark
* (black) at outerRadius and beyond, and smoothly increase darkness in the
* circular ring in between. Both are specified as multiples of half the length
* of the image diagonal (so 1.0 is the distance from the image center to the
* corner).
*
* Note that the vignette should still form a perfect circle!
*/
Filters.vignetteFilter = function(image, innerR, outerR) {
    // Let's ensure that innerR is at least 0.1 smaller than outerR
    innerR = clamp(innerR, 0, outerR - 0.1);
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 17 lines of code.
    let halfDiag = 0.5 * Math.sqrt(image.width ** 2 + image.height ** 2);
    let center = {x: image.width / 2, y: image.height / 2};
    let alpha;

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let dist = dFromCenter(x, y, center);
            if (dist <= halfDiag * innerR) {
                alpha = 1;
            } else if (dist < halfDiag * outerR) {
                // alpha = 1 - (dist / halfDiag - innerR) / (outerR - innerR); // linear falloff
                alpha = Math.cos(((dist / halfDiag - innerR) / (outerR - innerR)) * (Math.PI / 2)) ** 4; // natural falloff
            } else {
                alpha = 0;
            }

            const pixel = image.getPixel(x, y);

            pixel.data[0] *= alpha;
            pixel.data[1] *= alpha;
            pixel.data[2] *= alpha;

            image.setPixel(x, y, pixel);
        }
    }
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('vignetteFilter is not implemented yet');
    return image;
};

/*
* You will want to build a normalized CDF of the L channel in the image.
*/
Filters.histogramEqualizationFilter = function(image) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 33 lines of code.
    let pixelCount = image.data.length / 4; // number of pixels
    let pdf = new Array(l).fill(0);
    let cdf = new Array(l).fill(0);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixel = image.getPixel(x, y);
            pixel = pixel.rgbToHsl();
            let temp = Math.floor(pixel.data[2] * (l - 1));
            pdf[temp]++;
        }
    }
    pdf[0] = pdf[0] / pixelCount;
    cdf[0] = pdf[0];
    for (let i = 1; i < l; i++) {
        pdf[i] = pdf[i] / pixelCount;
        cdf[i] = cdf[i - 1] + pdf[i];
    }
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixel = image.getPixel(x, y);
            pixel = pixel.rgbToHsl();
            pixel.data[2] = cdf[Math.floor(pixel.data[2] * (l - 1))];
            pixel.clamp();
            pixel = pixel.hslToRgb();
            image.setPixel(x, y, pixel);
        }
    } 
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('histogramEqualizationFilter is not implemented yet');
    return image;
};

// Set each pixel in the image to its luminance
Filters.grayscaleFilter = function(image) {
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            const luminance = 0.2126 * pixel.data[0] + 0.7152 * pixel.data[1] + 0.0722 * pixel.data[2];
            pixel.data[0] = luminance;
            pixel.data[1] = luminance;
            pixel.data[2] = luminance;

            image.setPixel(x, y, pixel);
        }
    }

    return image;
};

// Adjust each channel in each pixel by a fraction of its distance from the average
// value of the pixel (luminance).
// See: http://www.graficaobscura.com/interp/index.html
Filters.saturationFilter = function(image, ratio) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 13 lines of code.
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            const luminance = 0.2126 * pixel.data[0] + 0.7152 * pixel.data[1] + 0.0722 * pixel.data[2];
            pixel.data[0] = blend(pixel.data[0], luminance, -ratio);
            pixel.data[1] = blend(pixel.data[1], luminance, -ratio);
            pixel.data[2] = blend(pixel.data[2], luminance, -ratio);

            image.setPixel(x, y, pixel);
        }
    }
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('saturationFilter is not implemented yet');
    return image;
};

// Apply the Von Kries method: convert the image from RGB to LMS, divide by
// the LMS coordinates of the white point color, and convert back to RGB.
Filters.whiteBalanceFilter = function(image, white) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 23 lines of code.
    white = white.rgbToXyz().xyzToLms();
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixel = image.getPixel(x, y);
            pixel = pixel.rgbToXyz().xyzToLms();;
            pixel.data[0] = pixel.data[0] / white.data[0];
            pixel.data[1] = pixel.data[1] / white.data[1];
            pixel.data[2] = pixel.data[2] / white.data[2];
            pixel = pixel.lmsToXyz().xyzToRgb();

            image.setPixel(x, y, pixel);
        }
    }
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('whiteBalanceFilter is not implemented yet');
    return image;
};

// This is similar to the histogram filter, except here you should take the
// the CDF of the L channel in one image and
// map it to another
//
Filters.histogramMatchFilter = function(image, refImg) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 58 lines of code.
    let pixelCount = image.data.length / 4; // number of pixels
    let refCount = refImg.data.length / 4;
    let pdf = new Array(l).fill(0);
    let cdf = new Array(l).fill(0);
    let pdfRef = new Array(l).fill(0);
    let cdfRef = new Array(l).fill(0);

    for (let x = 0; x < refImg.width; x++) {
        for (let y = 0; y < refImg.height; y++) {
            let pixel = refImg.getPixel(x, y);
            pixel = pixel.rgbToHsl();
            let temp = Math.floor(pixel.data[2] * (l - 1));
            pdfRef[temp]++;
        }
    }

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixel = image.getPixel(x, y);
            pixel = pixel.rgbToHsl();
            let temp = Math.floor(pixel.data[2] * (l - 1));
            pdf[temp]++;
        }
    }

    pdfRef[0] = pdfRef[0] / refCount;
    cdfRef[0] = pdfRef[0];
    pdf[0] = pdf[0] / pixelCount;
    cdf[0] = pdf[0];
    for (let i = 1; i < l; i++) {
        pdfRef[i] = pdfRef[i] / refCount;
        cdfRef[i] = cdfRef[i - 1] + pdfRef[i];

        pdf[i] = pdf[i] / pixelCount;
        cdf[i] = cdf[i - 1] + pdf[i];
    }

    let cdfNew = new Array(l);
    for (let i = 0; i < l; i++) {
        let diff = Infinity;
        for (let j = 0; j < l; j++) {
            if (Math.abs(cdf[i] - cdfRef[j]) < diff) {
                diff = Math.abs(cdf[i] - cdfRef[j]);
                cdfNew[i] = j;
            }
        }
    }
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixel = image.getPixel(x, y);
            pixel = pixel.rgbToHsl();
            pixel.data[2] = cdfNew[Math.floor(pixel.data[2] * (l - 1))] / (l - 1);
            pixel.clamp();
            pixel = pixel.hslToRgb();
            image.setPixel(x, y, pixel);
        }
    } 
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('histogramMatchFilter is not implemented yet');
    return image;
};

// Convolve the image with a gaussian filter.
// NB: Implement this as a seperable gaussian filter
Filters.gaussianFilter = function(image, sigma) {
    // note: this function needs to work in a new copy of the image
    //       to avoid overwriting original pixels values needed later
    // create a new image with the same size as the input image
    let newImg = image.createImg(image.width, image.height);
    // the filter window will be [-winR, winR] for a total diameter of roughly Math.round(3*sigma)*2+1;
    const winR = Math.round(sigma * 3);
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 58 lines of code.
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let newPx = new Pixel(0, 0, 0);

            let yMin = y - winR;
            let yMax = y + winR;
            for (let i = yMin; i <= yMax; i++) {
                let dist = Math.abs(i - y);
                let g = Math.exp(- (dist ** 2) / (2 * sigma ** 2)) / Math.sqrt(2 * pi * sigma ** 2);
                let realY;
                if (i < 0) realY = image.height + i;
                else if (i >= image.height) realY = i - image.height;
                else realY = i;
                newPx = newPx.plus(image.getPixel(x, realY).multipliedBy(g));
            }
            newImg.setPixel(x, y, newPx);
        }
    }
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            let newPx = new Pixel(0, 0, 0);

            let xMin = x - winR;
            let xMax = x + winR;
            for (let i = xMin; i <= xMax; i++) {
                let dist = Math.abs(i - x);
                let g = Math.exp(- (dist ** 2) / (2 * sigma ** 2)) / Math.sqrt(2 * pi * sigma ** 2);
                let realX;
                if (i < 0) realX = image.width + i;
                else if (i >= image.width) realX = i - image.width;
                else realX = i;
                newPx = newPx.plus(newImg.getPixel(realX, y).multipliedBy(g));
            }
            newImg.setPixel(x, y, newPx);
        }
    }
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('gaussianFilter is not implemented yet');
    return newImg;
};

/*
* First the image with the edge kernel and then add the result back onto the
* original image.
*/
Filters.sharpenFilter = function(image) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 33 lines of code.
    /*let baseKernel = [[-1, -1, -1], 
    [-1, 9, -1], 
    [-1, -1, -1]];*/
    let newImg = image.createImg(image.width, image.height);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let kernel = new Array(3);
            for (let i = 0; i < 3; i++) {
                kernel[i] = new Array(3).fill(-1);
            }
            if (x === 0) {
                kernel[0][0] = 0;
                kernel[1][0] = 0;
                kernel[2][0] = 0;
            } else if (x === image.width - 1) {
                kernel[0][2] = 0;
                kernel[1][2] = 0;
                kernel[2][2] = 0;
            }
            if (y === 0) {
                kernel[0].fill(0);
            } else if (y === image.height - 1) {
                kernel[2].fill(0);
            }
            let center = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    center += kernel[i][j];
                }
            }
            kernel[1][1] = -center;

            newImg.setPixel(x, y, convolute(image, kernel, x, y));

        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('sharpenFilter is not implemented yet');
    return image;
};

/*
* Convolve the image with the edge kernel from class. You might want to define
* a convolution utility that convolves an image with some arbitrary input kernel
*
* For this filter, we recommend inverting pixel values to enhance edge visualization
*/
Filters.edgeFilter = function(image) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 57 lines of code.
    /*let baseKernel = [[-1, -1, -1], 
    [-1, 8, -1], 
    [-1, -1, -1]];*/
    let newImg = image.createImg(image.width, image.height);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let kernel = new Array(3);
            for (let i = 0; i < 3; i++) {
                kernel[i] = new Array(3).fill(-1);
            }
            if (x === 0) {
                kernel[0][0] = 0;
                kernel[1][0] = 0;
                kernel[2][0] = 0;
            } else if (x === image.width - 1) {
                kernel[0][2] = 0;
                kernel[1][2] = 0;
                kernel[2][2] = 0;
            }
            if (y === 0) {
                kernel[0].fill(0);
            } else if (y === image.height - 1) {
                kernel[2].fill(0);
            }
            let center = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    center += kernel[i][j];
                }
            }
            kernel[1][1] = -center - 1;

            let pixel = convolute(image, kernel, x, y);
            // invert for visualization
            pixel = pixel.multipliedBy(-1);
            let temp = new Pixel(1, 1, 1);
            pixel = temp.plus(pixel.multipliedBy(-1));

            newImg.setPixel(x, y, pixel);

        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('edgeFilter is not implemented yet');
    return image;
};

// Set a pixel to the median value in its local neighbor hood. You might want to
// apply this seperately to each channel.
Filters.medianFilter = function(image, winR) {
    // winR: the window will be  [-winR, winR];
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 36 lines of code.
    let newImg = image.createImg(image.width, image.height);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {

            let r = new Array(),
            g = new Array(),
            b = new Array();

            for (let i = -winR; i <= winR; i++) {
                for (let j = -winR; j <= winR; j++) {
                    let newX, newY;
                    if (x + i < 0) newX = image.width + x + i;
                    else if (x + i >= image.width) newX = x + i - image.width;
                    else newX = x + i;
                    if (y + j < 0) newY = image.height + y + j;
                    else if (y + j >= image.height) newY = y + j - image.height;
                    else newY = y + j;

                    let neighbor = image.getPixel(newX, newY);
                    r.push(neighbor.data[0]);
                    g.push(neighbor.data[1]);
                    b.push(neighbor.data[2]);
                }
            }
            r = quickSort(r, 0, r.length - 1);
            g = quickSort(g, 0, g.length - 1);
            b = quickSort(b, 0, b.length - 1);

            let pixel = new Pixel(r[Math.floor(r.length / 2)], g[Math.floor(g.length / 2)], b[Math.floor(b.length / 2)]);
            newImg.setPixel(x, y, pixel);

        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('medianFilter is not implemented yet');
    return image;
};

// Apply a bilateral filter to the image. You will likely want to reference
// precept slides, lecture slides, and the assignments/examples page for help.
Filters.bilateralFilter = function(image, sigmaR, sigmaS) {
    // reference: https://en.wikipedia.org/wiki/Bilateral_filter
    // we first compute window size and preprocess sigmaR
    //const winR = Math.round((sigmaR + sigmaS) * 1.5);
    const winR = Math.round((sigmaR + sigmaS) * 2);
    sigmaR = sigmaR * (Math.sqrt(2) * winR);

    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 53 lines of code.
    let newImg = image.createImg(image.width, image.height);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixel = image.getPixel(x, y);
            let newPx = new Pixel(0, 0, 0);
            let weights = new Array(2 * winR + 1);
            for (let i = 0; i < weights.length; i++) {
                weights[i] = new Array(2 * winR + 1);
            }
            let wSum = 0;

            for (let i = -winR; i <= winR; i++) {
                for (let j = -winR; j <= winR; j++) {
                    let newX, newY;
                    if (x + i < 0) newX = image.width + x + i;
                    else if (x + i >= image.width) newX = x + i - image.width;
                    else newX = x + i;
                    if (y + j < 0) newY = image.height + y + j;
                    else if (y + j >= image.height) newY = y + j - image.height;
                    else newY = y + j;

                    let neighbor = image.getPixel(newX, newY);
                    let colorDist = Math.sqrt((pixel.data[0] * (l - 1) - neighbor.data[0] * (l - 1)) ** 2 + (pixel.data[1] * (l - 1) - neighbor.data[1] * (l - 1)) ** 2 + (pixel.data[2] * (l - 1) - neighbor.data[2] * (l - 1)) ** 2);
                    let w = Math.exp(-(i ** 2 + j ** 2) / (2 * sigmaS ** 2) - (colorDist ** 2) / (2 * sigmaR ** 2));
                    weights[i + winR][j + winR] = w;
                    wSum += w;
                    }
            }
            for (let i = -winR; i <= winR; i++) {
                for (let j = -winR; j <= winR; j++) {
                    weights[i + winR][j + winR] /= wSum;

                    let newX, newY;
                    if (x + i < 0) newX = image.width + x + i;
                    else if (x + i >= image.width) newX = x + i - image.width;
                    else newX = x + i;
                    if (y + j < 0) newY = image.height + y + j;
                    else if (y + j >= image.height) newY = y + j - image.height;
                    else newY = y + j;

                    let neighbor = image.getPixel(newX, newY);
                    newPx = newPx.plus(neighbor.multipliedBy(weights[i + winR][j + winR]));
                }
            }
            newImg.setPixel(x, y, newPx);
        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('bilateralFilter is not implemented yet');
    return image;
};

// Conver the image to binary
Filters.quantizeFilter = function(image) {
    // convert to grayscale
    //image = Filters.grayscaleFilter(image);

    // use center color
    for (let i = 0; i < image.height; i++) {
        for (let j = 0; j < image.width; j++) {
            const pixel = image.getPixel(j, i);
            let n = 2; // number of bits
            for (let c = 0; c < 3; c++) {
                pixel.data[c] = Math.round(pixel.data[c] * (2 ** n - 1)) / (2 ** n - 1); // 1-bit

            }
            pixel.clamp();
            image.setPixel(j, i, pixel);
        }
    }
    return image;
};

// To apply random dithering, first convert the image to grayscale, then apply
// random noise, and finally quantize
Filters.randomFilter = function(image) {
    // convert to grayscale
    //image = Filters.grayscaleFilter(image);

    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 12 lines of code.
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            let n = 2; // number of bits
            let noise = (Math.random() - 0.5) / (2 ** n - 1);
            for (let i = 0; i < 3; i++) {
                pixel.data[i] = pixel.data[i] + noise;
                pixel.data[i] = Math.round(pixel.data[i] * (2 ** n - 1)) / (2 ** n - 1);
            }
            pixel.clamp();
            image.setPixel(x, y, pixel);
        }
    }
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('randomFilter is not implemented yet');
    return image;
};

// Apply the Floyd-Steinberg dither with error diffusion
Filters.floydFilter = function(image) {
    // convert to grayscale
    //image = Filters.grayscaleFilter(image);

    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 27 lines of code.
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            const newPx = new Pixel(0, 0, 0);
            let n = 1; // number of bits
            for (let i = 0; i < 3; i++) {
                newPx.data[i] = Math.round(pixel.data[i] * (2 ** n - 1)) / (2 ** n - 1);
            }
            newPx.clamp();
            image.setPixel(x, y, newPx);

            const error = pixel.minus(newPx);
            let neighbor;
            if (x !== image.width - 1) {
                neighbor = image.getPixel(x + 1, y);
                image.setPixel(x + 1, y, neighbor.plus(error.multipliedBy(7 / 16)));
            }
            if (y !== image.height - 1) {
                if (x !== 0) {
                    neighbor = image.getPixel(x - 1, y + 1);
                    image.setPixel(x - 1, y + 1, neighbor.plus(error.multipliedBy(3 / 16)));
                }
                neighbor = image.getPixel(x, y + 1);
                image.setPixel(x, y + 1, neighbor.plus(error.multipliedBy(5 / 16)));
                if (x !== image.width - 1) {
                    neighbor = image.getPixel(x + 1, y + 1);
                    image.setPixel(x + 1, y + 1, neighbor.plus(error.multipliedBy(1 / 16)));
                }
            }
        }
    }
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('floydFilter is not implemented yet');
    return image;
};

// Apply ordered dithering to the image. We recommend using the pattern from the
// examples page and precept slides.
Filters.orderedFilter = function(image) {
    // convert to gray scale
    //image = Filters.grayscaleFilter(image);

    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 31 lines of code.        
    let bayer4 = [[15, 7, 13, 5], 
                [3, 11, 1, 9], 
                [12, 4, 14, 6], 
                [0, 8, 2, 10]];
    let m = bayer4.length;
    let n = 1; // number of bits
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            
            const pixel = image.getPixel(x, y);
            const newPx = new Pixel(0, 0, 0);
            for (let q = 0; q < 3; q++) {
                newPx.data[q] = Math.floor(pixel.data[q] * (2 ** n - 1)) / (2 ** n - 1);
            }
            
            let i = x % m, 
            j = y % m;
            let threshold = (bayer4[i][j] + 1) / (m ** 2 + 1);

            for (let q = 0; q < 3; q++) {
                let err = (pixel.data[q] - newPx.data[q]) * (2 ** n - 1);
                if (err >= threshold) newPx.data[q] = Math.ceil(pixel.data[q] * (2 ** n - 1)) / (2 ** n - 1);
                else newPx.data[q] = Math.floor(pixel.data[q] * (2 ** n - 1)) / (2 ** n - 1);
            }
            newPx.clamp();
            image.setPixel(x, y, newPx);
        }
    }
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('orderedFilter is not implemented yet');
    return image;
};

// Implement bilinear and Gaussian sampling (in addition to the basic point sampling).
// This operation doesn't appear on GUI and should be used as a utility function.
// Call this function from filters that require sampling (e.g. scale, rotate)
Filters.samplePixel = function(image, x, y, mode) {
    if (mode === "bilinear") {
        // ----------- STUDENT CODE BEGIN ------------
        // ----------- Our reference solution uses 21 lines of code.
        let newPx = new Pixel(0, 0, 0);
        let x1 = Math.max(0, Math.min(Math.floor(x), image.width - 1)), 
        x2 = Math.max(0, Math.min(x1 + 1, image.width - 1)),
        y1 = Math.max(0, Math.min(Math.floor(y), image.height - 1)), 
        y2 = Math.max(0, Math.min(y1 + 1, image.height - 1));
        newPx = newPx.plus(image.getPixel(x1, y1).multipliedBy((x2 - x) * (y2 - y)));
        newPx = newPx.plus(image.getPixel(x2, y1).multipliedBy((x - x1) * (y2 - y)));
        newPx = newPx.plus(image.getPixel(x1, y2).multipliedBy((x2 - x) * (y - y1)));
        newPx = newPx.plus(image.getPixel(x2, y2).multipliedBy((x - x1) * (y - y1)));
        newPx = newPx.dividedBy((x2 - x1) * (y2 - y1));
        return newPx;
        // ----------- STUDENT CODE END ------------
        //Gui.alertOnce ('bilinear sampling is not implemented yet');
    } else if (mode === "gaussian") {
        // ----------- STUDENT CODE BEGIN ------------
        // ----------- Our reference solution uses 38 lines of code.
        let sigma = 1,
        winR = 3 * sigma;
        let gSum = 0, newPx = new Pixel(0, 0, 0);
        for (let i = Math.ceil(x - winR); i <= Math.floor(x + winR); i++) {
            for (let j = Math.floor(y - winR); j <= Math.ceil(y + winR); j++) {
                let dist = dFromCenter(i, j, {x: x, y: y});
                if (dist <= winR && i >= 0 && i < image.width && j >= 0 && j < image.height) {
                    let weight = Math.exp(-(dist ** 2) / 2 * sigma ** 2);
                    gSum += weight;
                    newPx = newPx.plus(image.getPixel(i, j).multipliedBy(weight));
                }
            }
        }
        return newPx.dividedBy(gSum);
        // ----------- STUDENT CODE END ------------
        Gui.alertOnce ('gaussian sampling is not implemented yet');
    } else {
        // point sampling
        y = Math.max(0, Math.min(Math.round(y), image.height - 1));
        x = Math.max(0, Math.min(Math.round(x), image.width - 1));
        return image.getPixel(x, y);
    }
};

// Translate the image by some x, y and using a requested method of sampling/resampling
Filters.translateFilter = function(image, x, y, sampleMode) {
    // Note: set pixels outside the image to RGBA(0,0,0,0)
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 21 lines of code.
    const newImg = image.createImg(image.width, image.height);
    for (let i = 0; i < newImg.width; i++) {
        let newX = i - x;
        for (let j = 0; j < newImg.height; j++) {
            let newY = j - y;
            if (newX < 0 || newX >= image.width || newY < 0 || newY >= image.height) {
                newImg.setPixel(i, j, new Pixel("rgba(0, 0, 0, 0)"));
            } else {
                const sample = Filters.samplePixel(image, i - x, j - y, sampleMode);
                newImg.setPixel(i, j, sample);
            }
        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('translateFilter is not implemented yet');
    return image;
};

// Scale the image by some ratio and using a requested method of sampling/resampling
Filters.scaleFilter = function(image, ratio, sampleMode) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 19 lines of code.
    const newImg = image.createImg(image.width * ratio, image.height * ratio);

    for (let x = 0; x < newImg.width; x++) {
        for (let y = 0; y < newImg.height; y++) {
            const sample = Filters.samplePixel(image, x / ratio, y / ratio, sampleMode);
            newImg.setPixel(x, y, sample);
        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('scaleFilter is not implemented yet');
    return image;
};

// Rotate the image by some angle and using a requested method of sampling/resampling
Filters.rotateFilter = function(image, radians, sampleMode) {
    // Note: set pixels outside the image to RGBA(0,0,0,0)
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 29 lines of code.
    let diag = Math.sqrt(image.width ** 2 + image.height ** 2); // diagonal length
    let oldCenter = {x: Math.floor(image.width / 2), y: Math.floor(image.height / 2)};
    // dimensions of the new canvas
    let newWidth, newHeight;
    if (radians % pi <= pi / 2) {
        newWidth = Math.abs(Math.round(diag * Math.cos(Math.atan(image.height / image.width) - radians)));
        newHeight = Math.abs(Math.round(diag * Math.sin(Math.atan(image.height / image.width) + radians)));
    } else {
        newWidth = Math.abs(Math.round(diag * Math.cos(Math.atan(image.width / image.height) - radians % (pi / 2))));
        newHeight = Math.abs(Math.round(diag * Math.sin(Math.atan(image.width / image.height) + radians % (pi / 2))));
    }
    const newImg = image.createImg(newWidth, newHeight);
    let center = {x: Math.floor(newImg.width / 2), y: Math.floor(newImg.height / 2)};
    
    for (let x = 0; x < newImg.width; x++) {
        for (let y = 0; y < newImg.height; y++) {
            let dist = dFromCenter(x, y, center);
            let theta = Math.acos((x - center.x) / dist) + radians;
            let oldX, oldY;
            if (y > center.y) {
                oldX = Math.cos(-(theta-radians) + radians) * dist + oldCenter.x;
                oldY = Math.sin((theta-radians) - radians) * dist + oldCenter.y;
            } else {
                oldX = Math.cos(theta) * dist + oldCenter.x;
                oldY = -Math.sin(theta) * dist + oldCenter.y;
            }
            if (oldX < 0 || oldX >= image.width || oldY < 0 || oldY >= image.height) {
                newImg.setPixel(x, y, new Pixel(0, 0, 0, 0));
            } else {
                const sample = Filters.samplePixel(image, oldX, oldY, sampleMode);
                newImg.setPixel(x, y, sample);
            }
        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('rotateFilter is not implemented yet');
    return image;
};

// Swirl the filter about its center. The rotation of the swirl should be in linear increase
// along the radial axis up to radians
Filters.swirlFilter = function(image, radians, sampleMode) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 26 lines of code.
    let center = {x: Math.floor(image.width / 2), y: Math.floor(image.height / 2)};
    let halfDiag = 0.5 * Math.sqrt(image.width ** 2 + image.height ** 2);
    //let dimAngle = Math.atan(image.width / image.height);
    const newImg = image.createImg(image.width, image.height);
    for(let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let dist = dFromCenter(x, y, center);
            let theta;
            if (x - center.x >= 0) {
                theta = Math.atan((y - center.y) / (x - center.x));
            } else {
                theta = Math.atan((y - center.y) / (x - center.x)) + pi;
            }
            let oldTheta = theta - dist / halfDiag * radians;
            let oldX = Math.cos(oldTheta) * dist + center.x;
            let oldY = Math.sin(oldTheta) * dist + center.y;
            if (oldX < 0 || oldX >= image.width || oldY < 0 || oldY >= image.height) {
                //newImg.setPixel(x, y, new Pixel(0, 0, 0));
                oldY = Math.max(0, Math.min(oldY, image.height - 1));
                oldX = Math.max(0, Math.min(oldX, image.width - 1)); 
            }
            const sample = Filters.samplePixel(image, oldX, oldY, sampleMode);
            newImg.setPixel(x, y, sample);
        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('swirlFilter is not implemented yet');
    return image;
};

// Set alpha from luminance
Filters.getAlphaFilter = function(backgroundImg, foregroundImg) {
    for (let i = 0; i < backgroundImg.height; i++) {
        for (let j = 0; j < backgroundImg.width; j++) {
            const pixelBg = backgroundImg.getPixel(j, i);
            const pixelFg = foregroundImg.getPixel(j, i);
            const luminance =
            0.2126 * pixelFg.data[0] + 0.7152 * pixelFg.data[1] + 0.0722 * pixelFg.data[2];
            pixelBg.a = luminance;
            backgroundImg.setPixel(j, i, pixelBg);
        }
    }

    return backgroundImg;
};

// Composites the foreground image over the background image, using the alpha
// channel of the foreground image to blend two images.
Filters.compositeFilter = function(backgroundImg, foregroundImg) {
    // Assume the input images are of the same sizes.
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 14 lines of code.
    for (let x = 0; x < backgroundImg.width; x++) {
        for (let y = 0; y < backgroundImg.height; y++) {
            const fg = foregroundImg.getPixel(x, y);
            const bg = backgroundImg.getPixel(x, y);
            for (let i = 0; i < 3; i++) {
                bg.data[i] = blend(bg.data[i], fg.data[i], fg.a);
            }
            backgroundImg.setPixel(x, y, bg);
        }
    }
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('compositeFilter is not implemented yet');
    return backgroundImg;
};

// Morph two images according to a set of correspondance lines
Filters.morphFilter = function(initialImg, finalImg, alpha, sampleMode, linesFile) {
    const lines = Parser.parseJson("images/" + linesFile);

    // The provided linesFile represents lines in a flipped x, y coordinate system
    //  (i.e. x for vertical direction, y for horizontal direction).
    // Therefore we first fix the flipped x, y coordinates here.
    for (let i = 0; i < lines.initial.length; i++) {
        [lines.initial[i].x0, lines.initial[i].y0] = [lines.initial[i].y0, lines.initial[i].x0];
        [lines.initial[i].x1, lines.initial[i].y1] = [lines.initial[i].y1, lines.initial[i].x1];
        [lines.final[i].x0, lines.final[i].y0] = [lines.final[i].y0, lines.final[i].x0];
        [lines.final[i].x1, lines.final[i].y1] = [lines.final[i].y1, lines.final[i].x1];
    }

    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 114 lines of code.
    //console.log(lines); // {final(array10), initial(array10)}
    let p = 0.5, a = 0.01, b = 2;
    // Interpolate morph lines 
    const currentLines = new Array(lines.initial.length);
    for (let i = 0; i < lines.initial.length; i++) {
        currentLines[i] = {x0: blend(lines.initial[i].x0, lines.final[i].x0, alpha),
                        y0: blend(lines.initial[i].y0, lines.final[i].y0, alpha),
                        x1: blend(lines.initial[i].x1, lines.final[i].x1, alpha),
                        y1: blend(lines.initial[i].y1, lines.final[i].y1, alpha)};
    }
    // warp background image
    //const initialTemp = initialImg.createImg(initialImg.width, initialImg.height);
    let image = finalImg.createImg(finalImg.width, finalImg.height);
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const currentPx = {x: x, y: y}; // X(x, y)
            // warp background image
            let src = warp(currentPx, currentLines, lines.initial, p, a, b);
            let srcPx = Filters.samplePixel(initialImg, src.x, src.y, sampleMode);
            // warp foreground image
            let dst = warp(currentPx, currentLines, lines.final, p, a, b);
            let dstPx = Filters.samplePixel(finalImg, dst.x, dst.y, sampleMode);

            // blend two images
            let blended = new Pixel(0, 0, 0);
            for (let i = 0; i < 3; i++) {
                blended.data[i] = blend(srcPx.data[i], dstPx.data[i], alpha);
            }
            image.setPixel(x, y, blended);

        }
    }
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('morphFilter is not implemented yet');
    return image;
};

// helper function for warping
function warp(currentPx, currentLines, srcLines, p, a, b) {
    let dSum = {x: 0, y: 0}, 
        weightSum = 0;
    for (let i = 0; i < currentLines.length; i++) {
        let currentP = {x: currentLines[i].x0, y: currentLines[i].y0},
            currentQ = {x: currentLines[i].x1, y: currentLines[i].y1};

        let oldP = {x: srcLines[i].x0, y: srcLines[i].y0},
            oldQ = {x: srcLines[i].x1, y: srcLines[i].y1};

        let pqLength = (currentQ.x - currentP.x) ** 2 + (currentQ.y - currentP.y) ** 2;
                //let u = dot(vMinus(currentP, currentPx), vMinus(currentP, currentQ)) / norm(currentP, currentQ) ** 2);
        let u = dot(vMinus(currentP, currentPx), vMinus(currentP, currentQ)) / pqLength;

        pqLength = Math.sqrt(pqLength);
        let v = dot(vMinus(currentP, currentPx), perpendicular(vMinus(currentP, currentQ))) / pqLength;

        let oldLength = Math.sqrt((oldQ.x - oldP.x) ** 2 + (oldQ.y - oldP.y) ** 2);
        let oldPx = vPlus(oldP, vMultiply(vMinus(oldP, oldQ), u));
        oldPx = vPlus(oldPx, vMultiply(perpendicular(vMinus(oldP, oldQ)), v / oldLength));
                //oldPx = vPlus(oldPx, vDivide(vMultiply(perpendicular(vMinus(oldP, oldQ)), v), oldLength));

        let dspl = vMinus(currentPx, oldPx); // displacement

        let dist = 0;
        if (u < 0) dist = Math.sqrt((currentPx.x - currentP.x) * (currentPx.x - currentP.x) + (currentPx.y - currentP.y) * (currentPx.y - currentP.y));
        else if (u > 0) dist = Math.sqrt((currentPx.x - currentQ.x) * (currentPx.x - currentQ.x) + (currentPx.y - currentQ.y) * (currentPx.y - currentQ.y));
        else dist = Math.abs(v);
                
        let weight = Math.pow(Math.pow(pqLength, p) / (a + dist), b);
                //dSum = vPlus(dSum, vMultiply(oldPx, weight));
        dSum = vPlus(dSum, vMultiply(dspl, weight));
        weightSum += weight;
    }

    const refPx = vPlus(currentPx, vDivide(dSum, weightSum));
    return refPx;
}

// Use k-means to extract a pallete from an image
Filters.paletteFilter = function(image, colorNum) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 89 lines of code.
    const newImg = image.createImg(Math.round(image.width + image.height / 6), image.height);
    let iteration = 50; // number of iterations before converges
    const means = new Array(colorNum);
    const clusters = new Array(colorNum);
    // random initialization
    for (let k = 0; k < colorNum; k++) {
        clusters[k] = new Array();
        means[k] = new Pixel();
        let xTemp = Math.round(Math.random() * (image.width - 1));
        let yTemp = Math.round(Math.random() * (image.height - 1));
        means[k] = image.getPixel(xTemp, yTemp);
    }
    // Lloyd's algorithm
    for (let i = 0; i < iteration; i++) {

        // Assignment
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                const pixel = image.getPixel(x, y);
                let shortest = Infinity, assignment = 0;
                for (let k = 0; k < clusters.length; k++) {
                    let dist = colorDist(pixel, means[k]);
                    if (dist < shortest) {
                        shortest = dist;
                        assignment = k;
                    }
                }
                clusters[assignment].push({x: x, y: y});
            }
        }
        // Update means 
        for (let k = 0; k < clusters.length; k++) {
            let cSum = new Pixel(0, 0, 0);
            for (let n = 0; n < clusters[k].length; n++) {
                cSum = cSum.plus(image.getPixel(clusters[k][n].x, clusters[k][n].y));
            }
            means[k] = cSum.dividedBy(clusters[k].length);
            means[k].clamp();
            clusters[k] = new Array();
        }
    }
    // print on right of the image
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            newImg.setPixel(x, y, image.getPixel(x, y));
        }
    }
    let k = -1;
    for (let y = 0; y < newImg.height; y++) {
        if (y % (newImg.width - image.width) === 0) k++;
        for (let x = image.width; x < newImg.width; x++) {
            if (k >= colorNum) newImg.setPixel(x, y, new Pixel(255, 255, 255));
            else newImg.setPixel(x, y, means[k]);
        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('paletteFilter is not implemented yet');
    return image;
};

// Read the following paper and implement your own "painter":
//      http://mrl.nyu.edu/publications/painterly98/hertzmann-siggraph98.pdf
Filters.paintFilter = function(image, value) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 59 lines of code.
    const newImg = image.createImg(image.width, image.height);
    let strokeR = Math.round(value * 10);
    let color;
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            if ((x % strokeR === 0) && (y % strokeR === 0)) {
                color = image.getPixel(x, y);
                for (let i = 0; i < strokeR; i++) {
                    for (let j = 0; j < strokeR; j++) {
                        newImg.setPixel(x + i, y + j, color);
                    }
                }
            }
            //newImg.setPixel(x, y, color);
        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('paintFilter is not implemented yet');
    return image;
};

/*
* Read this paper for background on eXtended Difference-of-Gaussians:
*      http://www.cs.princeton.edu/courses/archive/spring19/cos426/papers/Winnemoeller12.pdf
* Read this paper for an approach that develops a flow field based on a bilateral filter
*      http://www.cs.princeton.edu/courses/archive/spring19/cos426/papers/Kang09.pdf
*/
Filters.xDoGFilter = function(image, value) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 70 lines of code.
    const newImg = image.createImg(image.width, image.height);
    const sigma1 = 1, sigma2 = 1.6 * sigma1;
    const winR1 = Math.round(sigma1 * 3), winR2 = Math.round(sigma2 * 3);

    image = Filters.grayscaleFilter(image);

    // 1 dimensional loop 1
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let newPx1 = new Pixel(0, 0, 0),
            newPx2 = new Pixel(0, 0, 0);

            let yMin1 = y - winR1, yMax1 = y + winR1;
            let yMin2 = y - winR2, yMax2 = y + winR2;

            for (let i = yMin1; i <= yMax1; i++) {
                let dist = Math.abs(i - y);
                let g = Math.exp(- (dist ** 2) / (2 * sigma1 ** 2)) / Math.sqrt(2 * pi * sigma1 ** 2);
                let realY;
                if (i < 0) realY = image.height + i;
                else if (i >= image.height) realY = i - image.height;
                else realY = i;
                newPx1 = newPx1.plus(image.getPixel(x, realY).multipliedBy(g));
            }
            for (let i = yMin2; i <= yMax2; i++) {
                let dist = Math.abs(i - y);
                let g = Math.exp(- (dist ** 2) / (2 * sigma2 ** 2)) / Math.sqrt(2 * pi * sigma2 ** 2);
                let realY;
                if (i < 0) realY = image.height + i;
                else if (i >= image.height) realY = i - image.height;
                else realY = i;
                newPx2 = newPx2.plus(image.getPixel(x, realY).multipliedBy(g));
            }
            //if (x === 300 && y === 200) console.log(newPx1.minus(newPx2));
            newImg.setPixel(x, y, newPx1.minus(newPx2).multipliedBy(1000000));
        }
    }
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            let newPx1 = new Pixel(0, 0, 0), newPx2 = new Pixel(0, 0, 0);

            let xMin1 = x - winR1, xMax1 = x + winR1;
            let xMin2 = x - winR2, xMax2 = x + winR2;
            for (let i = xMin1; i <= xMax1; i++) {
                let dist = Math.abs(i - x);
                let g = Math.exp(- (dist ** 2) / (2 * sigma1 ** 2)) / Math.sqrt(2 * pi * sigma1 ** 2);
                let realX;
                if (i < 0) realX = image.width + i;
                else if (i >= image.width) realX = i - image.width;
                else realX = i;
                newPx1 = newPx1.plus(newImg.getPixel(realX, y).multipliedBy(g));
            }
            for (let i = xMin2; i <= xMax2; i++) {
                let dist = Math.abs(i - x);
                let g = Math.exp(- (dist ** 2) / (2 * sigma2 ** 2)) / Math.sqrt(2 * pi * sigma2 ** 2);
                let realX;
                if (i < 0) realX = image.width + i;
                else if (i >= image.width) realX = i - image.width;
                else realX = i;
                newPx2 = newPx2.plus(newImg.getPixel(realX, y).multipliedBy(g));
            }
            //console.log(newPx1, newPx2);
            newImg.setPixel(x, y, newPx1.minus(newPx2).multipliedBy(1000000));
        }
    }
    image = newImg;
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('xDoGFilter is not implemented yet');
    return image;
};


// Construct the flow field
function flowField(image, value) {
    let mu = 1.5;
    // optional: gaussian blurred

    let newImg = image.createImg(image.width, image.height);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixel = image.getPixel(x, y);
            let newPx = new Pixel(0, 0, 0);
            let weights = new Array(2 * winR + 1);
            for (let i = 0; i < weights.length; i++) {
                weights[i] = new Array(2 * winR + 1);
            }
            let wSum = 0;

            for (let i = -winR; i <= winR; i++) {
                for (let j = -winR; j <= winR; j++) {
                    // border conditions
                    let newX, newY;
                    if (x + i < 0) newX = image.width + x + i;
                    else if (x + i >= image.width) newX = x + i - image.width;
                    else newX = x + i;
                    if (y + j < 0) newY = image.height + y + j;
                    else if (y + j >= image.height) newY = y + j - image.height;
                    else newY = y + j;

                    let neighbor = image.getPixel(newX, newY);
                    let colorDist = Math.sqrt((pixel.data[0] * (l - 1) - neighbor.data[0] * (l - 1)) ** 2 + (pixel.data[1] * (l - 1) - neighbor.data[1] * (l - 1)) ** 2 + (pixel.data[2] * (l - 1) - neighbor.data[2] * (l - 1)) ** 2);
                    let w = Math.exp(-(i ** 2 + j ** 2) / (2 * sigmaS ** 2) - (colorDist ** 2) / (2 * sigmaR ** 2));
                    weights[i + winR][j + winR] = w;
                    wSum += w;
                    }
            }
            for (let i = -winR; i <= winR; i++) {
                for (let j = -winR; j <= winR; j++) {
                    weights[i + winR][j + winR] /= wSum;

                    let newX, newY;
                    if (x + i < 0) newX = image.width + x + i;
                    else if (x + i >= image.width) newX = x + i - image.width;
                    else newX = x + i;
                    if (y + j < 0) newY = image.height + y + j;
                    else if (y + j >= image.height) newY = y + j - image.height;
                    else newY = y + j;

                    let neighbor = image.getPixel(newX, newY);
                    newPx = newPx.plus(neighbor.multipliedBy(weights[i + winR][j + winR]));
                }
            }
            newImg.setPixel(x, y, newPx);
        }
    }
    image = newImg;

}

// Compute gradient map with sobel operation
function gradientMap(image) {
    // discard rgb information
    image = Filters.grayscaleFilter(image);
    let imageData = image.getImageData();

    //const grad_x = [], grad_Y = [];
    const result = Sobel(imageData);
    console.log(result);
    //const sobelData = result[0];
    const sobelData = result;
    //let grad_x = result[1];
    //let grad_y = result[2];
    //console.log(sobelData, grad_x, grad_y);

    //grad_x = Sobel(imageData);
    const sobelImg = new Image(image.width, image.height, sobelData);
    return sobelImg;
}

function sobelKernel(image) {
    var kernelX = [
        [-1,0,1],
        [-2,0,2],
        [-1,0,1]
      ];
  
    var kernelY = [
        [-1,-2,-1],
        [0,0,0],
        [1,2,1]
      ];

    image = Filters.grayscaleFilter(image);

    var grad_x = new Array(image.width), 
    grad_y = new Array(image.width);
    let gradientMag = new Array(image.width),
    flow = new Array(image.width);

    for (let i = 0; i < image.width; i++) {
      grad_x[i] = new Array(image.height).fill(0);
      grad_y[i] = new Array(image.height).fill(0);
      gradientMag[i] = new Array(image.height).fill(0);
      flow[i] = new Array(image.height).fill(0);
    }

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixelX = convolute(image, kernelX, x, y);
            //if (x === 0 && y === 98) console.log(pixelX);
            grad_x[x][y] = pixelX.data[0];
            const pixelY = convolute(image, kernelY, x, y);
            //if (x === 0 && y === 98) console.log(pixelY);
            grad_y[x][y] = pixelY.data[0];
            //gradientMag[x][y] = Math.sqrt(grad_x[x][y] ** 2 + grad_y[x][y] ** 2);
            let magnitude = Math.sqrt(pixelX.data[0] ** 2 + pixelY.data[0] ** 2);
            //if (x === 0 && y === 98) console.log(magnitude);
            gradientMag[x][y] = magnitude;
            //if (x === 0 && y === 98) console.log(pixelX.data[0]/magnitude);
            //if (x === 0 && y === 98) console.log(pixelY.data[0]/magnitude);
            let temp = {x: pixelX.data[0]/magnitude, y: pixelY.data[0]/magnitude};
            /*if (temp.x < -1) console.log("x < -1");
            if (temp.x > 1) console.log("x > 1");
            if (temp.y < -1) console.log("y < -1");
            if (temp.y > 1) console.log("y > 1");*/
            /*if (isNaN(pixelX.data[0])) console.log("x nan");
            if (isNaN(pixelY.data[0])) console.log("x nan");
            if (magnitude === 0) console.log(pixelX.data[0], pixelY.data[0]);
            if (magnitude === 0 && pixelX.data[0] < -1) console.log("x > 1");
            if (magnitude === 0 && pixelY.data[0] < -1) console.log("y > 1");*/
            //if (isNaN(temp.x)) console.log("x nan");
            //if (isNaN(temp.y)) console.log("y nan");
            //if (x === 0 && y === 98) console.log(temp);
            if (magnitude === 0) flow[x][y] = {x: pixelX.data[0], y: pixelY.data[0]};
            else flow[x][y] = {x: pixelX.data[0]/magnitude, y: pixelY.data[0]/magnitude};
            //if (flow[x][y] === NaN) console.log("NaN");
        }
    }
    //return [grad_x, grad_y, gradientMag, flow];
    //console.log(flow);
    //console.log(flow[580][380]);
    //console.log(grad_x);
    //console.log(grad_y);
    return [flow, gradientMag];
}

function rotateFlow(flow, theta) {
    theta = theta / 180 * pi;
    for(let x = 0; x < flow.length; x++) {
        for (let y = 0; y < flow[0].length; y++) {
            let v = flow[x][y];
            let rx = v.x * Math.cos(theta) - v.y * Math.sin(theta);
            let ry = v.y * Math.cos(theta) + v.x * Math.sin(theta);
            flow[x][y] = {x: rx, y: ry};
        }
    }
    return flow;
}

function refineFlow(image, flow, gradientMag, kernel) {
    //console.log(flow);
    //console.log(flow[580][380]);
    let refined = new Array(flow.length);
    for (let i = 0; i < flow.length; i++) {
        refined[i] = new Array(flow[0].length).fill(0);
    }
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            //flow = computeNewVector(image, flow, gradientMag, x, y, kernel, "row");
            refined[x][y] = computeNewVector(image, flow, gradientMag, x, y, kernel, "row");
        }
    }
    flow = refined;
    //console.log("1d convolve completed");
    //console.log(flow[580][380]);
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            //flow = computeNewVector(image, flow, gradientMag, x, y, kernel, "column");
            refined[x][y] = computeNewVector(image, flow, gradientMag, x, y, kernel, "column");
        }
    }
    flow = refined;
    //console.log("2d convolve completed");
    //console.log(flow[580][380]);
    return flow;
}

function computeNewVector(image, flow, gradientMag, x, y, kernel, orientation) {
    //console.log(flow[x][y]);
    //console.log(flow);
    let t_x = flow[x][y];
    let t_new = {x: 0, y: 0};
    let wSum = 0;
    if (orientation == "row") {
        for (let r = x - kernel; r <= x + kernel; r++) {
            if (r < 0 || r >= image.width) continue;
            let t_y = flow[r][y];
            let phi = computePhi(t_x, t_y);
            let a = {x: x, y: y}, b = {x: r, y: y};
            let w_s = computeWs(a, b, kernel);
            let w_m = computeWm(gradientMag[x][y], gradientMag[r][y]);
            let w_d = computeWd(t_x, t_y);
            let weight = phi * w_s * w_m * w_d;
            //t_new = vPlus(t_new, vMultiply(t_y, phi * w_s * w_m * w_d));
            t_new = vPlus(t_new, vMultiply(t_y, weight));
            wSum += weight;
            //debugger;
        }
    } else {
        for (let c = y - kernel; c <= y + kernel; c++) {
            if (c < 0 || c >= image.height) continue;
            let t_y = flow[x][c];
            let phi = computePhi(t_x, t_y);
            let a = {x: x, y: y}, b = {x: x, y: c};
            let w_s = computeWs(a, b, kernel);
            let w_m = computeWm(gradientMag[x][y], gradientMag[x][c]);
            let w_d = computeWd(t_x, t_y);
            let weight = phi * w_s * w_m * w_d;
            //t_new = vPlus(t_new, vMultiply(t_y, phi * w_s * w_m * w_d));
            t_new = vPlus(t_new, vMultiply(t_y, weight));
            wSum += weight;
        }
    }
    let magnitude = Math.sqrt(t_new.x ** 2 + t_new.y ** 2);
    t_new = vDivide(t_new, magnitude);
    //t_new = vDivide(t_new, wSum);
    //debugger;
    //flow[x][y] = t_new;
    //return flow;
    return t_new;
}

function computePhi(t_x, t_y) {
    if (dot(t_x, t_y) > 0) return 1;
    else return -1;
}

function computeWs(a, b, r) {
    if (dFromCenter(b.x, b.y, a) < r) return 1;
    else return 0;
}

function computeWm(gradmag_x, gradmag_y) {
    let wm = (1 + Math.tanh(gradmag_y - gradmag_x)) / 2;
    return wm;
}

function computeWd(t_x, t_y) {
    return Math.abs(dot(t_x, t_y));
}

/*function draw_flow(image, flow) {
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const fl = flow[x][y];
            let end = {x: Math.round(x + 5 * fl.x), y: Math.round(y + 5 * fl.y)};
            let temp = {x: x, y: y};
            image.setPixel(temp.x, temp.y, new Pixel(0, 0, 0));
            while (temp.x !== end.x || temp.y !== end.y) {
                image.setPixel(Math.round(temp.x + fl.x), Math.round(temp.y + fl.y), new Pixel(0, 0, 0));
                temp.x += fl.x;
                temp.y += fl.y;
            }
        }
    }
    return image;
}*/

// sigma_m: determines winR along flow; sigma_c: determines winR along gradient
function fDoG(image, flow, sigma_m, sigma_c) {
    //const sigma_s = 1.6 * sigma_c;
    const sigma_s = 3 * sigma_c;
    const winR_m = Math.round(sigma_m * 3), winR_c = Math.round(sigma_c * 3), winR_s = Math.round(sigma_s * 3);
    const rho = 0.99; // controls noises
    let h_g = new Array(flow.length), h_e = new Array(flow.length);
    for (let i = 0; i < flow.length; i++) {
        h_g[i] = new Array(flow[0].length).fill(0); // temp value for phase 1
        h_e[i] = new Array(flow[0].length).fill(0); // final value after phase 2
    }

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let fl = flow[x][y]; // flow vector
            let gr = {x: -fl.y, y: fl.x}; // gradient vector; perpendicular to flow vector

            // Phase 1: 1D DoG filter along the gradient direction
            for (let i = -winR_m; i <= winR_m; i++) {
                //let sampleX1 = x + i * fl.x,
                //sampleY1 = y + i * fl.y;
                let sampleX1 = Math.round(x + i * fl.x),
                sampleY1 = Math.round(y + i * fl.y);
                if (sampleX1 < 0 || sampleX1 >= image.width || sampleY1 < 0 || sampleY1 >= image.height) continue;
                let g_c = 0, g_s = 0; // sum for DoG
                let gSum_c = 0, gSum_s = 0; // accumulative weight
                
                // compute g_c
                for (let j = -winR_c; j <= winR_c; j++) {
                    let sampleX11 = Math.round(sampleX1 + j * gr.x),
                    sampleY11 = Math.round(sampleY1 + j * gr.y);
                    if (sampleX11 < 0 || sampleX11 >= image.width || sampleY11 < 0 || sampleY11 >= image.height) continue;
                    let dist = dFromCenter(sampleX11, sampleY11, {x: sampleX1, y: sampleY1});
                    let g = Math.exp(- (dist ** 2) / (2 * sigma_c ** 2)) / Math.sqrt(2 * pi * sigma_c ** 2);
                    let pixel = Filters.samplePixel(image, Math.round(sampleX11), Math.round(sampleY11), "point");
                    g_c += pixel.data[0] * g;
                    gSum_c += g;
                }
                // compute g_s
                for (let j = -winR_s; j <= winR_s; j++) {
                    let sampleX11 = Math.round(sampleX1 + j * gr.x),
                    sampleY11 = Math.round(sampleY1 + j * gr.y);
                    if (sampleX11 < 0 || sampleX11 >= image.width || sampleY11 < 0 || sampleY11 >= image.height) continue;
                    let dist = dFromCenter(sampleX11, sampleY11, {x: sampleX1, y: sampleY1});
                    let g = Math.exp(- (dist ** 2) / (2 * sigma_s ** 2)) / Math.sqrt(2 * pi * sigma_s ** 2);
                    let pixel = Filters.samplePixel(image, Math.round(sampleX11), Math.round(sampleY11), "point");
                    g_s += pixel.data[0] * g;
                    gSum_s += g;
                }
                h_g[Math.round(sampleX1)][Math.round(sampleY1)] = g_c / gSum_c - rho * g_s / gSum_s;
            }

            // Phase 2: 1D Gaussian filter along the flow direction
            let g_m = 0, gSum_m = 0;
            for (let i = -winR_m; i <= winR_m; i++) {
                //let sampleX1 = x + i * fl.x,
                //sampleY1 = y + i * fl.y;
                let sampleX1 = Math.round(x + i * fl.x),
                sampleY1 = Math.round(y + i * fl.y);
                if (sampleX1 < 0 || sampleX1 >= image.width || sampleY1 < 0 || sampleY1 >= image.height) continue;
                let dist = dFromCenter(sampleX1, sampleY1, {x: x, y: y});
                let g = Math.exp(- (dist ** 2) / (2 * sigma_m ** 2)) / Math.sqrt(2 * pi * sigma_m ** 2);
                g_m += h_g[sampleX1][sampleY1] * g;
                gSum_m += g;
            }
            h_e[x][y] = g_m / gSum_m;
        }
    }
    //console.log(h_e);
    const newImg = image.createImg(image.width, image.height);
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            if (h_e[x][y] < 0 && (1 + Math.tanh(h_e[x][y])) < 1)
            newImg.setPixel(x, y, new Pixel(0, 0, 0));
            else newImg.setPixel(x, y, new Pixel(1, 1, 1));
        }
    }
    return newImg;
}

// You can use this filter to do whatever you want, for example
// trying out some new idea or implementing something for the
// art contest.
// Currently the 'value' argument will be 1 or whatever else you set
// it to in the URL. You could use this value to switch between
// a bunch of different versions of your code if you want to
// code up a bunch of different things for the art contest.
Filters.customFilter = function(image, value) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 0 lines of code.
    const kernel = 5;
    let iteration = 2;
    //const sigma_m = 1.0, sigma_c = 0.5;
    const sigma_m = 3.0, sigma_c = 1.0;

    // initialize flow chart
    let result = sobelKernel(image);
    let flow = result[0], gradientMag = result[1];
    flow = rotateFlow(flow, 25.0);
    for (let i = 0; i < iteration; i++) {
        flow = refineFlow(image, flow, gradientMag, kernel);
    }
    //console.log("flow initialization completed");
    /*for (let i = 0; i < flow.length; i++) {
        for (let j = 0; j < flow[0].length; j++) {
            if (gradientMag[i][j] > 0.5) image.setPixel(i, j, new Pixel(0, 0, 0));
            else image.setPixel(i, j, new Pixel(1, 1, 1));
        }
    }*/

    image = fDoG(image, flow, sigma_m, sigma_c);
    //image = fDoG(image, flow, sigma_m, sigma_c);
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('customFilter is not implemented yet');
    return image;
};
