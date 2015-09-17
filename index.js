#!/usr/bin/env node

var fs = require('fs');
var cv = require('opencv');
var path = require('path');

module.exports = function(src, opts, cb) {
  src.pipe(
    new cv.ImageDataStream()
    .on('error', cb)
    .on('load', function(m) {
      // If image is larger than 10MP scale it down first
      var maxRes = 10000000;
      if (m.size() > maxRes) {
        var s = maxRes / m.size();
        m.resize(m.width() * s, m.height() * s);
      }
      m.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
        if (err) return cb(err);

        if (!faces.length) {
          return cb(new Error('No faces found in ' + opts.i || 'stream'));
        }

        // Get the topmost area
        var rect = faces.reduce(function(p, f) {
          return f.y < p.y ? f : p;
        });

        // Crop & resize
        var size = parseSize(opts.size);
        var cropped = crop(m, rect, size.width / size.height, opts.padding);
        cropped.resize(size.width, size.height);

        if (opts.grayscale && m.channels() > 1) cropped.convertGrayscale();

        cb(null, cropped.toBuffer(opts.outputParams));
      });
    })
  );
};

/**
 * Crop a region from `img` that contains `rect` and has the given `aspect`
 * ratio. Optionally enlarge the cropped area by `padding` percent.
 */
function crop(img, rect, aspect, padding) {
  var x = rect.x;
  var y = rect.y;
  var w = rect.width;
  var h = rect.height;
  var iw = img.width();
  var ih = img.height();

  if (aspect < w / h) {
    // Target is taller than source, enlarge vertically
    h = w / aspect;
    var dh = Math.abs(rect.height - h);
    y -= dh / 2;
  }
  else {
    // Target is wider than source, enlarge horizontally
    w = h * aspect;
    var dw = Math.abs(rect.width - w);
    x -= dw / 2;
  }

  // Calculate padding relative to the cropped region
  var wpad = Math.round(w * padding / 100);
  var hpad = Math.round(h * padding / 100);

  // Add padding if image is large enough
  if (w + 2 * wpad <= iw && h + 2 * hpad <= ih) {
    w += 2 * wpad;
    h += 2 * hpad;
    x -= wpad;
    y -= hpad;

    // Stay inside the image bounds
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x+w > iw) x = iw - w;
    if (y+h > ih) y = ih - h;
  }

  return img.crop(x, y, w, h);
}

/**
 * Parse <width>[x<height>]
 */
function parseSize(size) {
  var s = /^(\d+)(x(\d+))?$/.exec(size);
  return { width: s[1], height: s[3] || s[1] };
}
