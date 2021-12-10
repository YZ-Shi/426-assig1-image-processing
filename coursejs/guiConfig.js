"use strict";

var GuiConfig = GuiConfig || {};

GuiConfig.imageNames = [
  "flower.jpg",
  "goldengate.jpg",
  "leaves.jpg",
  "woman.jpg",
  "man.jpg",
  "town.jpg",
  "mesa.jpg",
  "trump1.jpg",
  "trump2.jpg",
  "doge.jpg",
  "alpha.png",
  /*"01past.png",
  "02past.png",
  "03past.png",
  "04past.png",
  "05present.png",
  "05past.png",
  "06past.png",
  "06present.png",
  "07past.png",
  "07present.png",
  "08present.png",
  "09present.png",
  "10future.png",
  "10present.png",
  "11future.png",
  "11present.png",
  "13future.png",
  "14future.png",
  "15future.png",*/
  /*"cleanse 1-1.png",
  "cleanse 1-2.png",
  "cleanse 1-3.png",
  "cleanse 1-4.png",
  "cleanse 1-5.png",
  "cleanse 1-6.png",
  "cleanse 1-7.png",
  "cleanse 1-8.png",
  "cleanse 1-9.png",
  "cleanse 1-10.png",
  "cleanse 2-1.png",
  "cleanse 2-2.png",
  "cleanse 2-3.png",
  "cleanse 2-4.png",
  "cleanse 2-5.png",
  "cleanse 2-6.png",
  "cleanse 2-7.png",
  "cleanse 2-8.png",
  "cleanse 2-9.png",
  "cleanse 2-10.png",*/
  /*"trees1.png",
  "trees2.png",
  "trees3.png",
  "trees4.png",
  "trees5.png",
  "trees6.png",
  "trees7.png",
  "trees8.png",
  "trees9.png",
  "trees10.png",
  "trees11.png",
  "trees12.png",*/
  /*"01.jpg",
  "02.jpg",
  "03.jpg",
  "04.jpg",
  "05.jpg",
  "06.jpg",
  "07.jpg",
  "08.jpg",
  "09.jpg",
  "10.jpg",
  "11.jpg",*/
  /*"pr1.png",
  "pr2.png",
  "pr3.png",
  "pr4.png",
  "pr5.png",
  "pr6.png",*/
  /*"car1.png",
  "car2.png",
  "truck3.png",*/
  /*"four-1.png",
  "four-2.png",
  "four-3.png",*/
  /*"ear.png",
  "eyes.png",
  "hand.png",*/
  /*"future montage.png",
  "future-building.png",
  "future-building2.png",
  "future-buildings.png",
  "future-car.png",
  "future-cars.png",
  "future-lamp.png",
  "future-lamps.png",
  "future-window.png",*/
  /*"present-building.png",
  "present-gate1.png",
  "present-gate2.png",
  "present-montage.png",
  "present-plan.png",
  "present-trees.png",*/
  /*"past-deck.png",
  "past-electronic post.png",
  "past-electronic posts.png",
  "past-house1.png",
  "past-house2.png",
  "past-house3.png",
  "past-montage.png",
  "past-triple decker1.png",
  "past-triple decker2.png",
  "past-window.png",*/
  /*"back1.png",
  "back2.png",
  "back3.png",
  "back4.png",
  "back5.png",
  "end1 four.png",
  "end2 four.png",
  "feet.png",
  "feet2.png",
  "feet3.png",*/
  "matrix1.png",
  "matrix2.png",
  "matrix3.png",
  // "matrix4.png",
  /*"pondering1.png",
  "pondering2.png",
  "pondering3.png",
  "pondering4.png",
  "pondering5.png",
  "pondering6.png",
  "pondering7.png",
  "pondering8.png",
  "pondering9.png",
  "pondering10.png",
  "pondering11.png",
  "pondering12.png",
  "pondering13.png",
  "pondering14.png",
  "rotate head2.png",
  "rotate head3.png",
  "rotate head4.png",
  "rotate head5.png",
  "rotate head6.png",
  "rotate head7.png", 
  "thinking1.png" ,*/
  // "thinking2.png" ,
  // "thinking3.png" ,
  // "thinking4.png" ,
  // "thinking5.png" ,
  "end2 four.png",
  /*"thinking6.png" ,
  "walking1.png",
  "walking2.png",
  "walking3.png",
  "walking4.png",
  "walking5.png",
  "walking6.png",
  "walking7.png",
  "walking8.png",
  "walking9.png",
  "walking10.png",
  "walking11.png",
  "walking12.png",
  "walking13.png",
  "walking14.png",
  "walking15.png",
  "walking16.png",*/
  /*"future1.png",
  "future2.png",
  "future3.png",
  "future4.png",
  "pan1.png",
  "pan2.png",
  "present1.png",
  "past1.png",*/
  /*"renderTest.jpg",
  "test2.png",
  "RT lighting1.jpg",
  "RT render sequence1.jpg",
  "RT render sequence2.jpg",
  "RT render sequence3.jpg",
  "RT render texture1.jpg",
  "RT screenshot test.jpg",
  "RT screenshot test2.jpg",
  "RT screenshot test3.jpg",
  "RT screenshot test4.jpg",
  "RT screenshot test5.jpg",
  "RT screenshot test6.jpg",*/
  /*"past2.png",
  "past3.png",
  "past4.png",
  "past5.png",
  "past6.png",
  "past7.png",
  "past8.png",
  "past9.png",
  "past10.png",
  "past11.png",
  "past12.png",
  "past13.png",
  "day no tree.png",
  "day w tree.png",
  "trees1.png",
  "trees3.png",
  "folder1.png",
  "folder2.png",
  "camera1.png",
  "camera2.png",
  "camera3.png",
  "section1.png",
  "section2.png",
  "section3.png",
  "turntable1.png",
  "turntable2.png",
  "turntable3.png",
  "turntable4.png",
  "dock view.png",*/
  // "past-montage.png",
  // "present-montage.png",
  // "future montage.png",
  // "thinking1.png",
  // "folder3.png",
  // "folder4.png",
  // "folder5.png",
  // "folder6.png",
  // "folder7.png",
  // "folder8.png",
];

