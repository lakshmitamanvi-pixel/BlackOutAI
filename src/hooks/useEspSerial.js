/**
 * Re-export useMqtt as both useMqtt and useEspSerial
 * for seamless compatibility with MQTT live mode.
 */
export { useMqtt, useMqtt as useEspSerial } from './useMqtt';
