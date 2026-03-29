[TITLE]
Fishing Derby Game

[HIGH LEVEL GOAL]
Create a pixel style Fishing Derby game interface and a fully playable Fishing Derby game. Modernize the look and include full game mechanics. Also include a built in debugging checklist and fixes for common failure points, including spawn, collision, locking, hard drop, ghost piece, rendering bounds, and React hook ordering issues. Exclude any leaderboard, high score storage, API, database, Google Sheets, Airtable, Telegram, webhook integrations, or Make automation modules.

[UI AND SIZING REQUIREMENTS]

[BOARD SIZE AND LAYOUT]
Show one person sitting on a boat in the middle of a lake with fish swimming below the boat but no lower than 50% of the available height of the water
The water will be 75% of the available height on screen with a sandy floor that includes reefs and plants
The person in the boat will have a fishing pole that extends over the edge of the boat and a line that starts above the water

[PIECES AND UI PANELS]
Below the boat, across the top 25% of the water will be fish - small, medium, and large depending on the level swimming back and forth horizontally and vertically
For the remainder of the water, there will be random hazards that are sized somewhere between the size of the small and medium fish - hazards will include plastic drink rings, plastic bags, fishing nets, discarded fishing line
Fishing pole and line held by the fishing man - the fishing line should start above the water and each item should face the right
Include a score panel with retro digital styling
Include a status display and basic controls (pause and reset are fine)

[PART 1, UI DESIGN IN FIGMA]
Design the interface in Figma with a pixel style, retro arcade aesthetic.
Minimal UI elements, no clutter
Pixel perfect borders, vintage limited color tones
Readable labels and clean alignment
Layout includes: main grid, score panel, next preview, controls, status

[PART 2, PLAYABLE GAME IMPLEMENTATION]
Build a fully playable Fishing Derby game using React and TypeScript. The final result must build and run cleanly.

[CONTROLS AND INPUT MAPPING]
If the fishing line is above water the left arrow changes the man to face the left and the pole extends over the left of the boat
If the fishing line is above water the right arrow changes the man to face the right and the pole extends over the right of the boat

After the fishing line enters the water: 
Left arrow moves left
Right arrow moves right
Down arrow soft drops
Space bar drops the bar at 2x the speed of the down arrow 
Add a pause toggle and reset button in the UI

[CORE GAME LOGIC REQUIREMENTS]

[PIECE SYSTEM]
Enforce collision detection against walls, floor, and hazards

[FALLING]
When the fishing line intersects a hazard, they connect and from that point until the hazard is removed from the board

[Hazard Clearing]
The hazard will be cleared when it collides with a fish or is fully removed from the water
If it collides with a fish, the fish is also removed and no points are awarded
If the hazard is removed from the water points are awarded based on the scoring below

[Game SCORING]
Apply scoring by hazard:
plastic drink rings: 50 points
plastic bags: 75 points
fishing nets: 100 points
discarded fishing line: 25 points
Hazard on the fishing line colliding with a fish: 0 points can be earned


[UI FEATURES INSIDE THE GAME]
Current score and level display
Game status display (playing, paused, game over)
Game over view and restart

[DEBUGGING AND COMMON ISSUE HANDLING]
Add a Debug Mode flag that can be toggled on and off. When on, show lightweight diagnostics and console logs that help you pinpoint problems quickly.

[A. COLLISION DETECTION AND ISSUES TO PROACTIVELY PREVENT]
isValidMove must correctly handle:
Left boundary and right boundary checks
Bottom boundary checks so pieces and fishing line stop at the bottom
Collision with placed pieces only when the piece cells are within the visible board
Piece locking must be immediate
Fishing line collision with a hazard locks the two pieces and then the two pieces move together
A fishing without a hazard can pass by a fish without issue, a fishing line with a hazard connected that collides with a fish will remove the fish, the hazard, and reset the fishing line to the starting point
Ensure hard drop cannot skip collision checks
Add boundary checks
Rendering bounds must be safe

