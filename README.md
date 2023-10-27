# Render Lizard #
A test platform to rapidly generate snapshots of render data for font validation

*Security Warning*: Render Lizard has known security limitations. The `save.php` and `save-metadata.php` scripts could be
misused to put arbitrary files into the `data` folder on your web server. Any site visitor could create or delete
results. Consider yourself warned.

![Sample image](sample.jpg)

## Similar Tools ##

**New 2020-08-19:** See Lindenberg Software's [ImageCollector](https://bitbucket.org/LindenbergSW/imagecollector/src/master/) for a more polished solution inspired by Render Lizard.

## Setup ##

Data files must at present be put into the filesystem; they cannot be uploaded by the site. Data files are a simple text file format. See the sample data file
in the folder `data/1/`.

  * The file must be called `tests.txt`.
  * Lines beginning with hash (`#`) are ignored.
  * Blank lines are ignored (including whitespace)
  * All other lines are tests.
  * `#` on a test line marks the start of a "note" that will be
    displayed in the notes column
  * Any one-word notes will be applied as a class to the test row.
  * The note `valid` has a CSS rule to make the row green.

Font suggestions can be specified for a test in the `fonts.txt` file. Each font
name should be on a separate line with `filename.ttf,facename`, one on each line.

The fonts should be included in the same folder as `fonts.txt`.

Each test should be a in a folder in the data folder. Folders names must be integer values at present.

### Running with Docker ###

You can run the site in Docker.

* Install docker (on Linux, Windows, and Mac) - https://docker.com/

* To Start: in terminal, run
  `./build.sh build start`

* To Use: in browser, go to
  http://localhost:8060/index.php?id=1

* To Stop: in terminal, run
  `./build.sh stop`

## Accessing the site ##

Load `index.php?id=<integer-test-id>` in your browser, e.g. `index.php?id=1`

## Using the renderer to do tests ##

Select the font, font size and line spacing (necessary for many Indic
languages). Then click Render. A new column will be added with a .png
file for each test word. The results are stored on the server, so
reloading the page will keep the results. This makes testing against
multiple operating systems and devices straightforward.
