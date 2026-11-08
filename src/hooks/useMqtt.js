import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Loads mqtt.js from CDN (https://unpkg.com/mqtt/dist/mqtt.min.js) if not already present on window.
 */
function getMqttLibrary() {
  if (typeof window !== 'undefined' && window.mqtt) {
    return Promise.resolve(window.mqtt);
  }
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window object not available'));
    }
    if (window.mqtt) {
      return resolve(window.mqtt);
    }
    const existing = document.querySelector('script[src*="mqtt"]');
    if (existing) {
      const handleLoad = () => {
        cleanup();
        if (window.mqtt) resolve(window.mqtt);
        else reject(new Error('window.mqtt undefined after script load'));
      };
      const handleError = (e) => {
        cleanup();
        reject(new Error('Failed to load mqtt.js from CDN: ' + (e?.message || 'network error')));
      };
      const cleanup = () => {
        existing.removeEventListener('load', handleLoad);
        existing.removeEventListener('error', handleError);
      };
      existing.addEventListener('load', handleLoad);
      existing.addEventListener('error', handleError);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/mqtt/dist/mqtt.min.js';
    script.async = true;
    script.onload = () => {
      if (window.mqtt) resolve(window.mqtt);
      else reject(new Error('window.mqtt undefined after dynamic load'));
    };
    script.onerror = () => reject(new Error('Failed to load mqtt.js from CDN'));
    document.head.appendChild(script);
  });
}

/**
 * Hook for MQTT live mode:
 * - Connects to wss://broker.hivemq.com:8884/mqtt with random clientId
 * - Subscribes to "pcc/blackoutai/data"
 * - Parses incoming JSON line: {"t":12,"mains":"LOST","dark":8,"crowd":"GRID FAULT","temp":9.5,"mins":47,"food":"EAT TODAY","cap":18}
 * - Wraps JSON.parse in try/catch and ignores malformed messages
 * - Publishes "D:<n>" to "pcc/blackoutai/cmd"
 * - Status badge: "Connecting" / "LIVE via MQTT (Wokwi sim)" / "Disconnected"
 * - Marks data STALE if no message received for 5 seconds
 * - Auto-reconnects on connection drop
 * - Fully compatible with HTTPS deployment
 */
