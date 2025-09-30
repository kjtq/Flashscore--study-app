"use client";
import React, { useCallback, useMemo } from "react";
import { loadSlim } from "tsparticles-slim";
import { Particles } from "@tsparticles/react";
import type { Container, Engine } from "tsparticles-engine";

export default function BackgroundParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      // Optional: Add any initialization logic here
    },
    [],
  );

  // Memoize options to prevent re-creation
  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 30, // Reduced from default 60 for better performance
      interactivity: {
        events: {
          onClick: {
            enable: false, // Disabled for better performance
          },
          onHover: {
            enable: false, // Disabled for better performance
          },
          resize: true,
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.1, // Reduced opacity
          width: 1,
        },
        move: {
          direction: "none" as const,
          enable: true,
          outModes: {
            default: "bounce" as const,
          },
          random: false,
          speed: 1, // Reduced speed
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 1600, // Increased area = fewer particles
          },
          value: 30, // Reduced from default
        },
        opacity: {
          value: 0.2, // Reduced opacity
        },
        shape: {
          type: "circle" as const,
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: false, // Disabled for better performance
    }),
    [],
  );

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
