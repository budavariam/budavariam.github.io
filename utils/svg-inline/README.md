# Svg-inline

This util can help ypu generate inline svg icons instead of manual base64 encoding calls and copy-pasting code.

The used utils can be used from command line, if you prefer. It prints the output to stdout.

    node utils/svg-inline/svg-to-base64 ./my-new-icon.svg
    node utils/svg-inline/base64-to-svg "base64string..."

## Tool

It loads the svg files from `images/svg-icons` folder, converts all svg files into a base64 string, and generates a sass-map from the result into `_sass/_svg-icons-custom.scss` file, by overwriting its previous content.

### Usage

New icon:

1. Create a 40x40 svg image into `images/svg-icons` folder. With `.svg` extension. For example: **new-icon-name.svg**
1. Add a line in `_svg-icons.scss`, the file name must be the parameter of the `custom-svg` mixin. The class name can be anything, but I advise you to use the same name to avoid confusion.
    ```scss
    &.new-icon-name { @include custom-svg('new-icon-name') }
    ```
1. Run
    ```bash
    node utils/svg-inline
    ```
1. Run `jekyll serve` to see the results.

### Links

* [Inkscape - svg editor](https://inkscape.org/)
* [Base64 encode svg files](http://b64.io)
* [Iconfinder - svg icons](https://www.iconfinder.com/)
* [Flaticon - free svg icons](https://www.flaticon.com/)