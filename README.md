# homebridge-foscam-temperature

This is a plugin for [homebridge](https://github.com/nfarina/homebridge) which makes it possible to create a temperature sensor
in HomeKit for Foscam Cameras that have temperature sensor.

# Information
The temperature is retrieved from the CGI API of Foscam Cameras.
```
/cgi-bin/CGIProxy.fcgi?cmd=getNightLightState&usr=admin&pwd=
/cgi-bin/CGIProxy.fcgi?cmd=setNightLightState&state=1&usr=admin&pwd=
```

## Example config

```json
{
  "accessory": "FoscamTemperature",
  "name": "Foscam Temperature Sensor",
  "description": "The temperature sensor from a Foscam P1 Camera",
  "hostname": "The hostname of the foscam camera",
  "port": "The port of the foscam camera",
  "username": "username of the foscam",
  "password": "password of the foscam"
}
```