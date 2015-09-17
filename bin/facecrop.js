#!/usr/bin/env node

var  fs  = require('fs');
var path = require('path');
var minimist = require('minimist');
var facecrop = require('../');

function crop(opts) {

  if (opts.help || !(opts.i || opts.stdin)) usage();

  opts.outputParams = getOutputParams(opts);

  // Read image from file or stdin
  var src = opts.i ? fs.createReadStream(path.resolve(opts.i)) : process.stdin;

  // Crop the image
  facecrop(src, opts, function(err, buffer) {
    if (err) exit(err);
    var f = getOutputFileName(opts);
    var out = f ? fs.createWriteStream(f) : process.stdout;
    out.write(buffer);
    if (!opts.quiet) {
      console.error('%d bytes written to %s', buffer.length, f || 'stdout');
    }
  });
}

function getOutputParams(opts) {
  var params = {};

  // Set output format
  if (opts.png) params.ext = '.png';
  else if (opts.jpg) params.ext = '.jpg';
  else if (opts.i) params.ext = path.extname(opts.i);
  else params.ext = '.jpg';

  // Set quality
  if (params.ext == '.png') {
    params.pngQuality = parseInt(opts.png) || opts.quality || 3;
  }
  else {
    params.jpegQuality = parseInt(opts.jpg) || opts.quality || 95;
  }

  return params;
}

function getOutputFileName(opts) {
  if (opts.i && !opts.o && !opts.stdout) {
    var ext = opts.outputParams.ext;
    return f = opts.size + '-' + opts.i.replace(/\.[^.]+$/, ext);
  }
}

function usage() {
  exit('Usage: facecrop --size <width>[x<height>] -i in.jpg > out.jpg');
}

function exit(msg) {
  console.error(msg);
  process.exit(1);
}

crop(minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
    padding: 'p'
  },
  default: {
    size: '200x200',
    padding: 40
  }
}));
