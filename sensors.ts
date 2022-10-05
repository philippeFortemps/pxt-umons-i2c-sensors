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
    //% block="blue"
    BLUE
}
/**
 * UMONS blocks
 */
//% weight=100 color=#bc0f74 icon="\uf043"
namespace umons {
    const rgbSensorAddress = 0x29
    let clearValue=0, redValue=0, greenValue=0, blueValue = 0
    let hValue=0, sValue=0, lValue=0
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
                //pins.i2cWriteRegister(rgbSensorAddress, 129, 0xF6)
                // set integration time to 50ms
                pins.i2cWriteRegister(rgbSensorAddress, 129, 0xEB)
                // set gain to 1
                //pins.i2cWriteRegister(rgbSensorAddress, 143, 0x00)
                // set gain to 1
                pins.i2cWriteRegister(rgbSensorAddress, 143, 0x01)
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
     * Ask for one component intensity as seen by the RGB sensor 
     */
    //% block
    //% group="RGB"
    export function componentRawIntensity (refColor:UmonsRgbEnum): number {
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
        normalValue = localValue / clearValue
        return Math.round(normalValue*255)
    }

    /**
     * Ask for one component intensity as it would be seen by a human
     */
    //% block
    //% group="RGB"
    export function componentHumanIntensity (refColor:UmonsRgbEnum): number {
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
        normalValue = localValue / clearValue
        normalValue = Math.pow(normalValue, 2.5)
        return Math.round(normalValue*255)
    }

    /**
     * Ask for one component percentage as seen by the RGB sensor 
     */
    //% block
    //% group="RGB"
    export function componentPercentage (refColor:UmonsRgbEnum): number {
        let localValue = 0.0, localIntensity = 0.0 
        if (redValue+greenValue+blueValue==0) {
            return 0
        }
        let sumValue = (redValue+greenValue+blueValue)*1.0
        switch (refColor) {
            case UmonsRgbEnum.RED: {
                localValue = redValue*1.0
                break
            }
            case UmonsRgbEnum.GREEN: {
                localValue = greenValue*1.0
                break
            }
            case UmonsRgbEnum.BLUE: {
                localValue = blueValue*1.0
                break
            }
            default: {
                localValue = 0.0
            }
        }
        localIntensity = localValue / sumValue
        return Math.round(localIntensity*1000)/1000
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

    //% block
    //% group="HSL"
    export function transformRgbToHsv(): void {
        let rd=redValue/255
        let gd=greenValue/255
        let bd=blueValue/255
        let maxd = Math.max(Math.max(rd, gd), bd) 
        let mind = Math.min(Math.min(rd, gd), bd)
        lValue = (maxd + mind) / 2
        if (maxd == mind) {
            hValue = 0
            sValue = 0 // achromatic
        } else {
            let d = maxd - mind;
            if (lValue>0.5) {
                sValue = d / (2 - maxd - mind)
            } else {
                sValue = d / (maxd+mind)
            }
            if (maxd==rd) {
                if (gd<bd) {
                    hValue = (gd - bd) / d + 6            
                } else {
                    hValue = (gd - bd) / d
                }
            } else if (maxd == gd) {
                hValue = (bd - rd) / d + 2
            } else if (maxd == bd) {
                hValue = (rd - gd) / d + 4;
            }
            hValue /= 6;
        }
    }
    //% block
    //% group="HSL"
    export function askLValue():number {
        return lValue
    }
    //% block
    //% group="HSL"
    export function askHValue():number {
        return hValue
    }
    //% block
    //% group="HSL"
    export function askSValue():number {
        return sValue
    }
}