import { GameState } from '../types/game';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  SKY_HEIGHT,
  WATER_HEIGHT,
  BOAT_WIDTH,
  BOAT_HEIGHT,
  BOAT_Y,
  FISHERMAN_WIDTH,
  FISHERMAN_HEIGHT,
} from '../utils/constants';

interface GameCanvasProps {
  gameState: GameState;
}

export function GameCanvas({ gameState }: GameCanvasProps) {
  const { fish, hazards, fishingLine, fishermanDirection } = gameState;

  // Calculate pole tip position based on fisherman direction
  const poleX = fishermanDirection === 'right' 
    ? GAME_WIDTH / 2 + 15 + FISHERMAN_WIDTH - 2
    : GAME_WIDTH / 2 - FISHERMAN_WIDTH - 15 - 2;
  const poleY = BOAT_Y; // Top of pole, not bottom

  return (
    <div
      className="relative border-8 mx-auto"
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        background: '#000',
        borderColor: '#444',
        imageRendering: 'pixelated',
      }}
    >
      {/* Sky - solid blue */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: SKY_HEIGHT,
          background: '#6B9FFF',
        }}
      />

      {/* Water - darker blue with horizontal lines */}
      <div
        className="absolute left-0 w-full"
        style={{
          top: SKY_HEIGHT,
          height: WATER_HEIGHT,
          background: '#2B5FBF',
        }}
      >
        {/* Water lines for depth effect */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 w-full"
            style={{
              top: `${(i + 1) * 6.66}%`,
              height: 1,
              background: 'rgba(107, 159, 255, 0.15)',
            }}
          />
        ))}
      </div>

      {/* Sandy floor */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: 40,
          background: '#D4A574',
        }}
      >
        {/* Coral/plant reefs - colorful, organic shapes extending into water */}
        {[
          { x: 8, w: 12, h: 50, c: '#FF6B6B', type: 'wavy' },
          { x: 22, w: 10, h: 54, c: '#4ECDC4', type: 'straight' },
          { x: 35, w: 14, h: 48, c: '#95E1D3', type: 'wavy' },
          { x: 48, w: 11, h: 52, c: '#FFD93D', type: 'straight' },
          { x: 62, w: 13, h: 49, c: '#F38181', type: 'wavy' },
          { x: 75, w: 10, h: 55, c: '#AA96DA', type: 'straight' },
          { x: 88, w: 12, h: 51, c: '#6BCB77', type: 'wavy' },
        ].map((coral, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${coral.x}%`,
              bottom: 0,
              width: coral.w,
              height: coral.h,
            }}
          >
            {coral.type === 'wavy' ? (
              // Wavy coral - multiple rounded segments
              <>
                <div
                  className="absolute bottom-0 left-0"
                  style={{
                    width: '40%',
                    height: '100%',
                    background: coral.c,
                    borderRadius: '50% 50% 0 0',
                  }}
                />
                <div
                  className="absolute bottom-0 right-0"
                  style={{
                    width: '40%',
                    height: '80%',
                    background: coral.c,
                    borderRadius: '50% 50% 0 0',
                    opacity: 0.8,
                  }}
                />
                <div
                  className="absolute bottom-0 left-1/3"
                  style={{
                    width: '30%',
                    height: '90%',
                    background: coral.c,
                    borderRadius: '50% 50% 0 0',
                    opacity: 0.9,
                  }}
                />
              </>
            ) : (
              // Straight seaweed/kelp
              <div
                className="absolute bottom-0 left-1/3 w-1/3 h-full"
                style={{
                  background: `linear-gradient(to top, ${coral.c}, transparent)`,
                  borderRadius: '2px 2px 0 0',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Boat - trapezoid shape, narrow in water, wide at top */}
      <div
        className="absolute"
        style={{
          left: GAME_WIDTH / 2 - BOAT_WIDTH / 2,
          top: BOAT_Y,
          width: BOAT_WIDTH,
          height: BOAT_HEIGHT,
        }}
      >
        {/* Boat hull - trapezoid (wide at top 10%-90%, narrow at bottom 30%-70%) */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: BOAT_HEIGHT,
            background: '#8B4513',
            clipPath: 'polygon(10% 0%, 90% 0%, 70% 100%, 30% 100%)',
          }}
        >
          {/* Boat rim - darker */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: 4,
              background: '#654321',
            }}
          />
        </div>
      </div>

      {/* Fisherman - sitting above boat top */}
      <div
        className="absolute"
        style={{
          left:
            fishermanDirection === 'right'
              ? GAME_WIDTH / 2 + 15
              : GAME_WIDTH / 2 - FISHERMAN_WIDTH - 15,
          top: BOAT_Y - 10, // Position above boat
          width: FISHERMAN_WIDTH,
          height: FISHERMAN_HEIGHT,
        }}
      >
        {/* Head */}
        <div
          className="absolute"
          style={{
            left: fishermanDirection === 'right' ? 8 : FISHERMAN_WIDTH - 16,
            top: 0,
            width: 8,
            height: 8,
            background: '#FFD4A3',
          }}
        />
        {/* Body */}
        <div
          className="absolute"
          style={{
            left: fishermanDirection === 'right' ? 5 : FISHERMAN_WIDTH - 19,
            top: 8,
            width: 14,
            height: 16,
            background: '#FF6B6B',
          }}
        />
        {/* Fishing pole */}
        <div
          className="absolute"
          style={{
            left: fishermanDirection === 'right' ? FISHERMAN_WIDTH - 2 : -2,
            top: 5,
            width: 2,
            height: 30,
            background: '#8B4513',
            transform: fishermanDirection === 'right' ? 'rotate(30deg)' : 'rotate(-30deg)',
            transformOrigin: 'top',
          }}
        />
      </div>

      {/* Fishing line from pole to hook (angled line) */}
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{ zIndex: 5 }}
      >
        <line
          x1={poleX}
          y1={poleY}
          x2={fishingLine.x}
          y2={fishingLine.y}
          stroke="#333"
          strokeWidth="2"
        />
      </svg>

      {/* Hook at end of line */}
      {!fishingLine.aboveWater && (
        <div
          className="absolute"
          style={{
            left: fishingLine.x - 2,
            top: fishingLine.y,
            width: 4,
            height: 4,
            background: '#666',
            zIndex: 10,
          }}
        />
      )}

      {/* Fish - pixel art with directional facing */}
      {fish.map((f) => {
        // Fish design naturally points LEFT (eye left, tail right)
        // When moving LEFT (velocityX < 0), don't flip
        // When moving RIGHT (velocityX > 0), flip to point right
        const shouldFlip = f.velocityX > 0;
        
        return (
          <div
            key={f.id}
            className="absolute"
            style={{
              left: f.position.x,
              top: f.position.y,
              width: f.width,
              height: f.height,
              transform: shouldFlip ? 'scaleX(-1)' : 'none',
            }}
          >
            {/* Fish body - simple rectangle */}
            <div
              className="absolute"
              style={{
                left: 0,
                top: f.height * 0.2,
                width: f.width * 0.7,
                height: f.height * 0.6,
                background:
                  f.size === 'large'
                    ? '#FF6B47'
                    : f.size === 'medium'
                    ? '#FFB347'
                    : '#FFD700',
              }}
            />
            {/* Fish tail - triangle pointing right (fish swims left) */}
            <div
              className="absolute"
              style={{
                left: f.width * 0.7,
                top: f.height * 0.3,
                width: 0,
                height: 0,
                borderLeft: `${f.width * 0.3}px solid ${
                  f.size === 'large'
                    ? '#FF6B47'
                    : f.size === 'medium'
                    ? '#FFB347'
                    : '#FFD700'
                }`,
                borderTop: `${f.height * 0.2}px solid transparent`,
                borderBottom: `${f.height * 0.2}px solid transparent`,
              }}
            />
            {/* Fish eye - small square */}
            <div
              className="absolute"
              style={{
                left: f.width * 0.15,
                top: f.height * 0.3,
                width: f.width * 0.1,
                height: f.width * 0.1,
                background: '#000',
              }}
            />
          </div>
        );
      })}

      {/* Hazards - realistic pixel art */}
      {hazards.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: h.position.x,
            top: h.position.y,
            width: h.width,
            height: h.height,
          }}
        >
          {/* Six-pack plastic rings */}
          {h.type === 'rings' && (
            <div className="relative w-full h-full">
              {/* 2 rows of 3 rings */}
              {[0, 1, 2].map((row) =>
                [0, 1].map((col) => (
                  <div
                    key={`${row}-${col}`}
                    className="absolute border-2 rounded-full"
                    style={{
                      left: `${row * 33}%`,
                      top: `${col * 50}%`,
                      width: '30%',
                      height: '45%',
                      borderColor: '#9B59B6',
                      background: 'transparent',
                    }}
                  />
                ))
              )}
            </div>
          )}

          {/* Plastic grocery bag */}
          {h.type === 'bag' && (
            <div className="relative w-full h-full">
              {/* Bag handles */}
              <div
                className="absolute left-1/4 top-0"
                style={{
                  width: '50%',
                  height: '20%',
                  borderLeft: '2px solid rgba(230, 230, 230, 0.7)',
                  borderRight: '2px solid rgba(230, 230, 230, 0.7)',
                  borderTop: '2px solid rgba(230, 230, 230, 0.7)',
                  borderRadius: '50% 50% 0 0',
                }}
              />
              {/* Bag body */}
              <div
                className="absolute left-0 w-full"
                style={{
                  top: '15%',
                  height: '85%',
                  background: 'rgba(240, 240, 240, 0.6)',
                  border: '1px solid rgba(200, 200, 200, 0.8)',
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                }}
              >
                {/* Wrinkles */}
                <div className="absolute top-1/3 left-0 w-full h-px bg-gray-400 opacity-40" />
                <div className="absolute top-2/3 left-0 w-full h-px bg-gray-400 opacity-40" />
              </div>
            </div>
          )}

          {/* Fishing net - mesh bag with handle */}
          {h.type === 'net' && (
            <div className="relative w-full h-full">
              {/* Handle - straight line at top */}
              <div
                className="absolute left-1/2 top-0"
                style={{
                  width: 2,
                  height: '25%',
                  background: '#444',
                  transform: 'translateX(-50%)',
                }}
              />
              {/* Handle grip */}
              <div
                className="absolute left-1/3 top-0"
                style={{
                  width: '34%',
                  height: '8%',
                  background: '#555',
                  borderRadius: '2px',
                }}
              />
              {/* Net mesh bag */}
              <div
                className="absolute left-0 w-full"
                style={{
                  top: '25%',
                  height: '75%',
                  background: '#666',
                  opacity: 0.7,
                  borderRadius: '0 0 40% 40%',
                }}
              >
                {/* Grid pattern for mesh */}
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 w-full bg-gray-800"
                    style={{
                      top: `${(i + 1) * 20}%`,
                      height: 1,
                    }}
                  />
                ))}
                {[0, 1, 2].map((i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 h-full bg-gray-800"
                    style={{
                      left: `${(i + 1) * 25}%`,
                      width: 1,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Fishing line (spooled rope) */}
          {h.type === 'line' && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Spool shape */}
              <div
                className="absolute"
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#4A90E2',
                  borderRadius: '20%',
                }}
              >
                {/* Wrapped line texture */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute left-0 w-full bg-blue-700"
                    style={{
                      top: `${(i + 1) * 25}%`,
                      height: 1,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
              {/* Center hole */}
              <div
                className="absolute"
                style={{
                  width: '30%',
                  height: '30%',
                  background: '#2a5a92',
                  borderRadius: '50%',
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}