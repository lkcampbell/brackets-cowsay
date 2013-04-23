# Cowsay for Brackets
An extension for [Brackets](https://github.com/adobe/brackets/) to generate
a cow saying very profound and silly things.

### How to Install
1. Select **Brackets > File > Install Extension...**
2. Paste https://github.com/lkcampbell/brackets-cowsay into Extension URL field.
3. Click on the **Install** button.

### How to Use Cowsay
Type `cowsay` then press the **Tab** key.

You can also add options to the `cowsay` command with an underscore character
followed by the option name. For example: `cowsay_help`. Using an unrecognized
option will insert an error message into the document.  Using more than one 
underscore character in a row (e.g. `cowsay___help`) will insert an error message
into the document.

##### List of Current Options
**_?, _help:** Displays help for the Cowsay extension.  If this option is used,
all other options will be ignored and no cow will be generated.

### Roadmap
Option for cow to think instead of speak

HTML option to wrap cow in `pre` tags

Options to change the cow's eyes and tongue

Option to load different animals

Option to load different files of things that the cow says

### License and Credits
MIT-licensed -- see `main.js` for details.

Based off of Fabio Crisci's [Cowsay Node Module](https://github.com/piuccio/cowsay)...

which was based off of the original Perl project by
[Tony Monroe](http://www.nog.net/~tony/): [cowsay](https://github.com/schacon/cowsay)

### Compatibility
Brackets Sprint 23 or later.
