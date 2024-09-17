import { tsParticles } from "https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.0.3/+esm";
import { loadAll } from "https://cdn.jsdelivr.net/npm/@tsparticles/all@3.0.3/+esm";
import React, { useEffect, useRef } from 'react';

(async () => {
  await loadAll(tsParticles);

  await tsParticles.addPreset("lightdark", {
    fullScreen: {
      enable: true,
      zindex:-3
    },
    particles: {
      links: {
        enable: true
      },
      move: {
        enable: true
      },
      number: {
        value: 50
      },
      opacity: {
        value: { min: 0.3, max: 1 }
      },
      shape: {
        type: ["circle", "square", "triangle", "polygon"],
        options: {
          polygon: [
            {
              sides: 5
            },
            {
              sides: 6
            },
            {
              sides: 8
            }
          ]
        }
      },
      size: {
        value: { min: 1, max: 3 }
      }
    }
  });

  await tsParticles.load({
    id: "light",
    options: {
      preset: "lightdark",
      particles: {
        color: {
          value: "#000000"
        },
        links: {
          color: "#000000"
        }
      }
    }
  });

  await tsParticles.load({
    id: "dark",
    options: {
      preset: "lightdark",
      particles: {
        color: {
          value: "#FFFFFF"
        },
        links: {
          color: "#FFFFFF"
        }
      }
    }
  });
})();



const Particles = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    // Initialize particles here
    // You can use the particlesRef.current to access the container element
  }, []);

  return <div id="particles-js" ref={particlesRef} />;
};

export default Particles;
