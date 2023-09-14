// Enumeration of range value for the DISTANCE sensor 
enum UmonsDistanceRangeValue {
    //% block="150cm"
    Range150,
    //% block="300cm"
    Range300,
    //% block="500cm"
    Range500
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

let tempValue = 0, distValue = 0

function sen0304_initSensor(): void {
    // set mode range to AUTOMATIC 500
    umons.setDistanceSensorParameterTo(UmonsDistanceRangeValue.Range500)
}

function sen0304_readSensor(): void {
    let tempL = 0, tempH = 0
    let distL = 0, distH = 0
    tempL = pins.i2cReadRegister(SEN0304.address, SEN0304.temp_l_index)
    tempH = pins.i2cReadRegister(SEN0304.address, SEN0304.temp_h_index)
    tempValue = ((tempH << 8) | tempL) / 10
    distL = pins.i2cReadRegister(SEN0304.address, SEN0304.dist_l_index)
    distH = pins.i2cReadRegister(SEN0304.address, SEN0304.dist_h_index)
    distValue = ((distH << 8) | distL)
    if (distValue > 32767) {
        //distValue = distValue - 65536
        distValue = -1
    }
}


namespace umons {
    /**
     * Ask for the last distance measure made by the distance sensor 
     */
    //% block
    //% group="DISTANCE"
    //% weight=20
    export function measuredDistance(): number {
        return distValue
    }
    /**
     * Ask for the last temperature measure made by the distance sensor 
     */
    //% block
    //% group="DISTANCE"
    //% weight=10
    export function measuredTemperature(): number {
        return tempValue
    }
    //% block="set distance I2C sensor parameters|     > distance value to $rangeValue"
    //% group="DISTANCE"
    //% inlineInputMode=external
    //% weight=2
    export function setDistanceSensorParameterTo(rangeValue: UmonsDistanceRangeValue): void {
        switch (rangeValue) {
            case UmonsDistanceRangeValue.Range150: {
                /* */
                // set range value to 150cm in automatic mode
                pins.i2cWriteRegister(SEN0304.address, SEN0304.cfg_index, SEN0304.mode_automatic | SEN0304.rang_150)
                /* */
                break
            }
            case UmonsDistanceRangeValue.Range300: {
                /* */
                // set range value to 300cm in automatic mode
                pins.i2cWriteRegister(SEN0304.address, SEN0304.cfg_index, SEN0304.mode_automatic | SEN0304.rang_300)
                /* */
                break
            }
            case UmonsDistanceRangeValue.Range500: {
                /* */
                // set range value to 500cm in automatic mode
                pins.i2cWriteRegister(SEN0304.address, SEN0304.cfg_index, SEN0304.mode_automatic | SEN0304.rang_500)
                /* */
                break
            }
            default: {
                /* */
                // set range value to 500cm in automatic mode
                pins.i2cWriteRegister(SEN0304.address, SEN0304.cfg_index, SEN0304.mode_automatic | SEN0304.rang_500)
                /* */
            }
        }
    }
}