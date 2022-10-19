
> Open this page at [https://philippefortemps.github.io/pxt-umons-i2c-sensors/](https://philippefortemps.github.io/pxt-umons-i2c-sensors/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.adafruit.com/beta](https://makecode.adafruit.com/beta)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/philippefortemps/pxt-umons-i2c-sensors** and import

## Blocks preview

To operate the color sensor, you must
* initialize the sensor at startup
* ask the sensor to make a measurement
* exploit the available values about this measurement

![A rendered view of the blocks](https://github.com/philippefortemps/pxt-umons-i2c-sensors/raw/master/pictures/pxt-umons-i2c-sensors-demo.png)

Here, we reproduce the color measured through the leds integrated on the Playground Express module.
Note that the sensor induces a bluish color, because of the led used to illuminate the measurements. This could be taken into account in your project.

#### Metadata (used for search, rendering)

* for PXT/adafruit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
