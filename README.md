<pre>
 _____________________
&lt; Cowsay for Brackets &gt; 
 ---------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
</pre>
An extension for [Brackets](https://github.com/adobe/brackets/) to generate
a cow saying very profound and silly things.

### How to Install
1. Select **Brackets > File > Install Extension...**
2. Paste https://github.com/lkcampbell/brackets-cowsay into Extension URL field.
3. Click on the **Install** button.
4. Reload or Restart Brackets -- normally not required but this extension
needs it.

### How to Use Cowsay
Type `cowsay` and press the **Tab** key.  Enter your text into the dialog box
and click OK.

You can also add options to the `cowsay` command with an underscore character
followed by the option name. For example: `cowsay_help`. Multiple options
can also be chained together. For example, typing `cowsay_fortune_e@@_TVV` and
then pressing the **Tab** key will give you a paranoid, vampiric cow saying
a very profound and silly thing. Using an unrecognized option will insert an
error message into the document.  Using more than one underscore character
in a row (e.g. `cowsay_fortune__TU`) will insert an error message into the
document.

**Note:** Options to the far right of the chain always have the highest
priority. If two options in the chain conflict with each other, the option
on the right will have precedence. For example, the command `cowsay_p_t`
will draw a tired cow and the command `cowsay_t_p` will draw a paranoid
cow.

##### List of Current Options
**_e[text]:** Define how to draw the cow's eyes.  `[text]` can be zero, one, or
two characters to represent the cow's eyes.  For example, `_e><` will draw the
eyes shut tightly, `_eOo` will draw uneven eyes, `_e@` will draw a cyclops cow,
and `_e` will draw a cow with no eyes at all.  All characters are valid except
whitespace and the underscore.  If you want those characters you will have to
tweak your cow by hand.

**_T[text]:** Define how to draw the cow's tongue.  `[text]` can be zero, one, or
two characters to represent the cow's tongue.  For example, `_TVV` will draw the
a vampire cow, `_TW` is a cow with a forked tongue, and `_T` will draw a cow with
no tongue at all.  All characters are valid except whitespace and the underscore.
If you want those characters you will have to tweak your cow by hand.

**_b:** Draws a Borg cow.

**_d:** Draws a dead cow.

**_g:** Draws a greedy cow.

**_p:** Draws a paranoid cow.

**_s:** Draws a stoned cow.

**_t:** Draws a tired cow.

**_w:** Draws a wired cow.

**_y:** Draws a young cow.

**_fortune:** Displays a cow saying a very profound and silly thing.

**_?, _help:** Displays help for the Cowsay extension.  If this option is used,
you will not be able to enter any text and no cow will be generated.  All other
options will be ignored.

### Roadmap
Add in modal UI for user to type in text for the cow to say

Add word wrap option

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
