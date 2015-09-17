facecrop(1)
===========

SYNOPSIS
--------

```
facecrop --size 200x200 -i picture.jpg > face.jpg
```

DESCRIPTION
-----------

Use `facecrop` to extract a face from a full-body frontal image. If multiple
faces are detected, the one closest to the top is used.

OPTIONS
-------

* `--help, -h`
Display short usage instructions.

* `--size <width>x<height>`  
Sets the desired output image size. Defaults to `200x200`.

* `--size <size>`  
Shortcut for square images.

* `--padding <percent>`
Add padding around the face. The amount is specified as percentage of the
cropped regions width/height. Defaults to `40`.

* `--png [compression]`  
Always create a PNG image, regardless of the input file's extension.
The `compression` level defaults to `3`.

* `--jpg [quality]`  
Always create a JPEG image, regardless of the input file's extension.
The `quality` setting defaults to `95`.

* `--grayscale`
Convert the image to grayscale.

* `-i <file>`  
The input image to read. Relative paths will be resolved against the current
working directory.

* `-o <file>`  
The file to write the cropped region to. If omitted, and `-i` was used,
the file name will default to `<size>-<input-basename>.<ext>`.

* `--stdin`
Read image fom `stdin`.

* `--stdout`
Write image to `stdout`.

INSTALLATION
------------

From the [npm registry](https://npmjs.com):

`[sudo] npm install facecrop -g`

EXAMPLE
-------

* `facecrop --size 80 < me.jpg > me.png`
* `facecrop --size 400x300 --grayscale -i me.jpg -o me.png`
* `facecrop --size 400 -padding 10 -i me.jpg --png`

SEE ALSO
--------

[node-opencv](https://github.com/peterbraden/node-opencv)
[fgnass](https://twitter.com/fgnass)