[B. VALIDATION]
Add a dev time validation function that asserts each piece has consistent dimensions
If validation fails, throw a clear error naming the piece and the exact issue

[C. CONNECTED HAZARD BUG]
If fishing line with a hazard attached pushes a piece outside the board, apply a simple wall kick, such as shifting left or right by 1 or 2 cells to find a valid position
If no valid position exists after the small shifts, keep moving the pieces right or left until a valid position is found
In debug mode log attempted offsets tried, and whether the offset succeeded

[D. SCORING BUGS]
Run fish, and hazard removal after collision with scoring of collision at 0 no points available for removing the hazard
In debug mode log number of lines cleared, rows cleared, points awarded, new score

[E. GAME OVER DETECTION EDGE CASES]
If three fish on screen are removed the result is a game over
In debug mode log number of successful hazard removals, collisions with fish, and overlap result

[F. REACT HOOKS ORDERING AND STALE CLOSURE ISSUES]
Prevent React hook ordering errors and state bugs inside the useGameLogic hook.
Do not conditionally call hooks, ever
Do not add or remove hooks in a way that changes their order across renders
Keep useState, useRef, useCallback, and useEffect calls in a consistent order every render
Do not introduce extra refs or hooks mid refactor that change hook ordering, this can cause the inconsistent hook ordering error

[LOCKING LOGIC GUIDANCE TO AVOID HOOK ISSUES]
Prefer keeping locking logic inside stable callbacks used by drop and hardDrop
Avoid unnecessary extra refs and callbacks that increase complexity
Ensure dependency arrays are correct so callbacks do not capture stale state

[WHEN DEBUGGING HOOK ORDERING ISSUES]
Check for a recently added useRef or hook that only runs in certain conditions
Remove the extra hook and consolidate logic so the hook call list stays identical on every render
In debug mode log state transitions and tick events so you can confirm no duplicate intervals or double locking occurs

[G. INTERVAL AND PAUSE HANDLING]
Stop the drop when paused or game over
Restart the drop cleanly when resuming
In debug mode log interval start, stop, and tick timing

[REQUIRED OUTCOME]
A retro pixel style Fishing Derby game UI that matches the Figma layout
A working React and TypeScript Fishing Derby game with correct controls, collision, dropping, immediate locking, scoring, level speed increases, pause, reset, game over
A built in debugging checklist and debug mode diagnostics that address the common issues above.


[GAMEPLAY FLOW]

Start Screen
Welcome screen with game introduction
Click "Start Game" to begin

Game Phase
Game starts with the first level
There are five levels, each one adding complexity to the game with questions coming from an external spreadsheet that can be edited
The first level will be the easiest with five small fish and three hazards
Subsequent levels will mix in medium and then large fish, at level five all fish should be large or medium with at least three being large fish - fish size is randomly generated
Large fish will not show up until level 3
Each level will have five fish at the start
Levels are completed when all hazards have been removed from the board or three fish have been removed from the game board

Question Phase
At the completion of each level a question is asked
4 multiple-choice answers presented
30-second timer counts down with pressure mechanics:
At 10 seconds: Tick sound every second
At 5 seconds: Urgent beeping + visual effects (pulsing timer, bouncing clock icon, red border)
Select your answer quickly to maximize points

Game End

After answering all 5 questions, a celebration screen appears with confetti
Displays your final score

[SCORING SYSTEM]
Correct Answers: 100-300 points (speed-based)
Faster responses = higher points
Maximum 300 points for instant answers
Minimum 100 points if answered near time limit
Wrong Answers: -50 points penalty
Game scoring: Add points from the [Game SCORING] section of these instructions

[GAME OVER CONDITIONS]
The game ends after all five levels have been completed or three fish have been removed because a hazard intersected with a fish
Time runs out on a question (automatically proceeds)

[KEY FEATURES]
Full 8-bit retro sound effects for all actions
Visual and audio feedback throughout
Progressive difficulty through question progression