export function useMqtt() {
  const [status, setStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected'
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastPacket, setLastPacket] = useState(null);
  const [isStale, setIsStale] = useState(false);

  const clientRef = useRef(null);
  const isManualDisconnectRef = useRef(false);
  const lastMessageTimeRef = useRef(null);
  const connectTimeRef = useRef(null);

  // Status badge value: "Connecting" / "LIVE via MQTT (Wokwi sim)" / "Disconnected"
  const statusBadge = status === 'connecting'
    ? 'Connecting'
    : status === 'connected'
    ? 'LIVE via MQTT (Wokwi sim)'
    : 'Disconnected';

  const isConnected = status === 'connected';

  // Requirement 7: Mark data "STALE" if no message for 5 s
  useEffect(() => {
    if (status !== 'connected') {
      setIsStale(false);
      return;
    }

    const checkStale = () => {
      const refTime = lastMessageTimeRef.current || connectTimeRef.current;
      if (refTime && Date.now() - refTime >= 5000) {
        setIsStale(true);
      } else {
        setIsStale(false);
      }
    };

    // Run check periodically
    const timer = setInterval(checkStale, 300);
    return () => clearInterval(timer);
  }, [status]);

  // Connect handler
  const connect = useCallback(async () => {
    if (status === 'connecting' || status === 'connected') return;

    try {
      setStatus('connecting');
      setErrorMessage(null);
      isManualDisconnectRef.current = false;

      const mqttLib = await getMqttLibrary();
      const connectFn = mqttLib.connect || mqttLib;

      // Requirement 2: Connect to wss://broker.hivemq.com:8884/mqtt with random clientId
      const randomId = 'blackoutai_' + Math.random().toString(16).substring(2, 10);
      const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';

      const options = {
        clientId: randomId,
        clean: true,
        connectTimeout: 10000,
        reconnectPeriod: 2000, // Auto-reconnect on drop (Requirement 7)
        path: '/mqtt',
      };

      console.log(`[MQTT] Connecting to ${brokerUrl} with clientId: ${randomId}`);
      const client = connectFn(brokerUrl, options);
      clientRef.current = client;

      client.on('connect', () => {
        console.log('[MQTT] Connected successfully to HiveMQ broker');
        setStatus('connected');
        setErrorMessage(null);
        connectTimeRef.current = Date.now();

        // Requirement 3: Subscribe to "pcc/blackoutai/data"
        client.subscribe('pcc/blackoutai/data', { qos: 0 }, (err) => {
          if (err) {
            console.error('[MQTT] Subscription error on pcc/blackoutai/data:', err);
            setErrorMessage('Subscription to data topic failed');
          } else {
            console.log('[MQTT] Subscribed to topic: pcc/blackoutai/data');
          }
        });
      });

      // Requirement 3 & 9: Parse messages safely with try/catch, ignore malformed
      client.on('message', (topic, payload) => {
        if (topic === 'pcc/blackoutai/data') {
          const raw = payload ? payload.toString() : '';
          const lines = raw.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const data = JSON.parse(trimmed);
              if (data && typeof data === 'object') {
                setLastPacket(data);
                lastMessageTimeRef.current = Date.now();
                setIsStale(false);
                setErrorMessage(null);
              }
            } catch (err) {
              // Requirement 9: ignore malformed messages
              console.warn('[MQTT] Ignored malformed message line:', trimmed);
            }
          }
        }
      });

      // Auto-reconnect handlers on drop (Requirement 7)
      client.on('reconnect', () => {
        console.log('[MQTT] Auto-reconnecting on connection drop...');
        if (!isManualDisconnectRef.current) {
          setStatus('connecting');
        }
      });

      client.on('close', () => {
        console.log('[MQTT] Connection closed');
        if (isManualDisconnectRef.current) {
          setStatus('disconnected');
        } else {
          // In drop state, client will auto-reconnect due to reconnectPeriod: 2000
          setStatus('connecting');
        }
      });

      client.on('offline', () => {
        console.log('[MQTT] Client went offline');
        if (!isManualDisconnectRef.current) {
          setStatus('connecting');
        }
      });

      client.on('error', (err) => {
        console.warn('[MQTT] Broker connection error:', err);
        setErrorMessage(err?.message || 'MQTT connection error');
      });

    } catch (err) {
      console.error('[MQTT] Connect error:', err);
      setStatus('disconnected');
      setErrorMessage(err?.message || 'Failed to initialize MQTT client');
    }
  }, [status]);

  // Disconnect handler
  const disconnect = useCallback(() => {
    isManualDisconnectRef.current = true;
    if (clientRef.current) {
      try {
        clientRef.current.end(true);
      } catch (err) {
        console.warn('[MQTT] Error closing client:', err);
      }
      clientRef.current = null;
    }
    setStatus('disconnected');
    setIsStale(false);
    setErrorMessage(null);
    lastMessageTimeRef.current = null;
    connectTimeRef.current = null;
  }, []);

  // Requirement 6: Publish "D:<n>" to "pcc/blackoutai/cmd"
  const sendDark = useCallback((n) => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.warn('[MQTT] Cannot send command: client not connected');
      return false;
    }

    const payload = `D:${n}`;
    clientRef.current.publish('pcc/blackoutai/cmd', payload, { qos: 0 }, (err) => {
      if (err) {
        console.error('[MQTT] Publish error on pcc/blackoutai/cmd:', err);
      } else {
        console.log(`[MQTT] Published to pcc/blackoutai/cmd: "${payload}"`);
      }
    });
    return true;
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      isManualDisconnectRef.current = true;
      if (clientRef.current) {
        clientRef.current.end(true);
        clientRef.current = null;
      }
    };
  }, []);

  return {
    isConnected,
    status,
    statusBadge,
    isStale,
    errorMessage,
    lastPacket,
    connect,
    disconnect,
    sendDark,
  };
}

