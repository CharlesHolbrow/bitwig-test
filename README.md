# Experimental BitWig scripts

Studying the BitWig Studio controller API.

## Install

Try this:

``` shell
$ cd "~/Documents/Bitwig Studio/Controller Scripts"
$ git clone "github.com/CharlesHolbrow/bitwig-test"
```

### More Detailed Installation Notes

According to the Controller API PDF, scripts go here:

- MacOX and Linux `~/Bitwig Studio/Controller Scripts/`
- Windows: `%USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\`

However, on my MacOS installation I had to put them in the `Documents` folder:

- MacOS `~/Documents/Bitwig Studio/Controller Scripts/`

Create a sub folder in that directory, and put your control scripts there.

Scripts must have the extension `control.js` ex: `charles.control.js`
