// Add your code here

// Enumeration of accepted sensors
enum UmonsSensorEnum {
    //% block="rgb sensor"
    RGB
    /**
     * //% block="distance sensor"
     * DISTANCE
     */
    }
// Enumeration of reference colors
enum UmonsRgbEnum {
    //% block="red"
    RED,
    //% block="green"
    GREEN,
    //£ block="blue"
    BLUE
}
/**
 * UMONS blocks
 */
//% weight=100 color=#bc0f74 icon="\uf043"
namespace umons {
    const rgbSensorAddress = 0x29
    let clearValue=0, redValue=0, greenValue=0, blueValue = 0
    let rgbIntegrationDelay=0
    /**
     * Initialize a sensor connected on I2C
     * @param sensor kind of sensor connected to I2C, eg: RGB
     */
    //% block
    //% group="General"
    export function initI2cSensor (sensor:UmonsSensorEnum): void {
        switch(sensor) {
            case UmonsSensorEnum.RGB: {
                // set integration time to 24ms
                pins.i2cWriteRegister(rgbSensorAddress, 129, 246)
                // set gain to 1
                pins.i2cWriteRegister(rgbSensorAddress, 143,   0)
                // set integration delay to 50 ms
                rgbIntegrationDelay = 50
                break
            }
        }
    }
    /**
     * Read a measurement on a sensor connected on I2C
     * @param sensor kind of sensor connected to I2C, eg: RGB
     */
    //% block
    //% group="General"
    export function readI2cSensor (sensor:UmonsSensorEnum): void {
        switch(sensor) {
            case UmonsSensorEnum.RGB: {
                let clearL = 0, clearH = 0
                let redL = 0, redH = 0
                let greenL = 0, greenH = 0
                let blueL = 0, blueH = 0
                pins.i2cWriteRegister(rgbSensorAddress, 128,   1)
                pause(5)
                pins.i2cWriteRegister(rgbSensorAddress, 128,   3)
                pause(rgbIntegrationDelay)
                clearL = pins.i2cReadRegister(rgbSensorAddress, 148)
                clearH = pins.i2cReadRegister(rgbSensorAddress, 149)
                clearValue = clearH * 256 + clearL
                redL = pins.i2cReadRegister(rgbSensorAddress, 150)
                redH = pins.i2cReadRegister(rgbSensorAddress, 151)
                redValue = redH * 256 + redL
                greenL = pins.i2cReadRegister(rgbSensorAddress, 152)
                greenH = pins.i2cReadRegister(rgbSensorAddress, 153)
                greenValue = greenH * 256 + greenL
                blueL = pins.i2cReadRegister(rgbSensorAddress, 154)
                blueH = pins.i2cReadRegister(rgbSensorAddress, 155)
                blueValue = blueH * 256 + blueL
                pins.i2cWriteRegister(rgbSensorAddress, 128,   0)
                break
            }
        }
    }
    
    /**
     * Ask for one component seen by the RGB sensor 
     */
    //% block
    //% group="RGB"
    export function componentIntensity (refColor:UmonsRgbEnum): number {
        let localValue = 0, normalValue = 0
        switch (refColor) {
            case UmonsRgbEnum.RED: {
                localValue = redValue
                break
            }
            case UmonsRgbEnum.GREEN: {
                localValue = greenValue
                break
            }
            case UmonsRgbEnum.BLUE: {
                localValue = blueValue
                break
            }
            default: {
                localValue = 0
            }
        }
        normalValue = Math.round(localValue / clearValue * 255)
        return normalValue
    }

    /**
     * Ask for one component seen by the RGB sensor 
     */
    //% block
    //% group="RGB"
    export function componentPercentage (refColor:UmonsRgbEnum): number {
        let localValue = 0
        if (redValue+greenValue+blueValue==0) {
            return 0
        }
        switch (refColor) {
            case UmonsRgbEnum.RED: {
                localValue = redValue
                break
            }
            case UmonsRgbEnum.GREEN: {
                localValue = greenValue
                break
            }
            case UmonsRgbEnum.BLUE: {
                localValue = blueValue
                break
            }
            default: {
                localValue = 0
            }
        }
        return Math.round(localValue / (redValue+greenValue+blueValue))
    }

    /**
     * Ask for the red component seen by the RGB sensor 
     */
    //% block
    //% group="RGB"
    export function redComponentIntensity (): number {
        let redNormalValue = 0
        redNormalValue = Math.round(redValue / clearValue * 255)
        return redNormalValue
    }
    /**
     * Ask for the green component seen by the RGB sensor 
     */
    //% block
    //% group="RGB"
    export function greenComponentIntensity (): number {
        let greenNormalValue = 0
        greenNormalValue = Math.round(greenValue / clearValue * 255)
        return greenNormalValue
    }
    /**
     * Ask for the red component seen by the RGB sensor 
     */
    //% block
    //% group="RGB"
    export function blueComponentIntensity (): number {
        let blueNormalValue = 0
        blueNormalValue = Math.round(blueValue / clearValue * 255)
        return blueNormalValue
    }
    /**
     * Ask for the luminance intensity seen by the RGB sensor
     */
    //% block
    //% group="RGB"
    export function luminanceIntensity (): number {
        let luminanceValue = 0
        luminanceValue = (-0.32466*redValue) + (1.57837*greenValue) + (-0.73191*blueValue);
        return luminanceValue
    }
    /**
     * Ask for the Kelvin temperature seen by the RGB sensor 
     */
    //% block
    //% group="RGB"
    export function kelvinTemperature (): number {
        let X=0, Y=0, Z=0
        let xc=0,yc=0
        let nMcCamy=0
        let cct = 0
        
        if (redValue+greenValue+blueValue==0) {
            return 0
        }
        /* 1. Map RGB values to their XYZ counterparts. */
        /* Note: Y = Luminance */
        X = -0.14282*redValue + 1.54924*greenValue - 0.95641*blueValue
        Y = -0.32466*redValue + 1.57837*greenValue - 0.73191*blueValue
        Z = -0.68202*redValue + 0.77073*greenValue + 0.56332*blueValue
        /* 2. Calculate the chromacity coordinates */
        xc = X / (X+Y+Z)
        yc = Y / (X+Y+Z)
        /* 3. Use McCamy's formula to determine the CT*/
        nMcCamy = (xc-0.3320)/(0.1858-yc)
        /* 4. Finally, compute the cct */
        cct = 449.0*Math.pow(nMcCamy, 3) + 3525.0*Math.pow(nMcCamy, 2) + 6823.3*nMcCamy+5520.33
        return cct
    }
}