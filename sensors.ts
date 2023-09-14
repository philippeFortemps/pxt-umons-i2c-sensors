// Enumeration of accepted sensors
enum UmonsSensorEnum {
    //% block="color TCS34725"
    COLOR,
    //% block="distance SEN0304"
    DISTANCE
}
/**
 * UMONS blocks
 */
//% weight=100 color=#bc0f74 icon="\uf043"
namespace umons {
    /**
     * Initialize a sensor connected on I2C
     * @param sensor kind of sensor connected to I2C, eg: COLOR
     */
    //% block="initialize the $sensor I2C sensor"
    //% group="General"
    //% weight=100
    export function initI2cSensor(sensor: UmonsSensorEnum): void {
        switch (sensor) {
            case UmonsSensorEnum.COLOR: {
                tcs34725_initSensor()
                break
            }
            case UmonsSensorEnum.DISTANCE: {
                sen0304_initSensor()
                break
            }
        }
    }
    /**
     * Read a measurement on a sensor connected on I2C
     * @param sensor kind of sensor connected to I2C, eg: COLOR
     */
    //% block="make a measure on the $sensor I2C sensor"
    //% group="General"
    //% weight=40
    export function readI2cSensor(sensor: UmonsSensorEnum): void {
        switch (sensor) {
            case UmonsSensorEnum.COLOR: {
                tcs34725_readSensor()
                break
            }
            case UmonsSensorEnum.DISTANCE: {
                sen0304_readSensor()
                
            }
        }
    }
}