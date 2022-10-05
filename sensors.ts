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

// Parameters for the RGB I2C sensor
class TCS34725 {
    public static readonly address = 0x29;
    public static readonly command = 0x80;
    public static readonly atime = TCS34725.command | 0x01;
    public static readonly control = TCS34725.command | 0x0F;
    public static readonly cdataL = TCS34725.command | 0x14;
    public static readonly cdataH = TCS34725.command | 0x15;
    public static readonly rdataL = TCS34725.command | 0x16;
    public static readonly rdataH = TCS34725.command | 0x17;
    public static readonly gdataL = TCS34725.command | 0x18;
    public static readonly gdataH = TCS34725.command | 0x19;
    public static readonly bdataL = TCS34725.command | 0x1A;
    public static readonly bdataH = TCS34725.command | 0x1B; 
    public static readonly disable = 0x00; 
    public static readonly enable_pon = 0x01;
    public static readonly enable_aen = 0x02;  
    public static readonly integrationTime_2_4ms = 0xFF;
    public static readonly integrationTime__24ms = 0xF6;
    public static readonly integrationTime__50ms = 0xEB;
    public static readonly integrationTime_101ms = 0xD5;
    public static readonly integrationTime_154ms = 0xC0;
    public static readonly integrationTime_700ms = 0x00;
    public static readonly gain__1X  = 0x00;
    public static readonly gain__4X  = 0x01;
    public static readonly gain_16X  = 0x02;
    public static readonly gain_60X  = 0x03;
}
/**
 * UMONS blocks
 */
//% weight=100 color=#bc0f74 icon="\uf043"
namespace umons {
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
                /*
                    pins.i2cWriteRegister(TCS34725.address, TCS34725.atime, TCS34725.integrationTime__24ms)
                    rgbIntegrationDelay = 30
                */
                // set integration time to 50ms
                /* */
                    pins.i2cWriteRegister(TCS34725.address, TCS34725.atime, TCS34725.integrationTime__50ms)
                    rgbIntegrationDelay = 50
                /* */
                // set gain to 1
                /*
                    pins.i2cWriteRegister(TCS34725.address, TCS34725.control, TCS34725.gain__1X)
                */
                // set gain to 4
                /* */
                    pins.i2cWriteRegister(TCS34725.address, TCS34725.control, TCS34725.gain__4X)
                /* */
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
                pins.i2cWriteRegister(TCS34725.address, TCS34725.command, TCS34725.enable_pon)
                pause(5)
                pins.i2cWriteRegister(TCS34725.address, TCS34725.command, TCS34725.enable_pon|TCS34725.enable_aen)
                pause(rgbIntegrationDelay)
                clearL = pins.i2cReadRegister(TCS34725.address, TCS34725.cdataL)
                clearH = pins.i2cReadRegister(TCS34725.address, TCS34725.cdataH)
                clearValue = (clearH <<8) | clearL
                redL = pins.i2cReadRegister(TCS34725.address, TCS34725.rdataL)
                redH = pins.i2cReadRegister(TCS34725.address, TCS34725.rdataH)
                redValue = (redH <<8) | redL
                greenL = pins.i2cReadRegister(TCS34725.address, TCS34725.gdataL)
                greenH = pins.i2cReadRegister(TCS34725.address, TCS34725.gdataH)
                greenValue = (greenH <<8) | greenL
                blueL = pins.i2cReadRegister(TCS34725.address, TCS34725.bdataL)
                blueH = pins.i2cReadRegister(TCS34725.address, TCS34725.bdataH)
                blueValue = (blueH <<8) | blueL
                pins.i2cWriteRegister(TCS34725.address, TCS34725.command, TCS34725.disable)
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
        return Math.roundWithPrecision(localIntensity, 3)
    }

    /**
     * Ask for the luminance intensity seen by the RGB sensor
     */
    //% block
    //% group="RGB"
    export function luminanceIntensity (): number {
        let luminanceValue = 0
        luminanceValue = (-0.32466*redValue) + (1.57837*greenValue) + (-0.73191*blueValue);
        return Math.round(luminanceValue)
    }
    /**
     * Ask for the Kelvin temperature seen by the RGB sensor 
     */
    //% block
    //% group="RGB"
    export function kelvinColorTemperature (): number {
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
        /* 3. Use McCamy's formula to determine the CCT*/
        nMcCamy = (xc-0.3320)/(0.1858-yc)
        /* 4. Finally, compute the CCT */
        cct = 449.0*Math.pow(nMcCamy, 3) + 3525.0*Math.pow(nMcCamy, 2) + (6823.3*nMcCamy) + 5520.33
        if (cct<0) {
            return -1
        }
        return Math.round(cct)
    }

    /*
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
    */
}