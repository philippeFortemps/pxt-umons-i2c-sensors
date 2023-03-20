// Enumeration of accepted sensors
enum UmonsSensorEnum {
    //% block="color TCS34725"
    COLOR,
    //% block="distance SEN0304"
    DISTANCE
    }
// Enumeration of reference colors
enum UmonsRGBEnum {
    //% block="red"
    RED,
    //% block="green"
    GREEN,
    //% block="blue"
    BLUE
}
// Enumeration of integration time for the COLOR sensor
enum UmonsRgbIntegrationTime {
    //% block="integration time 2,4 ms"
    MS2,
    //% block="integration time 24 ms"
    MS24,
    //% block="integration time 50 ms"
    MS50,
    //% block="integration time 101 ms"
    MS101,
    //% block="integration time 154 ms"
    MS154,
    //% block="integration time 300 ms"
    MS300,
    //% block="integration time 600 ms"
    MS600
}
// Enumeration of gain value for the COLOR sensor 
enum UmonsRgbGainValue {
    //% block="and gain 1x"
    Gain1,
    //% block="and gain 4x"
    Gain4,
    //% block="and gain 16x"
    Gain16,
    //% block="and gain 60x"
    Gain60
}


// Parameters for the COLOR I2C sensor
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
    public static readonly integrationTime_101ms = 0xD6;
    public static readonly integrationTime_154ms = 0xC0;
    public static readonly integrationTime_300ms = 0x83;
    public static readonly integrationTime_600ms = 0x06;
    public static readonly gain__1X  = 0x00;
    public static readonly gain__4X  = 0x01;
    public static readonly gain_16X  = 0x02;
    public static readonly gain_60X  = 0x03;
}

// Parameters for the DISTANCE I2C sensor
class SEN0304 {
    public static readonly address = 0x11;
    public static readonly slaveaddr_index = 0;
    public static readonly pid_index = 1;
    public static readonly version_index = 2;
    public static readonly dist_h_index = 3;
    public static readonly dist_l_index = 4;
    public static readonly temp_h_index = 5;
    public static readonly temp_l_index = 6;
    public static readonly cfg_index = 7;
    public static readonly cmd_index = 8;
    public static readonly reg_num = 9;
    public static readonly mode_automatic = 0x80;
    public static readonly mode_passive = 0x00;
    public static readonly cmd_distance_measure = 0x01;
    public static readonly rang_500 = 0x20;
    public static readonly rang_300 = 0x10;
    public static readonly rang_150 = 0x00;
}
/**
 * UMONS blocks
 */