var sampleDropdownOptions = ["point", "bilinear", "gaussian"];
var morphLinesDropdownOptions = ["marker.json"];

GuiConfig.onInit = function() {
  // starter image, if none loaded from url
  if (Gui.historyFilters.length === 0) {
    Gui.addHistoryEntry(Gui.filterDefs[0], [GuiConfig.imageNames[0]]);
  }
};

// NOTE(drew): filter names must correspond to names of filter functions unless funcName is supplied
GuiConfig.filterDefs = [
  // GENERAL
  {
    name: "Push Image",
    folderName: undefined,
    notFilter: true,
    pushImage: true,
    paramDefs: [
      {
        name: "image name",
        defaultVal: GuiConfig.imageNames[0],
        dropdownOptions: GuiConfig.imageNames,
      },
    ],
  },
  {
    name: "Batch Mode",
    notFilter: true,
    folderName: undefined,
    applyFunc: function() {
      // TODO put url stuff here
      window.open("batch.html?" + Gui.getUrl());
    },
    paramDefs: [],
  },

  {
    name: "Animation",
    notFilter: true,
    folderName: undefined,
    applyFunc: function() {
      var enableAnimation = true;
      window.open("batch.html?" + Gui.getUrl(enableAnimation));
    },
    paramDefs: [],
  },

  {
    name: "MorphLines",
    notFilter: true,
    folderName: undefined,
    applyFunc: function() {
      // TODO put url stuff here
      var cache = Main.imageCache;
      var lastTwoImages = [];
      for (var i = cache.length - 1; i >= 0; i--) {
        if (cache[i].imageName) {
          lastTwoImages.push(cache[i].imageName);
        }
      }
      if (lastTwoImages.length >= 2) {
        window.open(
          "morphLines.html?initialFile=" +
            lastTwoImages[1] +
            "&finalFile=" +
            lastTwoImages[0] +
            "&marker=images/marker.json"
        );
      }
    },
    paramDefs: [],
  },
  // SETPIXEL OPERATIONS
  {
    name: "Fill",
    folderName: "SetPixels",
    paramDefs: [
      {
        name: "color",
        defaultVal: [0, 0, 0],
        isColor: true,
      },
    ],
  },
  {
    name: "Brush",
    folderName: "SetPixels",
    paramDefs: [
      {
        name: "radius",
        defaultVal: 10,
        sliderRange: [1, 100],
        isFloat: false,
      },
      {
        name: "color",
        defaultVal: [255, 255, 255],
        isColor: true,
      },
      {
        name: "verts",
        defaultVal: "",
        isString: true,
      },
    ],
  },
  {
    name: "Soft Brush",
    folderName: "SetPixels",
    funcName: "softBrushFilter",
    paramDefs: [
      {
        name: "radius",
        defaultVal: 10,
        sliderRange: [1, 100],
        isFloat: false,
      },
      {
        name: "color",
        defaultVal: [255, 255, 255],
        isColor: true,
      },
      {
        name: "alpha at center",
        defaultVal: 1.0,
        sliderRange: [0, 1.0],
        isFloat: true,
      },
      {
        name: "verts",
        defaultVal: "",
        isString: true,
      },
    ],
  },

  // LUMINANCE OPERATIONS
  {
    name: "Brightness",
    folderName: "Luminance",
    canAnimate: true,
    paramDefs: [
      {
        name: "brightness",
        defaultVal: 0,
        sliderRange: [-1, 1],
        isFloat: true,
      },
    ],
  },
  {
    name: "Contrast",
    folderName: "Luminance",
    canAnimate: true,
    paramDefs: [
      {
        name: "contrast",
        defaultVal: 0,
        sliderRange: [-1, 1],
        isFloat: true,
      },
    ],
  },
  {
    name: "Gamma",
    folderName: "Luminance",
    canAnimate: true,
    paramDefs: [
      {
        name: "gamma",
        defaultVal: 0,
        sliderRange: [-2, 2],
        isFloat: true,
      },
    ],
  },
  {
    name: "Vignette",
    folderName: "Luminance",
    paramDefs: [
      {
        name: "innerRadius",
        defaultVal: 0.25,
        sliderRange: [0.1, 1],
        isFloat: true,
      },
      {
        name: "outerRadius",
        defaultVal: 0.75,
        sliderRange: [0.1, 1],
        isFloat: true,
      },
    ],
  },
  {
    name: "Histogram Equalization",
    funcName: "histogramEqualizationFilter",
    folderName: "Luminance",
    paramDefs: [],
  },

  // COLOR OPERATIONS
  {
    name: "Grayscale",
    folderName: "Color",
    paramDefs: [],
  },
  {
    name: "Saturation",
    folderName: "Color",
    canAnimate: true,
    paramDefs: [
      {
        name: "saturation",
        defaultVal: 0,
        sliderRange: [-1, 1],
        isFloat: true,
      },
    ],
  },
  {
    name: "White Balance",
    funcName: "whiteBalanceFilter",
    folderName: "Color",
    paramDefs: [
      {
        name: "white",
        defaultVal: [255, 255, 255],
        isColor: true,
      },
    ],
  },
  {
    name: "Histogram Match",
    funcName: "histogramMatchFilter",
    folderName: "Color",
    numImageInputs: 2,
    paramDefs: [
      // {
      //   name: "value",
      //   defaultVal: 0.5,
      //   sliderRange: [0, 1],
      //   isFloat: true,
      // }
    ],
  },

  // FILTER OPERATIONS
  {
    name: "Gaussian",
    folderName: "Filters",
    canAnimate: true,
    paramDefs: [
      {
        name: "sigma",
        defaultVal: 4,
        sliderRange: [1, 8],
        isFloat: false,
      },
    ],
  },
  {
    name: "Sharpen",
    folderName: "Filters",
    paramDefs: [],
  },
  {
    name: "Edge",
    folderName: "Filters",
    paramDefs: [],
  },
  {
    name: "Median",
    folderName: "Filters",
    paramDefs: [
      {
        name: "window radius",
        defaultVal: 1,
        sliderRange: [1, 6],
        isFloat: false,
      },
    ],
  },
  {
    name: "Bilateral",
    folderName: "Filters",
    paramDefs: [
      {
        name: "sigmaR",
        defaultVal: 1,
        sliderRange: [1, 6],
        isFloat: false,
      },
      {
        name: "sigmaS",
        defaultVal: 1,
        sliderRange: [1, 18],
        isFloat: false,
      },
    ],
  },

  // DITHERING OPERATIONS
  {
    name: "Quantize",
    folderName: "Dithering",
    paramDefs: [],
  },
  {
    name: "Random",
    folderName: "Dithering",
    paramDefs: [],
  },
  {
    name: "Floyd-Steinberg",
    funcName: "floydFilter",
    folderName: "Dithering",
    paramDefs: [],
  },
  {
    name: "Ordered",
    folderName: "Dithering",
    paramDefs: [],
  },

  // RESAMPLING OPERATIONS

  // TODO: figure out how to handle sampling dropdown
  {
    name: "Scale",
    folderName: "Resampling",
    paramDefs: [
      {
        name: "ratio",
        defaultVal: 1,
        sliderRange: [0.1, 3],
        isFloat: true,
      },
      {
        name: "sampleMode",
        defaultVal: sampleDropdownOptions[0],
        dropdownOptions: sampleDropdownOptions,
      },
    ],
  },
  {
    name: "Translate",
    folderName: "Resampling",
    paramDefs: [
      {
        name: "x",
        defaultVal: 0,
        sliderRange: [-600, 600],
        isFloat: false,
      },
      {
        name: "y",
        defaultVal: 0,
        sliderRange: [-600, 600],
        isFloat: false,
      },
      {
        name: "sampleMode",
        defaultVal: sampleDropdownOptions[0],
        dropdownOptions: sampleDropdownOptions,
      },
    ],
  },
  {
    name: "Rotate",
    folderName: "Resampling",
    paramDefs: [
      {
        name: "radians",
        defaultVal: 1,
        sliderRange: [0, Math.PI * 2],
        isFloat: true,
      },
      {
        name: "sampleMode",
        defaultVal: sampleDropdownOptions[0],
        dropdownOptions: sampleDropdownOptions,
      },
    ],
  },
  {
    name: "Swirl",
    folderName: "Resampling",
    canAnimate: true,
    paramDefs: [
      {
        name: "radians",
        defaultVal: 1,
        sliderRange: [0, Math.PI * 2],
        isFloat: true,
      },
      {
        name: "sampleMode",
        defaultVal: sampleDropdownOptions[0],
        dropdownOptions: sampleDropdownOptions,
      },
    ],
  },

  // COMPOSITE OPERATIONS
  {
    name: "Get Alpha",
    funcName: "getAlphaFilter",
    folderName: "Composite",
    numImageInputs: 2,
    paramDefs: [],
  },
  {
    name: "Composite",
    folderName: "Composite",
    numImageInputs: 2,
    paramDefs: [],
  },
  {
    name: "Morph",
    folderName: "Composite",
    numImageInputs: 2,
    canAnimate: true,
    paramDefs: [
      {
        name: "alpha",
        defaultVal: 0.5,
        sliderRange: [0, 1],
        isFloat: true,
      },
      {
        name: "sampleMode",
        defaultVal: sampleDropdownOptions[0],
        dropdownOptions: sampleDropdownOptions,
      },
      {
        name: "linesFile",
        defaultVal: morphLinesDropdownOptions[0],
        dropdownOptions: morphLinesDropdownOptions,
      },
    ],
  },

  // MISC OPERATIONS
  {
    name: "Palette",
    folderName: "Misc",
    paramDefs: [
      {
        name: "num colors",
        defaultVal: 3,
        sliderRange: [1, 6],
        isFloat: false,
      },
    ],
  },
  {
    name: "Paint",
    folderName: "Misc",
    paramDefs: [
      {
        name: "input value",
        defaultVal: 0.5,
        sliderRange: [0, 1],
        isFloat: true,
      },
    ],
  },
  {
    name: "XDoG",
    funcName: "xDoGFilter",
    folderName: "Misc",
    paramDefs: [
      {
        name: "input value",
        defaultVal: 0.5,
        sliderRange: [0, 1],
        isFloat: true,
      },
    ],
  },

  {
    name: "CustomFilter",
    funcName: "customFilter",
    folderName: "Misc",
    canAnimate: true,
    paramDefs: [
      {
        name: "input value",
        defaultVal: 0.5,
        sliderRange: [0, 1],
        isFloat: true,
      },
    ],
  },
];