//% weight=100 color=#bc0f74 icon="\uf043"
namespace umons {
    let clearValue=0, redValue=0, greenValue=0, blueValue = 0
    let hValue=0, sValue=0, lValue=0
    let tempValue=0, distValue=0
    let colorSensorIntegrationDelay=0
    /**
     * Initialize a sensor connected on I2C
     * @param sensor kind of sensor connected to I2C, eg: COLOR
     */
    //% block
    //% group="General"
    export function initI2cSensor (sensor:UmonsSensorEnum): void {
        switch(sensor) {
            case UmonsSensorEnum.COLOR: {
                // set integration time to 24ms
                /*
                    pins.i2cWriteRegister(TCS34725.address, TCS34725.atime, TCS34725.integrationTime__24ms)
                    colorSensorIntegrationDelay = 30
                */
                // set integration time to 50ms
                /* */
                    pins.i2cWriteRegister(TCS34725.address, TCS34725.atime, TCS34725.integrationTime__50ms)
                    colorSensorIntegrationDelay = 50
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
            case UmonsSensorEnum.DISTANCE: {
                // set mode range to AUTOMATIC 500
                    pins.i2cWriteRegister(SEN0304.address, SEN0304.cfg_index, SEN0304.mode_automatic|SEN0304.rang_500)
                break
            }
        }
    }
    /**
     * Read a measurement on a sensor connected on I2C
     * @param sensor kind of sensor connected to I2C, eg: COLOR
     */
    //% block
    //% group="General"
    export function readI2cSensor (sensor:UmonsSensorEnum): void {
        switch(sensor) {
            case UmonsSensorEnum.COLOR: {
                let clearL = 0, clearH = 0
                let redL = 0, redH = 0
                let greenL = 0, greenH = 0
                let blueL = 0, blueH = 0
                pins.i2cWriteRegister(TCS34725.address, TCS34725.command, TCS34725.enable_pon)
                pause(5)
                pins.i2cWriteRegister(TCS34725.address, TCS34725.command, TCS34725.enable_pon|TCS34725.enable_aen)
                pause(colorSensorIntegrationDelay)
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
            case UmonsSensorEnum.DISTANCE: {
                let tempL=0, tempH=0
                let distL=0, distH=0
                tempL = pins.i2cReadRegister(SEN0304.address, SEN0304.temp_l_index)
                tempH = pins.i2cReadRegister(SEN0304.address, SEN0304.temp_h_index)
                tempValue = ((tempH <<8) | tempL)/10
                distL = pins.i2cReadRegister(SEN0304.address, SEN0304.dist_l_index)
                distH = pins.i2cReadRegister(SEN0304.address, SEN0304.dist_h_index)
                distValue = ((distH <<8) | distL)
                if (distValue>32767)
                {
                    distValue = distValue - 65536
                }
            }
        }
    }
    /**
     * Set the parameters for the COLOR sensor
     * @param integrationTime duration of the integration, e.g.: 50 ms
     * @param gainValue amplification gain of the sensor, e.g.: 4x
     */
    //% block
    //% group="General"
    export function setColorSensorParametersTo (integrationTime:UmonsRgbIntegrationTime, gainValue:UmonsRgbGainValue): void {
        // set integration time to 50ms
        /* */
        pins.i2cWriteRegister(TCS34725.address, TCS34725.atime, TCS34725.integrationTime__50ms)
        colorSensorIntegrationDelay = 50
        /* */
        // set gain to 1
        /*
            pins.i2cWriteRegister(TCS34725.address, TCS34725.control, TCS34725.gain__1X)
        */
        // set gain to 4
        /* */
            pins.i2cWriteRegister(TCS34725.address, TCS34725.control, TCS34725.gain__4X)
        /* */
    }

    /**
     * Ask for one component intensity as seen by the COLOR sensor 
     */
    //% block
    //% group="COLOR"
    export function colorComponentRawIntensity (refColor:UmonsRGBEnum): number {
        let localValue = 0, normalValue = 0
        switch (refColor) {
            case UmonsRGBEnum.RED: {
                localValue = redValue
                break
            }
            case UmonsRGBEnum.GREEN: {
                localValue = greenValue
                break
            }
            case UmonsRGBEnum.BLUE: {
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
    //% group="COLOR"
    export function colorComponentHumanIntensity (refColor:UmonsRGBEnum): number {
        let localValue = 0, normalValue = 0
        switch (refColor) {
            case UmonsRGBEnum.RED: {
                localValue = redValue
                break
            }
            case UmonsRGBEnum.GREEN: {
                localValue = greenValue
                break
            }
            case UmonsRGBEnum.BLUE: {
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
     * Ask for one component percentage as seen by the COLOR sensor 
     */
    //% block
    //% group="COLOR"
    export function colorComponentPercentage (refColor:UmonsRGBEnum): number {
        let localValue = 0.0, localIntensity = 0.0 
        if (redValue+greenValue+blueValue==0) {
            return 0
        }
        let sumValue = (redValue+greenValue+blueValue)*1.0
        switch (refColor) {
            case UmonsRGBEnum.RED: {
                localValue = redValue*1.0
                break
            }
            case UmonsRGBEnum.GREEN: {
                localValue = greenValue*1.0
                break
            }
            case UmonsRGBEnum.BLUE: {
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
     * Ask for the luminance intensity seen by the COLOR sensor
     */
    //% block
    //% group="COLOR"
    export function colorLuminanceIntensity (): number {
        let luminanceValue = 0
        luminanceValue = (-0.32466*redValue) + (1.57837*greenValue) + (-0.73191*blueValue);
        return Math.round(luminanceValue)
    }
    /**
     * Ask for the Kelvin temperature seen by the COLOR sensor 
     */
    //% block
    //% group="COLOR"
    export function colorKelvinTemperature (): number {
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
    /**
     * Ask for the last distance measure made by the distance sensor 
     */
    //% block
    //% group="DISTANCE"
    export function measuredDistance (): number {
        return distValue
    }
    /**
     * Ask for the last temperature measure made by the distance sensor 
     */
    //% block
    //% group="DISTANCE"
    export function measuredTemperature (): number {
        return tempValue
    }
    

}